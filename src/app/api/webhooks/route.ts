import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';
import { ApiErrorCode, type ApiErrorResponse } from '@/lib/types/api-errors';

// Stripe 웹훅 시크릿 (배포 시 환경변수로 설정)
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? '';

// 웹훅 바디 — type 필수, data는 타입별로 다르므로 unknown 허용
const webhookSchema = z.object({
  type: z.string().min(1),
  data: z.unknown().optional(),
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
    service: 'webhooks',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    // 1) 시그니처 검증 — 시크릿이 설정되어 있으면 헤더 필수
    const signature =
      req.headers.get('stripe-signature') ??
      req.headers.get('x-webhook-signature') ??
      '';

    if (STRIPE_WEBHOOK_SECRET && !signature) {
      return apiError(
        ApiErrorCode.UNAUTHORIZED,
        '시그니처 헤더가 필요합니다',
        401,
      );
    }

    // 2) 바디 파싱 + Zod 검증
    const rawBody = await req.json().catch(() => null);
    const parsed = webhookSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(
        ApiErrorCode.INVALID_REQUEST,
        '잘못된 웹훅 페이로드입니다',
        400,
      );
    }

    const { type } = parsed.data;

    // 3) 이벤트 타입별 라우팅 — 현재는 로그만
    // TODO: Stripe/Supabase 이벤트 처리 확장 지점
    switch (type) {
      case 'payment_intent.succeeded':
        // TODO: 에스크로 결제 확정 → 간병 계약 상태 active 전환
        break;
      case 'payment_intent.payment_failed':
        // TODO: 결제 실패 처리 → 계약 상태 rollback
        break;
      case 'charge.refunded':
        // TODO: 환불 → 정산 조정
        break;
      case 'supabase.auth.signed_up':
        // TODO: 신규 사용자 후속 작업 (프로필 row 생성 등)
        break;
      default:
        // 알 수 없는 이벤트는 무시하되 200 OK (재시도 방지)
        break;
    }

    return NextResponse.json({ received: true, type });
  } catch (err) {
    console.error('[api/webhooks] POST failed', err);
    return apiError(
      ApiErrorCode.INTERNAL_ERROR,
      '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
      500,
      err,
    );
  }
}
