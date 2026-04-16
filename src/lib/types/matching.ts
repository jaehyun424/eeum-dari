import type { CaregiverProfile, CareRequest } from './database';

export interface MatchBreakdown {
  distance: number;
  experience: number;
  availability: number;
  rating: number;
  skillMatch: number;
  riskHandling: number;
}

export interface MatchScore {
  caregiverId: string;
  totalScore: number;
  breakdown: MatchBreakdown;
  recommendationReason: string[];
  manualReviewRequired: boolean;
  manualReviewReason: string | null;
}

export interface MatchResult {
  careRequest: CareRequest;
  matches: Array<{
    caregiver: CaregiverProfile;
    score: MatchScore;
  }>;
  manualReviewRequired: boolean;
  manualReviewReason: string | null;
  createdAt: string;
}

export interface MatchingCriteria {
  careItems: string[];
  riskFlags: string[];
  hospitalId: string;
  startDate: string;
  endDate: string;
  preferredGender?: 'male' | 'female' | 'any';
}

export type MatchingStatus = 'idle' | 'loading' | 'success' | 'error';
