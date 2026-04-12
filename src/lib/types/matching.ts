import type { CaregiverProfile, CareRequest } from './database';

export interface MatchScore {
  caregiverId: string;
  totalScore: number;
  breakdown: {
    distance: number;
    experience: number;
    availability: number;
    rating: number;
    skillMatch: number;
  };
}

export interface MatchResult {
  careRequest: CareRequest;
  matches: Array<{
    caregiver: CaregiverProfile;
    score: MatchScore;
  }>;
  createdAt: string;
}

export interface MatchingCriteria {
  careItems: string[];
  riskFlags: string[];
  location: string;
  startDate: string;
  endDate: string;
  preferredGender?: 'male' | 'female' | 'any';
}
