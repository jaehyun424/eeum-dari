import type { CareRequest } from '@/lib/types/database';
import type { CareRequestFormData } from '@/lib/types/forms';
import { mockCareRequests } from '@/lib/mock/care-requests';

// 런타임 메모리 저장소 — beta 단계용.
// 주의: Vercel serverless 환경에서는 function instance마다 state가 분리되므로
// 실제 persistent 저장은 Supabase 적용 단계에서 대체된다. 지금은 개발 서버 /
// 동일 lambda 내 즉시 조회를 지원하는 용도로만 사용.
const runtimeStore = new Map<string, CareRequest>();

function makeRequestId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `req-${ts}-${rand}`;
}

export function saveCareRequest(
  data: Partial<CareRequestFormData>,
): CareRequest {
  const id = makeRequestId();
  const now = new Date().toISOString();
  const record: CareRequest = {
    id,
    guardian_id: 'beta-guest',
    hospital_id: data.hospitalId ?? '',
    patient_name: data.patientName ?? '',
    patient_age: data.patientAge ?? 0,
    patient_gender: data.patientGender ?? 'female',
    care_start_date: data.careStartDate ?? now,
    care_end_date: data.careEndDate ?? '',
    care_items: data.careItems ?? [],
    risk_flags: data.riskFlags ?? [],
    preferences: {
      preferredGender: data.preferredGender ?? 'any',
      nightCareNeeded: data.nightCareNeeded ?? false,
      mobilityLevel: data.mobilityLevel ?? 'independent',
      notes: data.additionalNotes ?? '',
    },
    status: 'matching',
    created_at: now,
    updated_at: now,
  };
  runtimeStore.set(id, record);
  return record;
}

// 런타임 저장소를 먼저 조회하고, 없으면 mock 데모 데이터로 폴백.
// mock에도 없으면 null — 호출부에서 404 처리.
export function findCareRequest(id: string): CareRequest | null {
  return (
    runtimeStore.get(id) ??
    mockCareRequests.find((r) => r.id === id) ??
    null
  );
}

export function buildCareRequestFromForm(
  data: Partial<CareRequestFormData>,
  overrideId?: string,
): CareRequest {
  const now = new Date().toISOString();
  return {
    id: overrideId ?? makeRequestId(),
    guardian_id: 'beta-guest',
    hospital_id: data.hospitalId ?? '',
    patient_name: data.patientName ?? '',
    patient_age: data.patientAge ?? 0,
    patient_gender: data.patientGender ?? 'female',
    care_start_date: data.careStartDate ?? now,
    care_end_date: data.careEndDate ?? '',
    care_items: data.careItems ?? [],
    risk_flags: data.riskFlags ?? [],
    preferences: {
      preferredGender: data.preferredGender ?? 'any',
      nightCareNeeded: data.nightCareNeeded ?? false,
      mobilityLevel: data.mobilityLevel ?? 'independent',
      notes: data.additionalNotes ?? '',
    },
    status: 'matching',
    created_at: now,
    updated_at: now,
  };
}
