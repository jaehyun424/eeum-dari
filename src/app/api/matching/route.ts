import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';
import { ApiErrorCode, type ApiErrorResponse } from '@/lib/types/api-errors';
import { generateMatches } from '@/lib/matching/algorithm';
import {
  getCareRequestById,
  mockCareRequests,
} from '@/lib/mock/care-requests';

// 요청 body 스키마 — careRequestId는 필수
const bodySchema = z.object({
  careRequestId: z.string().min(1),
});

// 표준 에러 응답 헬퍼 — 프로덕션에서는 stack trace 노출 금지
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

    const { careRequestId } = parsed.data;
    // ID로 찾지 못하면 mock 첫 번째로 폴백 (데모용 동작)
    const careRequest =
      getCareRequestById(careRequestId) ?? mockCareRequests[0];

    if (!careRequest) {
      return apiError(
        ApiErrorCode.NOT_FOUND,
        '간병 신청 정보를 찾을 수 없습니다',
        404,
      );
    }

    // UX 테스트용 지연
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = generateMatches(careRequest);
    return NextResponse.json(result);
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
