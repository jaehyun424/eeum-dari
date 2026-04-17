import { createBrowserClient } from '@supabase/ssr';

// env 누락 시 호출부가 분기 처리하도록 실제 값이 없으면 throw.
// useAuth는 isSupabaseConfigured()로 선제 검사 후 이 함수를 호출한다.
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('Missing Supabase env — NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return createBrowserClient(url, anonKey);
}
