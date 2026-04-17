'use client';

import { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Users, HeartHandshake, ArrowLeft } from 'lucide-react';
import { registerSchema, type RegisterFormData } from '@/lib/types/forms';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';

type Role = 'guardian' | 'caregiver';

const certOptions = [
  '요양보호사',
  '치매전문교육 수료',
  '감염관리교육 수료',
  'BLS(기본생명구조술)',
];

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterSkeleton />}>
      <RegisterContent />
    </Suspense>
  );
}

function RegisterSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-8 w-28 rounded bg-warm-gray-200" />
      <div className="h-4 w-2/3 rounded bg-warm-gray-100" />
      <div className="space-y-4 pt-4">
        <div className="h-20 rounded-xl bg-warm-gray-100" />
        <div className="h-20 rounded-xl bg-warm-gray-100" />
      </div>
      <div className="h-12 rounded-xl bg-warm-gray-100 mt-6" />
    </div>
  );
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') as Role | null;

  const { signUp } = useAuth();

  const [role, setRole] = useState<Role | null>(initialRole);
  const [step, setStep] = useState<'role' | 'form'>(
    initialRole ? 'form' : 'role',
  );

  const [experienceYears, setExperienceYears] = useState('');
  const [certifications, setCertifications] = useState<string[]>([]);

  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: initialRole ?? undefined,
    },
  });

  function handleRoleSelect(selected: Role) {
    setRole(selected);
  }

  function handleNextStep() {
    if (!role) return;
    setStep('form');
  }

  function handleBack() {
    setStep('role');
    setRole(null);
  }

  function toggleCert(cert: string) {
    setCertifications((prev) =>
      prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert],
    );
  }

  async function onSubmit(data: RegisterFormData) {
    if (isSubmitting) return;

    if (data.password !== passwordConfirm) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다');
      return;
    }
    setPasswordConfirmError('');

    setIsSubmitting(true);
    try {
      const metadata: Record<string, unknown> = {
        role,
        name: data.name,
        phone: data.phone,
      };
      if (role === 'caregiver') {
        metadata.experience_years = experienceYears
          ? Number(experienceYears)
          : null;
        metadata.certifications = certifications;
      }

      const { error } = await signUp(data.email, data.password, metadata);
      if (error) {
        const msg = error.message ?? '';
        setToast({
          type: 'error',
          message:
            msg.includes('already registered') || msg.includes('exists')
              ? '이미 가입된 이메일입니다'
              : msg.includes('Missing')
                ? '회원가입 서비스가 현재 연결되어 있지 않습니다 (베타)'
                : '회원가입에 실패했습니다. 잠시 후 다시 시도해주세요',
        });
        return;
      }
      router.push('/login?registered=1');
    } catch {
      setToast({
        type: 'error',
        message: '회원가입 서비스가 현재 연결되어 있지 않습니다 (베타)',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {step === 'role' ? (
        <>
          <h1 className="text-2xl font-bold text-foreground">회원가입</h1>
          <p className="mt-2 text-base text-muted">어떤 분이신가요?</p>

          <div className="mt-8 space-y-4">
            <button
              type="button"
              onClick={() => handleRoleSelect('guardian')}
              className={`flex w-full items-center gap-4 rounded-xl border p-6 text-left transition-all duration-200 ${
                role === 'guardian'
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-border bg-background hover:border-gray-300'
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  role === 'guardian'
                    ? 'bg-brand-600 text-white'
                    : 'bg-surface text-muted'
                }`}
              >
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">보호자</p>
                <p className="mt-0.5 text-sm text-muted">
                  간병이 필요한 환자의 가족
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('caregiver')}
              className={`flex w-full items-center gap-4 rounded-xl border p-6 text-left transition-all duration-200 ${
                role === 'caregiver'
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-border bg-background hover:border-gray-300'
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  role === 'caregiver'
                    ? 'bg-brand-600 text-white'
                    : 'bg-surface text-muted'
                }`}
              >
                <HeartHandshake className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">간병인</p>
                <p className="mt-0.5 text-sm text-muted">
                  간병 서비스를 제공합니다
                </p>
              </div>
            </button>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full h-[52px] text-base"
              disabled={!role}
              onClick={handleNextStep}
            >
              다음
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-muted">
            이미 회원이신가요?{' '}
            <Link
              href="/login"
              className="font-semibold text-brand-600 hover:underline"
            >
              로그인
            </Link>
          </p>
        </>
      ) : (
        <>
          {!initialRole && (
            <button
              type="button"
              onClick={handleBack}
              className="mb-6 flex items-center gap-1 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              역할 다시 선택
            </button>
          )}

          <h1 className="text-2xl font-bold text-foreground">
            {role === 'guardian' ? '보호자 회원가입' : '간병인 회원가입'}
          </h1>
          <p className="mt-2 text-base text-muted">
            기본 정보를 입력해주세요.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-3"
            noValidate
          >
            <input type="hidden" value={role ?? ''} {...register('role')} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                id="name"
                label="이름"
                placeholder="홍길동"
                className="py-3"
                error={errors.name?.message}
                autoComplete="name"
                {...register('name')}
              />
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
                id="phone"
                type="tel"
                label="연락처"
                placeholder="010-0000-0000"
                className="py-3"
                error={errors.phone?.message}
                autoComplete="tel"
                {...register('phone')}
              />
              <Input
                id="password"
                type="password"
                label="비밀번호"
                placeholder="6자 이상 입력해주세요"
                className="py-3"
                error={errors.password?.message}
                autoComplete="new-password"
                {...register('password')}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium text-foreground"
              >
                비밀번호 확인
              </label>
              <input
                id="passwordConfirm"
                type="password"
                placeholder="비밀번호를 다시 입력해주세요"
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                  if (passwordConfirmError) setPasswordConfirmError('');
                }}
                autoComplete="new-password"
                className={`block w-full rounded-lg border border-border bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                  passwordConfirmError
                    ? 'border-danger focus:border-danger focus:ring-danger/20'
                    : ''
                }`}
              />
              {passwordConfirmError && (
                <p className="text-sm text-danger">{passwordConfirmError}</p>
              )}
            </div>

            {role === 'caregiver' && (
              <div className="space-y-3 rounded-xl border border-border bg-surface p-6">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    간병인 추가 정보
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    해당하는 항목을 선택해주세요
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-foreground"
                  >
                    경력 (년)
                  </label>
                  <input
                    id="experience"
                    type="number"
                    min="0"
                    placeholder="경력 년수"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="block w-full rounded-lg border border-border bg-background px-3.5 py-3 text-base text-foreground placeholder:text-muted transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <p className="block text-sm font-medium text-foreground">
                    자격증
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {certOptions.map((cert) => (
                      <label
                        key={cert}
                        className="flex cursor-pointer items-center gap-2 p-3 rounded-lg border border-border hover:bg-surface-hover transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={certifications.includes(cert)}
                          onChange={() => toggleCert(cert)}
                          className="h-4 w-4 shrink-0 rounded border-border accent-brand-600"
                        />
                        <span className="text-base text-foreground">{cert}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full h-[52px] text-base"
                isLoading={isSubmitting}
              >
                회원가입
              </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            이미 회원이신가요?{' '}
            <Link
              href="/login"
              className="font-semibold text-brand-600 hover:underline"
            >
              로그인
            </Link>
          </p>
        </>
      )}

      <Toast
        type={toast?.type ?? 'info'}
        message={toast?.message ?? ''}
        isVisible={toast !== null}
        onClose={() => setToast(null)}
      />
    </motion.div>
  );
}
