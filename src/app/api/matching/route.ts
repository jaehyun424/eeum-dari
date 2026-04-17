import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';
import { ApiErrorCode, type ApiErrorResponse } from '@/lib/types/api-errors';
import { generateMatches } from '@/lib/matching/algorithm';
import {
  buildCareRequestFromForm,
  findCareRequest,
  saveCareRequest,
} from '@/lib/repositories/care-requests';

// 요청 body — 두 가지 형태 지원
//   1) { careRequestId }        기존 저장된 신청 ID로 매칭 재조회
//   2) { formData, ... }        새 신청 제출 + 매칭 (beta: 런타임 저장)
// 세 번째 변형 { careRequestId, formData } 는 id 미발견 시 formData로 fallback.
const bodySchema = z.union([
  z.object({
    careRequestId: z.string().min(1),
    formData: z
      .object({
        hospitalId: z.string().optional(),
        patientName: z.string().optional(),
        patientAge: z.number().optional(),
        patientGender: z.enum(['male', 'female']).optional(),
        careItems: z.array(z.string()).optional(),
        riskFlags: z.array(z.string()).optional(),
        preferredGender: z.enum(['male', 'female', 'any']).optional(),
        careStartDate: z.string().optional(),
        careEndDate: z.string().optional(),
        nightCareNeeded: z.boolean().optional(),
        mobilityLevel: z
          .enum(['independent', 'assisted', 'wheelchair', 'bedridden'])
          .optional(),
        additionalNotes: z.string().optional(),
      })
      .optional(),
  }),
  z.object({
    formData: z.object({
      hospitalId: z.string().optional(),
      patientName: z.string().optional(),
      patientAge: z.number().optional(),
      patientGender: z.enum(['male', 'female']).optional(),
      careItems: z.array(z.string()).optional(),
      riskFlags: z.array(z.string()).optional(),
      preferredGender: z.enum(['male', 'female', 'any']).optional(),
      careStartDate: z.string().optional(),
      careEndDate: z.string().optional(),
      nightCareNeeded: z.boolean().optional(),
      mobilityLevel: z
        .enum(['independent', 'assisted', 'wheelchair', 'bedridden'])
        .optional(),
      additionalNotes: z.string().optional(),
    }),
  }),
]);

function apiError(
  code: ApiErrorCode,
  message: string,
  status: number,
  err?: unknown,
): NextResponse<ApiErrorResponse> {
  const body: ApiErrorResponse = { error: message, code };
  if (process.env.NODE_ENV !== 'production' && err instanceof Error) {
    body.details = err.message;
  }
  return NextResponse.json(body, { status });
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => null);
    const parsed = bodySchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ApiErrorCode.INVALID_REQUEST, '잘못된 요청입니다', 400);
    }

    // UX 테스트용 살짝 지연 — 매칭 애니메이션과 합쳐져 natural feel
    await new Promise((resolve) => setTimeout(resolve, 400));

    // case A: { formData } — 새 신청 저장 + 매칭
    if (!('careRequestId' in parsed.data) && 'formData' in parsed.data) {
      const saved = saveCareRequest(parsed.data.formData);
      const result = generateMatches(saved);
      return NextResponse.json({ ...result, careRequestId: saved.id });
    }

    // case B: { careRequestId, formData? } — id로 조회, 없으면 formData fallback
    if ('careRequestId' in parsed.data) {
      const found = findCareRequest(parsed.data.careRequestId);
      if (found) {
        const result = generateMatches(found);
        return NextResponse.json({ ...result, careRequestId: found.id });
      }
      // Vercel serverless 환경에서 runtime store가 날아갔을 때만 동작하는 fallback.
      // client가 sessionStorage에서 복구해 formData를 함께 보냄.
      if (parsed.data.formData) {
        const rebuilt = buildCareRequestFromForm(
          parsed.data.formData,
          parsed.data.careRequestId,
        );
        const result = generateMatches(rebuilt);
        return NextResponse.json({ ...result, careRequestId: rebuilt.id });
      }
      return apiError(
        ApiErrorCode.NOT_FOUND,
        '간병 신청을 찾을 수 없습니다. 처음부터 다시 신청해주세요.',
        404,
      );
    }

    return apiError(ApiErrorCode.INVALID_REQUEST, '잘못된 요청입니다', 400);
  } catch (err) {
    console.error('[api/matching] POST failed', err);
    return apiError(
      ApiErrorCode.INTERNAL_ERROR,
      '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
      500,
      err,
    );
  }
}
