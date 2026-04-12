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

export interface CaregiverProfile {
  id: string;
  user_id: string;
  experience_years: number;
  certifications: string[];
  available_areas: string[];
  hourly_rate: number;
  bio: string;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: string;
  care_request_id: string;
  caregiver_id: string;
  guardian_id: string;
  status: ContractStatus;
  start_date: string;
  end_date: string;
  daily_rate: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface WorkLog {
  id: string;
  contract_id: string;
  caregiver_id: string;
  date: string;
  start_time: string;
  end_time: string;
  notes: string;
  created_at: string;
}
