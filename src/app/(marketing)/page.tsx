'use client';

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
  Files,
  Stethoscope,
  Building2,
  ArrowRight,
  Check,
} from 'lucide-react';
import { type ReactNode } from 'react';

/* ─── Animation ─── */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
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
      viewport={{ once: true, margin: '-60px' }}
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
    icon: FileCheck,
    title: '표준계약서',
    desc: '법적 효력을 갖춘 전자계약으로 양측의 권리를 보호합니다.',
  },
  {
    icon: ShieldCheck,
    title: '안심결제',
    desc: '에스크로 결제로 간병 완료 후 정산. 선불 위험이 없습니다.',
  },
  {
    icon: Shield,
    title: '배상책임보험',
    desc: '간병 중 사고에 대비한 보험이 자동 적용됩니다.',
  },
  {
    icon: Files,
    title: '서류 자동화',
    desc: '계약서, 근무일지, 정산서를 자동 생성하고 관리합니다.',
  },
  {
    icon: Stethoscope,
    title: '의료행위 경계관리',
    desc: '간병과 의료행위의 경계를 명확히 하여 안전을 지킵니다.',
  },
  {
    icon: Building2,
    title: '병원규칙 준수',
    desc: '각 병원의 간병 규정을 사전에 안내하여 마찰을 줄입니다.',
  },
];

/* ─── Hero Visual ─── */

function HeroVisual() {
  return (
    <div className="relative flex h-[440px] items-center justify-center overflow-visible">
      {/* Phone mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative z-10 w-[250px] rotate-2"
        style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.16))' }}
      >
        {/* Bezel */}
        <div className="rounded-[2.5rem] border-2 border-gray-300 bg-gray-100 p-[5px] shadow-2xl">
          {/* Inner bezel */}
          <div className="rounded-[2.25rem] bg-black p-2.5 pb-2">
            {/* Dynamic Island */}
            <div className="mx-auto mb-2 h-[16px] w-[72px] rounded-full bg-black ring-1 ring-gray-800" />

            {/* Screen */}
            <div className="overflow-hidden rounded-[1.5rem] bg-white">
              {/* Status bar */}
              <div className="flex items-center justify-between px-5 py-1 text-[10px] font-semibold text-gray-800">
                <span>9:41</span>
                <div className="flex items-center gap-1 text-[8px] text-gray-400">
                  <span>●●●○</span>
                  <span>▐█▌</span>
                </div>
              </div>

              {/* App nav bar */}
              <div className="bg-brand-600 px-4 pb-3 pt-2">
                <p className="text-[9px] font-medium text-brand-200">
                  이음다리
                </p>
                <h3 className="mt-0.5 text-[13px] font-bold text-white">
                  간병 신청
                </h3>
              </div>

              {/* Form */}
              <div className="space-y-2.5 px-3.5 py-3">
                {/* Hospital */}
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-wider text-gray-400">
                    병원
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5">
                    <Building2 className="h-3 w-3 text-brand-500" />
                    <span className="text-[10px] font-medium text-gray-800">
                      서울대학교병원
                    </span>
                  </div>
                </div>

                {/* Patient */}
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-wider text-gray-400">
                    환자 정보
                  </p>
                  <div className="mt-0.5 grid grid-cols-2 gap-1">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5">
                      <span className="text-[8px] text-gray-400">나이</span>
                      <p className="text-[10px] font-medium text-gray-800">
                        72세
                      </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5">
                      <span className="text-[8px] text-gray-400">성별</span>
                      <p className="text-[10px] font-medium text-gray-800">
                        여성
                      </p>
                    </div>
                  </div>
                </div>

                {/* Care type */}
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-wider text-gray-400">
                    간병 유형
                  </p>
                  <div className="mt-0.5 flex gap-1">
                    <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[9px] font-semibold text-white">
                      24시간
                    </span>
                    <span className="rounded-full border border-gray-200 px-2 py-0.5 text-[9px] text-gray-400">
                      12시간
                    </span>
                    <span className="rounded-full border border-gray-200 px-2 py-0.5 text-[9px] text-gray-400">
                      야간
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="rounded-xl bg-brand-600 py-2 text-center">
                  <span className="text-[10px] font-bold text-white">
                    간병인 매칭 시작
                  </span>
                </div>
              </div>

              {/* Home indicator */}
              <div className="pb-2 pt-1">
                <div className="mx-auto h-1 w-[72px] rounded-full bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notification card — bottom-left, behind phone */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.5 }}
        className="absolute bottom-6 left-0 z-20 w-[256px] rounded-2xl border border-brand-200 bg-white p-4 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success/20">
            <Check className="h-4 w-4 text-success" />
          </div>
          <div>
            <p className="text-sm font-bold text-brand-700">매칭 완료!</p>
            <p className="mt-0.5 text-xs text-brand-600">
              김서연 간병사가 배정되었습니다
            </p>
          </div>
        </div>
      </motion.div>
    </div>
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
                검증된 간병인, 표준계약, 안심결제까지.
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
            <p className="text-accent-500 font-semibold text-sm tracking-wide uppercase mb-3">
              간병의 현실
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              이런 경험, 있으시죠?
            </h2>
          </FadeIn>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="mt-12 sm:mt-16 grid gap-10 sm:gap-8 sm:grid-cols-3"
          >
            {problems.map((p) => (
              <motion.div
                key={p.title}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-100 text-accent-600">
                  <p.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-xl sm:text-2xl font-bold text-foreground">
                  {p.title}
                </h3>
                <p className="mt-3 text-base sm:text-lg text-muted leading-relaxed">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
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

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="mt-12 sm:mt-16 grid gap-12 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {steps.map((s) => (
              <motion.div
                key={s.num}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
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
              </motion.div>
            ))}
          </motion.div>
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

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="mt-12 sm:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {trustItems.map((t) => (
              <motion.div
                key={t.title}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-border bg-background p-6 sm:p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <t.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg sm:text-xl font-bold text-foreground">
                  {t.title}
                </h3>
                <p className="mt-2 text-base text-muted leading-relaxed">
                  {t.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
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
