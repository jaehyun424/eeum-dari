'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Users, HeartHandshake, ArrowLeft } from 'lucide-react';
import { registerSchema, type RegisterFormData } from '@/lib/types/forms';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Role = 'guardian' | 'caregiver';

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  );
}

const certOptions = [
  '요양보호사',
  '치매전문교육 수료',
  '감염관리교육 수료',
  'BLS(기본생명구조술)',
];

function RegisterContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') as Role | null;

  const [role, setRole] = useState<Role | null>(initialRole);
  const [step, setStep] = useState<'role' | 'form'>(
    initialRole ? 'form' : 'role',
  );

  // Caregiver extra fields
  const [experienceYears, setExperienceYears] = useState('');
  const [certifications, setCertifications] = useState<string[]>([]);

  // Password confirm
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: initialRole ?? undefined,
    },
  });

  const password = watch('password');

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

  function onSubmit(data: RegisterFormData) {
    if (data.password !== passwordConfirm) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다');
      return;
    }
    setPasswordConfirmError('');

    const payload =
      role === 'caregiver'
        ? {
            ...data,
            experienceYears: experienceYears ? Number(experienceYears) : null,
            certifications,
          }
        : data;
    console.log(payload);
  }

  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {step === 'role' ? (
        /* ── Role selection ── */
        <>
          <h1 className="text-2xl font-bold text-foreground">회원가입</h1>
          <p className="mt-2 text-base text-muted">어떤 분이신가요?</p>

          <div className="mt-8 space-y-4">
            {/* Guardian card */}
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

            {/* Caregiver card */}
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
        /* ── Registration form ── */
        <>
          {/* Back button */}
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
            className="mt-8 space-y-4"
          >
            {/* Hidden role */}
            <input type="hidden" value={role ?? ''} {...register('role')} />

            <Input
              id="name"
              label="이름"
              placeholder="홍길동"
              className="py-3"
              error={errors.name?.message}
              {...register('name')}
            />
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
              id="phone"
              type="tel"
              label="연락처"
              placeholder="010-0000-0000"
              className="py-3"
              error={errors.phone?.message}
              {...register('phone')}
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

            {/* Password confirm — separate from schema */}
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

            {/* Caregiver extra fields */}
            {role === 'caregiver' && (
              <div className="space-y-4 rounded-xl border border-border bg-surface p-5">
                <p className="text-sm font-semibold text-foreground">
                  간병인 추가 정보
                </p>

                {/* Experience */}
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
                    className="block w-full rounded-lg border border-border bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                {/* Certifications */}
                <div className="space-y-1.5">
                  <p className="block text-sm font-medium text-foreground">
                    자격증
                  </p>
                  <div className="space-y-3">
                    {certOptions.map((cert) => (
                      <label
                        key={cert}
                        className="flex cursor-pointer items-center gap-3"
                      >
                        <input
                          type="checkbox"
                          checked={certifications.includes(cert)}
                          onChange={() => toggleCert(cert)}
                          className="h-5 w-5 rounded border-border accent-brand-600"
                        />
                        <span className="text-sm text-foreground">{cert}</span>
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
    </motion.div>
  );
}
