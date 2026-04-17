'use client';

import { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/types/forms';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-8 w-24 rounded bg-warm-gray-200" />
      <div className="h-4 w-2/3 rounded bg-warm-gray-100" />
      <div className="space-y-4 pt-4">
        <div className="h-12 rounded-lg bg-warm-gray-100" />
        <div className="h-12 rounded-lg bg-warm-gray-100" />
        <div className="h-12 rounded-lg bg-warm-gray-100" />
      </div>
      <div className="space-y-3 pt-6">
        <div className="h-12 rounded-xl bg-warm-gray-100" />
        <div className="h-12 rounded-xl bg-warm-gray-100" />
        <div className="h-12 rounded-xl bg-warm-gray-100" />
      </div>
    </div>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') ?? '/guardian/dashboard';
  const justRegistered = searchParams.get('registered') === '1';

  const { signIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (justRegistered) {
      setToast({
        type: 'success',
        message: '회원가입이 완료됐어요. 로그인해주세요.',
      });
    }
  }, [justRegistered]);

  async function onSubmit(data: LoginFormData) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        // Supabase env 미설정이면 초기화 자체가 fail — 동일 flow에서 처리
        const msg = error.message ?? '';
        setToast({
          type: 'error',
          message:
            msg === 'Invalid login credentials'
              ? '이메일 또는 비밀번호가 올바르지 않습니다'
              : msg.includes('Missing')
                ? '로그인 서비스가 현재 연결되어 있지 않습니다 (베타)'
                : '로그인에 실패했습니다. 잠시 후 다시 시도해주세요',
        });
        return;
      }
      router.push(nextPath);
    } catch {
      setToast({
        type: 'error',
        message: '로그인 서비스가 현재 연결되어 있지 않습니다 (베타)',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function showPreparationToast() {
    setToast({
      type: 'info',
      message: '소셜 로그인은 준비 중입니다. 이메일로 로그인해주세요.',
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold text-foreground">로그인</h1>
      <p className="mt-2 text-base text-muted">
        이음다리에 오신 것을 환영합니다.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
        <Input
          id="email"
          type="email"
          label="이메일"
          placeholder="example@email.com"
          className="py-3"
          error={errors.email?.message}
          autoComplete="email"
          {...register('email')}
        />
        <Input
          id="password"
          type="password"
          label="비밀번호"
          placeholder="6자 이상 입력해주세요"
          className="py-3"
          error={errors.password?.message}
          autoComplete="current-password"
          {...register('password')}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full h-[52px] text-base"
            isLoading={isSubmitting}
          >
            로그인
          </Button>
        </div>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-sm text-muted">또는</span>
        </div>
      </div>

      <div className="space-y-3">
        <SocialButton
          label="카카오로 시작하기"
          letter="K"
          onClick={showPreparationToast}
          variant="kakao"
        />
        <SocialButton
          label="네이버로 시작하기"
          letter="N"
          onClick={showPreparationToast}
          variant="naver"
        />
        <SocialButton
          label="Google로 시작하기"
          letter="G"
          onClick={showPreparationToast}
          variant="google"
        />
        <p className="text-center text-xs text-muted">
          소셜 로그인은 베타 기간 중 준비 중입니다
        </p>
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        아직 회원이 아니신가요?{' '}
        <Link
          href={`/register${nextPath !== '/guardian/dashboard' ? `?next=${encodeURIComponent(nextPath)}` : ''}`}
          className="font-semibold text-brand-600 hover:underline"
        >
          회원가입
        </Link>
      </p>

      <Toast
        type={toast?.type ?? 'info'}
        message={toast?.message ?? ''}
        isVisible={toast !== null}
        onClose={() => setToast(null)}
      />
    </motion.div>
  );
}

function SocialButton({
  label,
  letter,
  onClick,
  variant,
}: {
  label: string;
  letter: string;
  onClick: () => void;
  variant: 'kakao' | 'naver' | 'google';
}) {
  const styles: Record<typeof variant, string> = {
    kakao: 'bg-[#FEE500] text-[#191919] hover:bg-[#F5DC00]',
    naver: 'bg-[#03C75A] text-white hover:bg-[#02b351]',
    google: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
  };
  const iconStyles: Record<typeof variant, string> = {
    kakao: 'bg-[#191919]/10 text-[#191919]',
    naver: 'bg-white/20 text-white',
    google: 'bg-gray-100 text-gray-500',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label} (준비 중)`}
      title="준비 중"
      className={`flex h-[52px] w-full items-center justify-center gap-2 rounded-xl font-semibold opacity-70 transition-colors ${styles[variant]}`}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-md text-sm font-bold ${iconStyles[variant]}`}
      >
        {letter}
      </span>
      {label}
    </button>
  );
}
