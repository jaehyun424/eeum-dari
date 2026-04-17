import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Next.js 16 convention: `proxy` replaces `middleware`.
// Proxy는 세션 쿠키 refresh + 가벼운 redirect만 담당한다.
// 세부 권한 판정은 각 server component / route handler에서 이중 확인한다.

const PROTECTED_PREFIXES = ['/guardian', '/caregiver', '/admin'] as const;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = await updateSession(request);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // env 미설정 — 로컬 dev/mock 모드에서는 보호 스킵 (honest fallback)
  if (!supabaseUrl || !supabaseAnonKey) return response;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return response;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: () => {},
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = user.user_metadata?.role as
    | 'guardian'
    | 'caregiver'
    | 'admin'
    | undefined;

  // role mismatch → 반대편 대시보드로 유도
  if (pathname.startsWith('/guardian') && role === 'caregiver') {
    return NextResponse.redirect(new URL('/caregiver/dashboard', request.url));
  }
  if (pathname.startsWith('/caregiver') && role === 'guardian') {
    return NextResponse.redirect(new URL('/guardian/dashboard', request.url));
  }
  // /admin 접근은 role === 'admin' 일 때만 허용, 그 외엔 랜딩으로
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    // 정적 자산·메타 파일 제외, 나머지 전부 proxy 통과
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm)$).*)',
  ],
};
