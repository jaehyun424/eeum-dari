import { NextRequest, NextResponse } from 'next/server';

// Stripe 웹훅 시크릿 (배포 시 환경변수로 설정)
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? '';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'webhooks',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  // 1) 시그니처 검증
  const signature =
    req.headers.get('stripe-signature') ??
    req.headers.get('x-webhook-signature') ??
    '';

  if (STRIPE_WEBHOOK_SECRET && !signature) {
    return NextResponse.json(
      { error: 'Missing signature header' },
      { status: 401 },
    );
  }

  // 2) 바디 파싱
  const body = (await req.json().catch(() => null)) as {
    type?: string;
    data?: unknown;
  } | null;

  if (!body?.type) {
    return NextResponse.json(
      { error: 'Invalid webhook payload: missing type' },
      { status: 400 },
    );
  }

  // 3) 이벤트 타입별 라우팅 — 현재는 로그만
  // TODO: Stripe/Supabase 이벤트 처리 확장 지점
  switch (body.type) {
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

  return NextResponse.json({ received: true, type: body.type });
}
