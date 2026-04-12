import { createClient } from '@supabase/supabase-js';

// Service Role 클라이언트 (서버 전용, 관리자 작업용)
// 주의: RLS를 우회하므로 서버 측에서만 사용할 것
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
