'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/types/forms';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginFormData) {
    console.log(data);
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

      {/* Login form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <Input
          id="email"
          type="email"
          label="이메일"
          placeholder="example@email.com"
          className="py-3"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          id="password"
          type="password"
          label="비밀번호"
          placeholder="6자 이상 입력해주세요"
          className="py-3"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full h-[52px] text-base"
          >
            로그인
          </Button>
        </div>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-sm text-muted">또는</span>
        </div>
      </div>

      {/* Social login */}
      <div className="space-y-3">
        {/* Kakao */}
        <button
          type="button"
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] font-semibold text-[#191919] transition-colors hover:bg-[#F5DC00]"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#191919]/10 text-sm font-bold">
            K
          </span>
          카카오로 시작하기
        </button>

        {/* Naver */}
        <button
          type="button"
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#03C75A] font-semibold text-white transition-colors hover:bg-[#02b351]"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm font-bold">
            N
          </span>
          네이버로 시작하기
        </button>

        {/* Google */}
        <button
          type="button"
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-sm font-bold text-gray-500">
            G
          </span>
          Google로 시작하기
        </button>
      </div>

      {/* Link to register */}
      <p className="mt-8 text-center text-sm text-muted">
        아직 회원이 아니신가요?{' '}
        <Link
          href="/register"
          className="font-semibold text-brand-600 hover:underline"
        >
          회원가입
        </Link>
      </p>
    </motion.div>
  );
}
