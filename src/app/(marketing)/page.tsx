'use client';

import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CircleDollarSign,
  HelpCircle,
  ShieldAlert,
  ClipboardList,
  Sparkles,
  UserCheck,
  HeartHandshake,
  FileCheck,
  ShieldCheck,
  Shield,
  Stethoscope,
  Building2,
  ArrowRight,
} from 'lucide-react';

/* ─── Animation ─── */

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

function FadeIn({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeUp}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Data ─── */

const problems = [
  {
    icon: CircleDollarSign,
    title: '깜깜이 요금',
    desc: '기준 없는 간병비. 얼마가 적정한지 알 수 없어 매번 불안합니다.',
  },
  {
    icon: HelpCircle,
    title: '정보 부족',
    desc: '경력도, 자격도, 평판도 확인할 길 없이 선택해야 합니다.',
  },
  {
    icon: ShieldAlert,
    title: '제도적 공백',
    desc: '계약서도 보험도 없이. 문제가 생기면 환자와 간병인 모두 무방비입니다.',
  },
];

const steps = [
  {
    num: '01',
    icon: ClipboardList,
    title: '간병 정보 입력',
    desc: '병원, 환자 상태, 필요한 돌봄 항목을 선택합니다.',
  },
  {
    num: '02',
    icon: Sparkles,
    title: '최적 매칭',
    desc: '조건에 맞는 간병인을 자동으로 찾아 추천합니다.',
  },
  {
    num: '03',
    icon: UserCheck,
    title: '프로필 확인',
    desc: '경력, 자격증, 후기를 확인하고 직접 선택합니다.',
  },
  {
    num: '04',
    icon: HeartHandshake,
    title: '간병 시작',
    desc: '표준계약 체결 후 안심하고 간병을 시작합니다.',
  },
];

const trustItems = [
  {
    icon: Sparkles,
    title: '설명 가능한 매칭',
    desc: '케어 항목·경력·평점·거리·응답속도·위험 대응력을 가중 평균해 점수로 공개합니다.',
    badge: null,
  },
  {
    icon: Stethoscope,
    title: '의료행위 경계관리',
    desc: '간병과 의료행위의 경계를 명확히 하여, 경계 항목은 수동 심사로 배정합니다.',
    badge: null,
  },
  {
    icon: Building2,
    title: '병원규칙 안내',
    desc: '각 병원의 간병 규정을 사전에 안내하여 첫날부터의 마찰을 줄입니다.',
    badge: null,
  },
  {
    icon: FileCheck,
    title: '표준계약서',
    desc: '양측이 확인·서명하는 표준 간병 계약서 템플릿을 준비 중입니다.',
    badge: '준비 중',
  },
  {
    icon: ShieldCheck,
    title: '안심결제',
    desc: '에스크로 기반 안심결제를 설계 중이며, 정식 출시와 함께 도입됩니다.',
    badge: '준비 중',
  },
  {
    icon: Shield,
    title: '배상책임보험',
    desc: '간병 중 사고에 대비한 배상책임보험 연동을 준비하고 있습니다.',
    badge: '준비 중',
  },
];

/* ─── Hero Visual ─── */

function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 800 440"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[440px] w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="heroBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EFF5FF" />
          <stop offset="100%" stopColor="#DAE8FD" />
        </linearGradient>
      </defs>
      <rect width="800" height="440" fill="url(#heroBg)" />

      {/* 부드러운 배경 원 */}
      <circle cx="120" cy="90" r="70" fill="#FFFFFF" opacity="0.5" />
      <circle cx="700" cy="360" r="90" fill="#FFFFFF" opacity="0.45" />

      {/* 중앙 로고 확대 — 이음다리 */}
      <g transform="translate(400, 220)">
        <circle cx="-130" cy="0" r="70" fill="#1E56A0" />
        <circle cx="130" cy="0" r="70" fill="#1E56A0" />
        <path
          d="M -65 0 C 0 -90, 0 -90, 65 0"
          stroke="#E8835A"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M -65 0 C 0 90, 0 90, 65 0"
          stroke="#E8835A"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        {/* 중앙 하트 */}
        <path
          d="M0,12 C-16,-8 -36,6 0,34 C36,6 16,-8 0,12 Z"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  );
}

function HeroVisual() {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative overflow-hidden rounded-2xl bg-brand-50"
    >
      {videoFailed ? (
        <HeroIllustration />
      ) : (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="h-[440px] w-full object-cover"
          onError={() => setVideoFailed(true)}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-brand-900/15 via-transparent to-transparent" />
    </motion.div>
  );
}

/* ─── Page ─── */

export default function LandingPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-x-clip">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
          <div className="grid items-center lg:grid-cols-2 lg:gap-12">
            {/* Left — text + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-brand-600 font-semibold text-base sm:text-lg mb-3">
                입원 간병 매칭 플랫폼
              </p>
              <h1 className="text-[2.25rem] leading-[1.2] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15] font-bold tracking-tight text-foreground">
                입원 간병,{' '}
                <br className="hidden sm:block" />
                이음다리가 이어드립니다
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted leading-relaxed max-w-lg">
                설명 가능한 매칭, 의료행위 경계관리, 병원규칙 안내까지.
                <br />
                3분이면 시작할 수 있습니다.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register?role=guardian"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-brand-700 active:bg-brand-800 transition-colors"
                >
                  간병 신청하기
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/register?role=caregiver"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border px-8 py-4 text-lg font-semibold text-foreground hover:bg-surface transition-colors"
                >
                  간병인으로 시작하기
                </Link>
              </div>
            </motion.div>

            {/* Right — visual (desktop only) */}
            <div className="hidden lg:block">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ── 문제 제시 ── */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <FadeIn>
            <p className="text-brand-500 font-semibold text-sm tracking-wide uppercase mb-3">
              간병의 현실
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              이런 경험, 있으시죠?
            </h2>
          </FadeIn>

          <div className="mt-12 sm:mt-16 grid gap-10 sm:gap-8 sm:grid-cols-3">
            {problems.map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.1}>
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
                    <p.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-xl sm:text-2xl font-bold text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-base sm:text-lg text-muted leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 매칭 프로세스 4단계 ── */}
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <FadeIn>
            <p className="text-brand-600 font-semibold text-sm tracking-wide uppercase mb-3">
              매칭 프로세스
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              3분이면 충분합니다
            </h2>
            <p className="mt-4 text-lg text-muted max-w-lg">
              복잡한 간병인 구인 과정을 4단계로 간소화했습니다.
            </p>
          </FadeIn>

          <div className="mt-12 sm:mt-16 grid gap-12 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <FadeIn key={s.num} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <s.icon className="h-9 w-9" />
                  </div>
                  <span className="mt-5 text-sm font-bold text-brand-600 tracking-widest">
                    STEP {s.num}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-base text-muted leading-relaxed max-w-[240px]">
                    {s.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 신뢰 요소 ── */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <FadeIn>
            <p className="text-brand-600 font-semibold text-sm tracking-wide uppercase mb-3">
              신뢰할 수 있는 시스템
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              이음다리는 다릅니다
            </h2>
          </FadeIn>

          <div className="mt-12 sm:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trustItems.map((t, i) => (
              <FadeIn key={t.title} delay={i * 0.08}>
                <div className="rounded-2xl border border-border bg-background p-6 sm:p-8 h-full">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <t.icon className="h-6 w-6" />
                    </div>
                    {t.badge && (
                      <span className="inline-flex items-center rounded-full bg-warm-gray-100 px-2.5 py-1 text-xs font-medium text-warm-gray-700 dark:bg-warm-gray-800 dark:text-warm-gray-200">
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg sm:text-xl font-bold text-foreground">
                    {t.title}
                  </h3>
                  <p className="mt-2 text-base text-muted leading-relaxed">
                    {t.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-brand-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <FadeIn className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              지금 시작하세요
            </h2>
            <p className="mt-4 text-lg text-brand-200 max-w-lg mx-auto">
              간병이 필요하신 보호자도, 간병 기회를 찾는 간병인도.
              <br />
              이음다리가 연결합니다.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
              <Link
                href="/register?role=guardian"
                className="group flex flex-col rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 hover:bg-white/20 transition-colors"
              >
                <p className="text-brand-200 text-sm font-medium">보호자</p>
                <h3 className="mt-2 text-xl font-bold text-white">
                  간병인을 찾고 계신가요?
                </h3>
                <p className="mt-2 text-brand-200">
                  3분 만에 검증된 간병인을 매칭받으세요.
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-white font-semibold">
                  간병 신청하기
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>

              <Link
                href="/register?role=caregiver"
                className="group flex flex-col rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 hover:bg-white/20 transition-colors"
              >
                <p className="text-brand-200 text-sm font-medium">간병인</p>
                <h3 className="mt-2 text-xl font-bold text-white">
                  새로운 기회를 찾고 계신가요?
                </h3>
                <p className="mt-2 text-brand-200">
                  프로필을 등록하고 매칭을 시작하세요.
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-white font-semibold">
                  간병인 등록하기
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
