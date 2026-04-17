import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { ApiErrorCode, type ApiErrorResponse } from '@/lib/types/api-errors';

// Stripe 웹훅 엔드포인트.
//
// 정식 모드 (STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET 둘 다 존재):
//   - raw body + stripe-signature 헤더로 constructEvent 실제 검증.
//   - 검증 실패 시 401. 이벤트 타입별 핸들러는 TODO로 남김.
//
// Mock 모드 (env 미설정):
//   - 서명 없이도 200 OK + {received, mode: 'mock'} 반환 → 로컬 개발 편의.
//   - 실제 payment/refund 처리는 하지 않음.
//
// 중요: Stripe는 raw body가 필요하므로 req.json()이 아닌 req.text() 사용.

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? '';

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

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
    mode: stripe && STRIPE_WEBHOOK_SECRET ? 'stripe' : 'mock',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    // Mock 모드: 로컬/베타에서 env 없이도 200 OK
    if (!stripe || !STRIPE_WEBHOOK_SECRET) {
      const body = await req.text().catch(() => '');
      const preview = body.length > 200 ? body.slice(0, 200) + '…' : body;
      console.info('[webhooks] mock mode — env 미설정, 검증 생략', {
        bytes: body.length,
        preview,
      });
      return NextResponse.json({ received: true, mode: 'mock' });
    }

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return apiError(
        ApiErrorCode.UNAUTHORIZED,
        '서명 헤더(stripe-signature)가 없습니다',
        401,
      );
    }

    // Stripe는 raw body를 요구한다 — .text() 사용 (.json() 금지)
    const rawBody = await req.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      return apiError(
        ApiErrorCode.UNAUTHORIZED,
        '웹훅 서명 검증에 실패했습니다',
        401,
        err,
      );
    }

    // TODO: 이벤트 타입별 도메인 로직은 Supabase 실제 스키마 적용과 함께 구현.
    // 현재는 수신 사실만 로깅하고 200 OK.
    switch (event.type) {
      case 'payment_intent.succeeded':
      case 'payment_intent.payment_failed':
      case 'charge.refunded':
      case 'customer.subscription.created':
        console.info('[webhooks] received', event.type, event.id);
        break;
      default:
        console.info('[webhooks] unhandled type', event.type, event.id);
        break;
    }

    return NextResponse.json({ received: true, type: event.type });
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
