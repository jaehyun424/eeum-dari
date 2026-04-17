import { NextResponse } from 'next/server';

// 이 엔드포인트는 health/info용으로만 존재한다.
// 실제 signIn/signUp/signOut은 클라이언트에서 `useAuth` 훅(Supabase browser client)을
// 통해 직접 처리하며, 여기 POST는 의도적으로 제공하지 않는다.

export async function GET() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  return NextResponse.json({
    status: 'ok',
    service: 'auth',
    mode: configured ? 'supabase' : 'beta-preview',
    note: '인증은 클라이언트의 useAuth 훅에서 Supabase로 직접 처리합니다.',
    timestamp: new Date().toISOString(),
  });
}
