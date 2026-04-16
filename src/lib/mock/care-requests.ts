import type { CareRequest } from '@/lib/types/database';

export const mockCareRequests: CareRequest[] = [
  {
    id: 'req-1',
    guardian_id: 'g-001',
    hospital_id: 'h1', // 서울대학교병원
    patient_name: '김말순',
    patient_age: 72,
    patient_gender: 'female',
    care_start_date: '2026-04-20',
    care_end_date: '2026-05-20',
    care_items: [
      'basic_meal',
      'basic_diaper',
      'basic_hygiene',
      'basic_position',
      'basic_medicine',
      'move_transfer',
    ],
    risk_flags: ['risk_fall', 'risk_bedsore', 'risk_infection'],
    preferences: {
      preferredGender: 'female',
      nightCareNeeded: true,
      mobilityLevel: 'bedridden',
      notes: '뇌졸중 후 와상 상태. 24시간 간병 필요.',
    },
    status: 'matching',
    created_at: '2026-04-17T09:00:00.000Z',
    updated_at: '2026-04-17T09:00:00.000Z',
  },
  {
    id: 'req-2',
    guardian_id: 'g-002',
    hospital_id: 'h2', // 삼성서울병원
    patient_name: '박기철',
    patient_age: 68,
    patient_gender: 'male',
    care_start_date: '2026-04-22',
    care_end_date: '2026-05-06',
    care_items: ['basic_meal', 'basic_medicine', 'move_walk', 'emotional_companion'],
    risk_flags: [],
    preferences: {
      preferredGender: 'any',
      nightCareNeeded: false,
      mobilityLevel: 'assisted',
      notes: '고관절 수술 후 회복기. 주간 8시간 간병.',
    },
    status: 'matching',
    created_at: '2026-04-17T10:00:00.000Z',
    updated_at: '2026-04-17T10:00:00.000Z',
  },
  {
    id: 'req-3',
    guardian_id: 'g-003',
    hospital_id: 'h6', // 분당서울대병원
    patient_name: '이점례',
    patient_age: 85,
    patient_gender: 'female',
    care_start_date: '2026-04-19',
    care_end_date: '2026-06-19',
    care_items: [
      'basic_meal',
      'basic_diaper',
      'basic_hygiene',
      'basic_medicine',
      'move_wheelchair',
      'emotional_companion',
    ],
    risk_flags: ['risk_dementia', 'risk_fall', 'risk_wandering'],
    preferences: {
      preferredGender: 'female',
      nightCareNeeded: true,
      mobilityLevel: 'wheelchair',
      notes: '치매 중기 + 낙상 위험. 장기 간병.',
    },
    status: 'matching',
    created_at: '2026-04-17T11:00:00.000Z',
    updated_at: '2026-04-17T11:00:00.000Z',
  },
];

export function getCareRequestById(id: string): CareRequest | undefined {
  return mockCareRequests.find((r) => r.id === id);
}
