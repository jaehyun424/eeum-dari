import type { MatchScore, MatchingCriteria } from '@/lib/types/matching';
import type { CaregiverProfile } from '@/lib/types/database';

// 매칭 점수 가중치
const WEIGHTS = {
  distance: 0.25,
  experience: 0.2,
  availability: 0.2,
  rating: 0.15,
  skillMatch: 0.2,
} as const;

export function calculateMatchScore(
  caregiver: CaregiverProfile,
  criteria: MatchingCriteria,
): MatchScore {
  const breakdown = {
    distance: calculateDistanceScore(caregiver, criteria.location),
    experience: calculateExperienceScore(caregiver),
    availability: calculateAvailabilityScore(caregiver, criteria),
    rating: calculateRatingScore(caregiver),
    skillMatch: calculateSkillMatchScore(caregiver, criteria.careItems),
  };

  const totalScore =
    breakdown.distance * WEIGHTS.distance +
    breakdown.experience * WEIGHTS.experience +
    breakdown.availability * WEIGHTS.availability +
    breakdown.rating * WEIGHTS.rating +
    breakdown.skillMatch * WEIGHTS.skillMatch;

  return {
    caregiverId: caregiver.id,
    totalScore: Math.round(totalScore * 100) / 100,
    breakdown,
  };
}

function calculateDistanceScore(
  caregiver: CaregiverProfile,
  _location: string,
): number {
  // TODO: 실제 거리 계산 로직 구현
  return caregiver.available_areas.length > 0 ? 0.8 : 0.3;
}

function calculateExperienceScore(caregiver: CaregiverProfile): number {
  const years = caregiver.experience_years;
  if (years >= 10) return 1.0;
  if (years >= 5) return 0.8;
  if (years >= 2) return 0.6;
  return 0.4;
}

function calculateAvailabilityScore(
  _caregiver: CaregiverProfile,
  _criteria: MatchingCriteria,
): number {
  // TODO: 일정 겹침 체크 로직 구현
  return 0.7;
}

function calculateRatingScore(caregiver: CaregiverProfile): number {
  if (caregiver.total_reviews === 0) return 0.5;
  return caregiver.rating / 5;
}

function calculateSkillMatchScore(
  caregiver: CaregiverProfile,
  requiredItems: string[],
): number {
  if (requiredItems.length === 0) return 1.0;
  const matchCount = requiredItems.filter((item) =>
    caregiver.certifications.includes(item),
  ).length;
  return matchCount / requiredItems.length;
}
