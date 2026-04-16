'use client';

import Link from 'next/link';
import {
  Briefcase,
  Star,
  Clock,
  Wallet,
  ArrowRight,
  Play,
  FileText,
  UserCircle,
  Bell,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { getContractsForCaregiver } from '@/lib/mock/contracts';
import { getCurrentMonthEarning } from '@/lib/mock/earnings';
import { mockCaregivers } from '@/lib/mock/caregivers';
import { mockCareRequests } from '@/lib/mock/care-requests';
import { hospitals } from '@/lib/constants/hospitals';
import { careItems } from '@/lib/constants/care-items';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 11) return '좋은 아침입니다';
  if (hour < 14) return '점심 시간입니다';
  if (hour < 18) return '오후 수고가 많으세요';
  return '오늘 하루 수고하셨습니다';
}

export default function CaregiverDashboardPage() {
  const me = mockCaregivers[0]; // 김영미
  const contracts = getContractsForCaregiver(me.id);
  const todayContract = contracts.find((c) => c.status === 'active');
  const currentMonth = getCurrentMonthEarning();

  const newJobs = mockCareRequests.slice(0, 3);

  const profileCompleteness = 85;

  return (
    <div className="space-y-6 sm:space-y-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {greeting()}, {me.name}님
        </h1>
        <p className="mt-1 text-base text-muted">
          {todayContract
            ? `오늘 ${todayContract.hospital_name} · ${todayContract.patient_name}님 간병 일정이 있습니다.`
            : '오늘은 배정된 간병이 없습니다.'}
        </p>
      </header>

      {todayContract && (
        <section className="rounded-xl border border-brand-200 bg-brand-50/50 p-5 sm:p-6 dark:border-brand-900/40 dark:bg-brand-900/20">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">
              오늘의 일정
            </p>
            <Badge variant="brand">진행 중</Badge>
          </div>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                {todayContract.hospital_name}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {todayContract.patient_name} · 09:00 ~ 21:00 (24시간 간병)
              </p>
            </div>
            <Link
              href="/caregiver/worklog"
              className="inline-flex h-[48px] items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 text-base font-semibold text-white hover:bg-brand-700"
            >
              <Play className="h-5 w-5" />
              근무일지 작성
            </Link>
          </div>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Wallet className="h-5 w-5" />}
          label="이번 달 수입"
          value={formatCurrency(currentMonth.total)}
          sub={`${currentMonth.days_worked}일 근무`}
        />
        <StatCard
          icon={<Briefcase className="h-5 w-5" />}
          label="완료 간병"
          value={`${me.completed_jobs}건`}
          sub="누적"
        />
        <StatCard
          icon={<Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />}
          label="평균 평점"
          value={me.rating.toFixed(1)}
          sub={`후기 ${me.total_reviews}건`}
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="응답 속도"
          value={`${me.response_time_minutes}분`}
          sub="이내 평균"
        />
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Bell className="h-5 w-5 text-brand-600" />
            새 일감 제안
          </h2>
          <Link
            href="/caregiver/jobs"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            전체 보기 →
          </Link>
        </div>
        <ul className="mt-3 space-y-3">
          {newJobs.map((req) => {
            const hospital = hospitals.find((h) => h.id === req.hospital_id);
            return (
              <li
                key={req.id}
                className="rounded-xl border border-border bg-background p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-foreground">
                      {hospital?.name ?? '병원'}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">
                      {req.patient_name} · {req.patient_age}세 {req.patient_gender === 'female' ? '여성' : '남성'}
                      {' · '}
                      {formatDate(req.care_start_date)} 시작
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {req.care_items.slice(0, 3).map((item) => (
                        <Badge key={item} variant="default">
                          {careItems.find((c) => c.id === item)?.label ?? item}
                        </Badge>
                      ))}
                      {req.care_items.length > 3 && (
                        <Badge variant="default">+{req.care_items.length - 3}</Badge>
                      )}
                    </div>
                  </div>
                  <Link
                    href="/caregiver/jobs"
                    className="inline-flex h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-surface-hover sm:ml-4"
                  >
                    확인하기
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-background p-5 sm:p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              프로필 완성도 {profileCompleteness}%
            </p>
            <p className="mt-1 text-sm text-muted">
              자격증 1개만 더 추가하시면 매칭 우선순위가 올라갑니다.
            </p>
            <div className="mt-3 h-2 rounded-full bg-warm-gray-200 dark:bg-warm-gray-800">
              <div
                className="h-full rounded-full bg-accent-500"
                style={{ width: `${profileCompleteness}%` }}
              />
            </div>
          </div>
          <Link
            href="/caregiver/profile"
            className="inline-flex h-[40px] shrink-0 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-surface-hover"
          >
            프로필 수정
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">빠른 메뉴</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction href="/caregiver/jobs" icon={<Briefcase className="h-5 w-5" />} label="일감 찾기" primary />
          <QuickAction href="/caregiver/worklog" icon={<FileText className="h-5 w-5" />} label="근무일지" />
          <QuickAction href="/caregiver/earnings" icon={<Wallet className="h-5 w-5" />} label="정산 내역" />
          <QuickAction href="/caregiver/profile" icon={<UserCircle className="h-5 w-5" />} label="프로필 수정" />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}

function QuickAction({
  href,
  icon,
  label,
  primary = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-sm font-medium transition-colors ${
        primary
          ? 'border-brand-600 bg-brand-600 text-white hover:bg-brand-700'
          : 'border-border bg-background text-foreground hover:bg-surface-hover'
      }`}
    >
      <span className={primary ? 'text-white' : 'text-brand-600'}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
