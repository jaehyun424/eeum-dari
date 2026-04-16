import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';
import { ApiErrorCode, type ApiErrorResponse } from '@/lib/types/api-errors';

// 요청 body 스키마 — action은 세 값 중 하나여야 함
const authSchema = z.object({
  action: z.enum(['signin', 'signup', 'signout']),
});

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
    service: 'auth',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => null);
    const parsed = authSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(
        ApiErrorCode.INVALID_REQUEST,
        'action 필드가 올바르지 않습니다',
        400,
      );
    }

    const { action } = parsed.data;

    // TODO: Supabase Auth 연동
    // - signin: supabase.auth.signInWithPassword({ email, password })
    // - signup: supabase.auth.signUp({ email, password, options: { data: { role } } })
    // - signout: supabase.auth.signOut()
    return apiError(
      ApiErrorCode.NOT_IMPLEMENTED,
      `${action} 기능은 아직 구현되지 않았습니다`,
      501,
    );
  } catch (err) {
    console.error('[api/auth] POST failed', err);
    return apiError(
      ApiErrorCode.INTERNAL_ERROR,
      '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
      500,
      err,
    );
  }
}
