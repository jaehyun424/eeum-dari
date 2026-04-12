import { z } from 'zod/v4';

// 간병 신청 폼 스키마
export const careRequestSchema = z.object({
  // Step 1: 병원 정보
  hospitalId: z.string().min(1, '병원을 선택해주세요'),
  wardRoom: z.string().optional(),

  // Step 2: 환자 정보
  patientName: z.string().min(1, '환자 이름을 입력해주세요'),
  patientAge: z.number().min(0).max(150, '올바른 나이를 입력해주세요'),
  patientGender: z.enum(['male', 'female']),
  patientWeight: z.number().optional(),
  diagnosis: z.string().optional(),
  mobilityLevel: z
    .enum(['independent', 'assisted', 'wheelchair', 'bedridden'])
    .optional(),
  positionChangeFreq: z.enum(['none', '2h', '4h', 'medical']).optional(),

  // Step 3: 케어 항목
  careItems: z.array(z.string()).min(1, '최소 1개의 케어 항목을 선택해주세요'),

  // Step 4: 위험 플래그
  riskFlags: z.array(z.string()),

  // Step 5: 선호사항
  preferredGender: z.enum(['male', 'female', 'any']),
  careStartDate: z.string().min(1, '시작일을 입력해주세요'),
  careEndDate: z.string().optional(),
  endDateUndecided: z.boolean().optional(),
  nightCareNeeded: z.boolean().optional(),
  additionalNotes: z.string().optional(),

  // 보호자 정보
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianRelation: z.enum(['spouse', 'child', 'sibling', 'other']).optional(),

  // Step 6: 동의
  sensitiveInfoConsent: z.boolean().optional(),
});

export type CareRequestFormData = z.infer<typeof careRequestSchema>;

// 로그인 폼 스키마
export const loginSchema = z.object({
  email: z.email('올바른 이메일을 입력해주세요'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// 회원가입 폼 스키마
export const registerSchema = z.object({
  email: z.email('올바른 이메일을 입력해주세요'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
  name: z.string().min(1, '이름을 입력해주세요'),
  phone: z.string().min(10, '올바른 전화번호를 입력해주세요'),
  role: z.enum(['guardian', 'caregiver']),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
