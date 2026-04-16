import type { CaregiverProfile, CareRequest } from '@/lib/types/database';
import type {
  CaregiverMatch,
  MatchBreakdown,
  MatchResult,
  MatchScore,
} from '@/lib/types/matching';
import { mockCaregivers } from '@/lib/mock/caregivers';
import { hospitals } from '@/lib/constants/hospitals';

// 매칭 점수 가중치 — 0~1 합계 1.0
export const WEIGHTS = {
  skillMatch: 0.3,
  experience: 0.2,
  rating: 0.2,
  distance: 0.15,
  availability: 0.1,
  riskHandling: 0.05,
} as const;

// 가중치 합 assertion — dev 시 잘못된 가중치를 빨리 발견
const WEIGHT_SUM = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
if (Math.abs(WEIGHT_SUM - 1) > 1e-6) {
  throw new Error(
    `[matching] WEIGHTS 합이 1.0이 아닙니다: ${WEIGHT_SUM}. 가중치 재조정이 필요합니다.`,
  );
}

// 0~100 정수 clamp + NaN 방어 헬퍼
// breakdown/totalScore 모두 이 함수를 통과하도록 강제
function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

// 수동심사가 필요한 위험 플래그
const MANUAL_REVIEW_FLAGS = ['risk_trach', 'risk_suction', 'risk_isolation'];

// 위험 플래그 → 대응 자격 매핑
const RISK_CERT_MAP: Record<string, string> = {
  risk_infection: '감염관리교육',
  risk_fall: 'BLS',
  risk_dementia: '치매전문교육',
  risk_aggressive: '치매전문교육',
  risk_wandering: '치매전문교육',
  risk_bedsore: '감염관리교육',
  risk_trach: 'BLS',
  risk_nasal_tube: 'BLS',
  risk_iv: 'BLS',
  risk_oxygen: 'BLS',
  risk_isolation: '감염관리교육',
};

// 케어 항목 → 전문분야 보너스 매핑
const CARE_SPECIALTY_BONUS: Record<string, string[]> = {
  basic_position: ['와상환자 간병'],
  basic_diaper: ['와상환자 간병', '장기입원 간병'],
  basic_hygiene: ['와상환자 간병'],
  move_transfer: ['재활 보조', '와상환자 간병'],
  move_walk: ['재활 보조'],
  emotional_companion: ['치매환자 간병'],
};

function calcExperience(years: number): number {
  if (years >= 10) return 100;
  if (years >= 5) return 80;
  if (years >= 2) return 60;
  return 40;
}

function calcRating(rating: number, totalReviews: number): number {
  if (totalReviews < 10) return 60;
  return Math.round((rating / 5) * 100);
}

function calcSkillMatch(
  caregiver: CaregiverProfile,
  careItems: string[],
): number {
  if (careItems.length === 0) return 100;

  const hasMedicalCert =
    caregiver.certifications.includes('BLS') ||
    caregiver.certifications.includes('간호조무사');

  const coveredCount = careItems.filter((item) => {
    if (item.startsWith('basic_') || item.startsWith('move_') || item.startsWith('emotional_')) {
      return true;
    }
    if (item === 'med_suction' || item === 'med_tube_feeding') {
      return hasMedicalCert;
    }
    return true;
  }).length;

  let score = (coveredCount / careItems.length) * 100;

  // 전문분야 보너스 (최대 +20)
  let bonus = 0;
  for (const item of careItems) {
    const matching = CARE_SPECIALTY_BONUS[item];
    if (!matching) continue;
    if (matching.some((s) => caregiver.specialties.includes(s))) {
      bonus += 5;
    }
  }
  score += Math.min(20, bonus);

  return Math.min(100, Math.round(score));
}

function extractRegion(hospitalId: string): { fullRegion: string; city: string } {
  const hospital = hospitals.find((h) => h.id === hospitalId);
  if (!hospital) return { fullRegion: '', city: '' };

  const parts = hospital.address.split(' ');
  const city = parts[0] ?? '';
  const district = parts[1] ?? '';
  return { fullRegion: `${city} ${district}`.trim(), city };
}

function calcDistance(caregiver: CaregiverProfile, hospitalId: string): number {
  const { fullRegion, city } = extractRegion(hospitalId);
  // 병원 정보/좌표가 없을 때 NaN을 반환하는 대신 중립 점수(50)로 폴백
  if (!fullRegion) return 50;

  if (caregiver.available_areas.includes(fullRegion)) return 100;
  if (caregiver.available_areas.some((a) => a.startsWith(city))) return 70;
  return 40;
}

function calcAvailability(responseTimeMinutes: number): number {
  if (responseTimeMinutes <= 15) return 100;
  if (responseTimeMinutes <= 30) return 80;
  if (responseTimeMinutes <= 60) return 60;
  return 40;
}

function calcRiskHandling(
  caregiver: CaregiverProfile,
  riskFlags: string[],
): number {
  if (riskFlags.length === 0) return 100;

  const totalCoverable = riskFlags.filter((f) => RISK_CERT_MAP[f]);
  if (totalCoverable.length === 0) return 70;

  const matched = totalCoverable.filter((f) =>
    caregiver.certifications.includes(RISK_CERT_MAP[f]),
  );

  const ratio = matched.length / totalCoverable.length;
  return Math.round(50 + ratio * 50);
}

function buildReasons(
  caregiver: CaregiverProfile,
  breakdown: MatchBreakdown,
  careRequest: CareRequest,
): string[] {
  const reasons: string[] = [];

  if (breakdown.experience >= 80) {
    reasons.push(`경력 ${caregiver.experience_years}년의 숙련된 간병인`);
  } else if (breakdown.experience >= 60) {
    reasons.push(`경력 ${caregiver.experience_years}년의 실무 경험 보유`);
  }

  if (breakdown.rating >= 90) {
    reasons.push(
      `평점 ${caregiver.rating.toFixed(1)} · 완료 ${caregiver.completed_jobs}건의 검증된 실력`,
    );
  } else if (breakdown.rating >= 70 && caregiver.total_reviews >= 10) {
    reasons.push(`평점 ${caregiver.rating.toFixed(1)} / ${caregiver.total_reviews}건 후기`);
  }

  if (breakdown.skillMatch >= 80 && caregiver.specialties.length > 0) {
    reasons.push(`전문분야: ${caregiver.specialties.slice(0, 2).join(' · ')}`);
  }

  if (breakdown.distance === 100) {
    const { fullRegion } = extractRegion(careRequest.hospital_id);
    reasons.push(`${fullRegion} 활동 중 · 병원 인근 거주`);
  } else if (breakdown.distance === 70) {
    reasons.push('병원과 동일 시·도 내 활동');
  }

  if (breakdown.riskHandling >= 80 && careRequest.risk_flags.length > 0) {
    const relevantCerts = caregiver.certifications.filter(
      (c) => c === '감염관리교육' || c === '치매전문교육' || c === 'BLS',
    );
    if (relevantCerts.length > 0) {
      reasons.push(`보유 자격: ${relevantCerts.join(' · ')}`);
    }
  }

  if (breakdown.availability === 100) {
    reasons.push(`평균 응답 ${caregiver.response_time_minutes}분 이내`);
  }

  if (caregiver.is_verified) {
    reasons.push('신원·자격 검증 완료');
  }

  return reasons.slice(0, 4);
}

function calculateMatchScore(
  caregiver: CaregiverProfile,
  careRequest: CareRequest,
): MatchScore {
  // 각 breakdown은 clampScore로 0~100 정수 강제 (CLAUDE.md 불변 규칙)
  const breakdown: MatchBreakdown = {
    skillMatch: clampScore(calcSkillMatch(caregiver, careRequest.care_items)),
    experience: clampScore(calcExperience(caregiver.experience_years)),
    rating: clampScore(calcRating(caregiver.rating, caregiver.total_reviews)),
    distance: clampScore(calcDistance(caregiver, careRequest.hospital_id)),
    availability: clampScore(calcAvailability(caregiver.response_time_minutes)),
    riskHandling: clampScore(calcRiskHandling(caregiver, careRequest.risk_flags)),
  };

  const rawTotal =
    breakdown.skillMatch * WEIGHTS.skillMatch +
    breakdown.experience * WEIGHTS.experience +
    breakdown.rating * WEIGHTS.rating +
    breakdown.distance * WEIGHTS.distance +
    breakdown.availability * WEIGHTS.availability +
    breakdown.riskHandling * WEIGHTS.riskHandling;

  // totalScore도 clamp — NaN/음수/100 초과 모두 방어
  const totalScore = clampScore(rawTotal);

  const manualReviewRequired = careRequest.risk_flags.some((f) =>
    MANUAL_REVIEW_FLAGS.includes(f),
  );

  return {
    caregiverId: caregiver.id,
    totalScore,
    breakdown,
    recommendationReason: buildReasons(caregiver, breakdown, careRequest),
    manualReviewRequired,
    manualReviewReason: manualReviewRequired
      ? '의료행위 경계 항목이 포함되어 있어 전문 간병인 배정을 위한 수동 심사가 필요합니다.'
      : null,
  };
}

export function generateMatches(
  careRequest: CareRequest,
  allCaregivers: CaregiverProfile[] = mockCaregivers,
): MatchResult {
  const manualReviewRequired = careRequest.risk_flags.some((f) =>
    MANUAL_REVIEW_FLAGS.includes(f),
  );
  const manualReviewReason = manualReviewRequired
    ? '의료행위 경계 항목이 포함되어 있어 전문 간병인 배정을 위한 수동 심사가 필요합니다.'
    : null;

  // edge case: 간병인 풀이 비어있을 때 — crash 대신 빈 배열 + topMatch=null 반환
  if (allCaregivers.length === 0) {
    return {
      careRequest,
      matches: [],
      topMatch: null,
      manualReviewRequired,
      manualReviewReason,
      createdAt: new Date().toISOString(),
    };
  }

  const preferredGender = (careRequest.preferences.preferredGender ?? 'any') as
    | 'male'
    | 'female'
    | 'any';

  const eligible = allCaregivers.filter((c) => {
    if (preferredGender === 'any') return true;
    return c.gender === preferredGender;
  });

  const scored: CaregiverMatch[] = eligible
    .map((caregiver) => ({
      caregiver,
      score: calculateMatchScore(caregiver, careRequest),
    }))
    .sort((a, b) => b.score.totalScore - a.score.totalScore)
    .slice(0, 5);

  return {
    careRequest,
    matches: scored,
    // 0명 결과일 때도 topMatch는 null로 명시 (undefined 금지)
    topMatch: scored[0] ?? null,
    manualReviewRequired,
    manualReviewReason,
    createdAt: new Date().toISOString(),
  };
}
