import type { CaregiverProfile, CareRequest } from './database';

// 6개 breakdown 점수 — 각 항목 0~100 정수
export type MatchBreakdown = {
  distance: number;
  experience: number;
  availability: number;
  rating: number;
  skillMatch: number;
  riskHandling: number;
};

export type MatchScore = {
  caregiverId: string;
  totalScore: number; // 0~100 정수 (clamp 적용)
  breakdown: MatchBreakdown;
  recommendationReason: string[];
  manualReviewRequired: boolean;
  manualReviewReason: string | null;
};

// 개별 매칭 엔트리 — 항상 caregiver + score 쌍으로 제공
export type CaregiverMatch = {
  caregiver: CaregiverProfile;
  score: MatchScore;
};

export type MatchResult = {
  careRequest: CareRequest;
  // 간병인 0명이어도 빈 배열 — 절대 undefined 아님
  matches: CaregiverMatch[];
  // 상위 1명의 매칭 — 0명일 때 null
  topMatch: CaregiverMatch | null;
  manualReviewRequired: boolean;
  manualReviewReason: string | null;
  createdAt: string;
};

export type MatchingCriteria = {
  careItems: string[];
  riskFlags: string[];
  hospitalId: string;
  startDate: string;
  endDate: string;
  preferredGender?: 'male' | 'female' | 'any';
};

export type MatchingStatus = 'idle' | 'loading' | 'success' | 'error';
