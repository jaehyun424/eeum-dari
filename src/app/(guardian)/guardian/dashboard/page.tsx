'use client';

import Link from 'next/link';
import {
  FileText,
  Clock,
  CheckCircle2,
  Search,
  Users,
  MessageCircle,
  Plus,
  ArrowRight,
  Heart,
  Phone,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/format';
import { getContractsForGuardian } from '@/lib/mock/contracts';
import { mockCareRequests } from '@/lib/mock/care-requests';
import { hospitals } from '@/lib/constants/hospitals';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 11) return '좋은 아침입니다';
  if (hour < 14) return '점심 잘 드셨나요';
  if (hour < 18) return '오후도 잘 보내세요';
  return '편안한 저녁 되세요';
}

function avatarFallback(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1E56A0&color=fff&size=300&bold=true`;
}

export default function GuardianDashboardPage() {
  const contracts = getContractsForGuardian();
  const activeContract = contracts.find((c) => c.status === 'active');
  const activeCount = contracts.filter((c) => c.status === 'active').length;
  const pendingCount = contracts.filter((c) => c.status === 'pending').length;
  const completedCount = contracts.filter((c) => c.status === 'completed').length;

  const recentRequest = mockCareRequests[0];
  const recentHospital = hospitals.find((h) => h.id === recentRequest.hospital_id);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 인사말 */}
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {greeting()}, 김보호님
        </h1>
        <p className="mt-1 text-base text-muted">
          {formatDate(new Date())} · 현재 진행 상황을 알려드릴게요.
        </p>
      </header>

      {/* 요약 카드 3개 */}
      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={<Clock className="h-5 w-5" />}
          label="진행 중 계약"
          value={activeCount}
          tone="brand"
        />
        <SummaryCard
          icon={<FileText className="h-5 w-5" />}
          label="매칭 대기 중"
          value={pendingCount}
          tone="accent"
        />
        <SummaryCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="완료된 간병"
          value={completedCount}
          tone="neutral"
        />
      </section>

      {/* 진행 중 계약 큰 카드 */}
      {activeContract ? (
        <section className="rounded-xl border border-brand-200 bg-brand-50/50 p-5 sm:p-6 dark:border-brand-900/40 dark:bg-brand-900/20">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">
              진행 중 계약
            </p>
            <Badge variant="brand">진행 중</Badge>
          </div>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <img
              src={activeContract.caregiver_profile_image}
              alt=""
              width={72}
              height={72}
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.dataset.fallback) {
                  img.dataset.fallback = '1';
                  img.src = avatarFallback(activeContract.caregiver_name);
                }
              }}
              className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-xl object-cover bg-warm-gray-100"
            />
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                {activeContract.caregiver_name} 간병사
              </h2>
              <p className="mt-1 text-sm text-muted">
                {activeContract.hospital_name} · {activeContract.patient_name}
              </p>
              <div className="mt-3">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-muted">
                    {activeContract.days_elapsed}일 / {activeContract.days_total}일 진행
                  </span>
                  <span className="font-semibold text-brand-700">
                    {Math.round((activeContract.days_elapsed / activeContract.days_total) * 100)}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-warm-gray-200 dark:bg-warm-gray-800">
                  <div
                    className="h-full rounded-full bg-brand-600"
                    style={{
                      width: `${(activeContract.days_elapsed / activeContract.days_total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Link
              href="/guardian/contracts"
              className="inline-flex h-[44px] items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-surface-hover"
            >
              <FileText className="h-4 w-4" />
              근무일지 보기
            </Link>
            <button
              type="button"
              className="inline-flex h-[44px] items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
            >
              <Phone className="h-4 w-4" />
              간병인에게 연락
            </button>
          </div>
        </section>
      ) : null}

      {/* 최근 매칭 결과 */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">최근 매칭 결과</h2>
          <Link
            href={`/guardian/matching/${recentRequest.id}`}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            결과 보기 →
          </Link>
        </div>
        <div className="mt-3 rounded-xl border border-border bg-background p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted">
                {recentHospital?.name} · {recentRequest.patient_name} ({recentRequest.patient_age}세)
              </p>
              <p className="mt-1 text-base font-semibold text-foreground">
                5명의 간병인이 매칭되었습니다
              </p>
            </div>
            <Link
              href={`/guardian/matching/${recentRequest.id}`}
              className="inline-flex h-[44px] items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700 sm:shrink-0"
            >
              결과 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 빠른 액션 */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-3">빠른 메뉴</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction href="/guardian/request" icon={<Plus className="h-5 w-5" />} label="새 간병 신청" primary />
          <QuickAction href="/guardian/contracts" icon={<Users className="h-5 w-5" />} label="계약 관리" />
          <QuickAction href="/guardian/request" icon={<Search className="h-5 w-5" />} label="간병인 찾기" />
          <QuickAction href="#" icon={<MessageCircle className="h-5 w-5" />} label="문의하기" />
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: 'brand' | 'accent' | 'neutral';
}) {
  const toneStyles: Record<typeof tone, string> = {
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400',
    accent: 'bg-accent-50 text-accent-600 dark:bg-accent-900/20 dark:text-accent-400',
    neutral: 'bg-warm-gray-100 text-warm-gray-700 dark:bg-warm-gray-800 dark:text-warm-gray-300',
  };
  return (
    <div className="rounded-xl border border-border bg-background p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${toneStyles[tone]}`}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold text-foreground tabular-nums">{value}</p>
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
      <Heart className={`ml-auto h-4 w-4 ${primary ? 'text-white/50' : 'text-muted'}`} />
    </Link>
  );
}
