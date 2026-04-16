import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'auth',
    timestamp: new Date().toISOString(),
  });
}

type AuthAction = 'signin' | 'signup' | 'signout';

interface AuthBody {
  action: AuthAction;
  [key: string]: unknown;
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Partial<AuthBody>;
  const action = body?.action;

  if (!action || !['signin', 'signup', 'signout'].includes(action)) {
    return NextResponse.json(
      { error: 'action 필드가 올바르지 않습니다.' },
      { status: 400 },
    );
  }

  // TODO: Supabase Auth 연동
  // - signin: supabase.auth.signInWithPassword({ email, password })
  // - signup: supabase.auth.signUp({ email, password, options: { data: { role } } })
  // - signout: supabase.auth.signOut()
  return NextResponse.json(
    {
      error: 'Not Implemented',
      message: `${action} is not implemented yet — connect Supabase Auth first.`,
    },
    { status: 501 },
  );
}
