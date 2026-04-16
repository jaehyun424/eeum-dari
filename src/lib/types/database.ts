// Supabase 테이블 타입 정의
// supabase gen types 명령으로 자동 생성된 타입으로 대체 예정

export type UserRole = 'guardian' | 'caregiver' | 'admin';

export type CareRequestStatus =
  | 'draft'
  | 'submitted'
  | 'matching'
  | 'matched'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type ContractStatus =
  | 'pending'
  | 'active'
  | 'completed'
  | 'terminated';

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  name: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface CareRequest {
  id: string;
  guardian_id: string;
  hospital_id: string;
  patient_name: string;
  patient_age: number;
  patient_gender: 'male' | 'female';
  care_start_date: string;
  care_end_date: string;
  care_items: string[];
  risk_flags: string[];
  preferences: Record<string, unknown>;
  status: CareRequestStatus;
  created_at: string;
  updated_at: string;
}

// CaregiverProfile: Supabase에서는 caregiver_profiles 테이블 + profiles 조인 뷰로 제공 예정
// name/age/gender/profile_image/is_verified 등은 조인된 profile 필드로 취급
export interface CaregiverProfile {
  id: string;
  user_id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  experience_years: number;
  certifications: string[];
  specialties: string[];
  available_areas: string[];
  hourly_rate: number;
  daily_rate: number;
  rating: number;
  total_reviews: number;
  completed_jobs: number;
  response_time_minutes: number;
  bio: string;
  profile_image: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CaregiverReview {
  id: string;
  caregiver_id: string;
  guardian_name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Contract {
  id: string;
  care_request_id: string;
  caregiver_id: string;
  caregiver_name: string;
  caregiver_profile_image: string;
  guardian_id: string;
  guardian_name: string;
  hospital_name: string;
  patient_name: string;
  status: ContractStatus;
  start_date: string;
  end_date: string;
  days_total: number;
  days_elapsed: number;
  daily_rate: number;
  total_amount: number;
  review_submitted: boolean;
  created_at: string;
  updated_at: string;
}

export type WorkLogMood = 'happy' | 'normal' | 'tired';

export interface WorkLog {
  id: string;
  contract_id: string;
  caregiver_id: string;
  patient_name: string;
  date: string;
  start_time: string;
  end_time: string;
  notes: string;
  mood: WorkLogMood;
  significant_events: string[];
  meal_count: number;
  bathroom_count: number;
  medicine_taken: boolean;
  created_at: string;
}

export type EarningStatus = 'pending' | 'paid';

export interface EarningEntry {
  id: string;
  contract_id: string;
  caregiver_id: string;
  work_date: string;
  hours: number;
  amount: number;
  status: EarningStatus;
  paid_at: string | null;
}

export interface MonthlyEarning {
  month: string; // e.g. '2026-04'
  total: number;
  days_worked: number;
  status: EarningStatus;
}
