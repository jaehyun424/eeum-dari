'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { AuthError, User } from '@supabase/supabase-js';

// Supabase env가 없을 때는 브라우저 클라이언트 생성 자체가 throw한다.
// useAuth는 이 실패를 숨기지 않고 { user: null, error } 형태로 정직하게 노출한다.
function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function missingEnvError(): AuthError {
  return {
    name: 'AuthConfigError',
    message: 'Missing Supabase env — auth is in beta/preview mode',
    status: 0,
    code: 'missing_env',
  } as unknown as AuthError;
}

export function useAuth() {
  // env 미설정이면 auth 구독 자체가 필요 없어 loading을 처음부터 false로 초기화.
  // (set-state-in-effect 회피)
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => isSupabaseConfigured());

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { data: { user: null, session: null }, error: missingEnvError() };
    }
    const supabase = createClient();
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: Record<string, unknown>,
  ) => {
    if (!isSupabaseConfigured()) {
      return { data: { user: null, session: null }, error: missingEnvError() };
    }
    const supabase = createClient();
    return supabase.auth.signUp({
      email,
      password,
      options: metadata ? { data: metadata } : undefined,
    });
  };

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      return { error: missingEnvError() };
    }
    const supabase = createClient();
    return supabase.auth.signOut();
  };

  return { user, loading, signIn, signUp, signOut, isConfigured: isSupabaseConfigured() };
}
