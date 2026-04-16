'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, MessageSquareText, Plus, Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/matching/EmptyState';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { getContractsForGuardian } from '@/lib/mock/contracts';
import type { Contract, ContractStatus } from '@/lib/types/database';

type Filter = 'all' | 'active' | 'pending' | 'completed' | 'terminated';

const FILTER_LABELS: Record<Filter, string> = {
  all: '전체',
  active: '진행 중',
  pending: '예정',
  completed: '완료',
  terminated: '종료',
};

const STATUS_BADGE: Record<ContractStatus, { label: string; variant: 'brand' | 'warning' | 'success' | 'danger' | 'default' }> = {
  pending: { label: '예정', variant: 'warning' },
  active: { label: '진행 중', variant: 'brand' },
  completed: { label: '완료', variant: 'success' },
  terminated: { label: '종료', variant: 'danger' },
};

function avatarFallback(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1E56A0&color=fff&size=300&bold=true`;
}

export default function ContractsPage() {
  const contracts = getContractsForGuardian();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = contracts.filter((c) => filter === 'all' || c.status === filter);

  const counts: Record<Filter, number> = {
    all: contracts.length,
    active: contracts.filter((c) => c.status === 'active').length,
    pending: contracts.filter((c) => c.status === 'pending').length,
    completed: contracts.filter((c) => c.status === 'completed').length,
    terminated: contracts.filter((c) => c.status === 'terminated').length,
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">계약 관리</h1>
          <p className="mt-1 text-base text-muted">
            진행 중인 계약과 완료된 간병 내역을 관리합니다.
          </p>
        </div>
        <Link
          href="/guardian/request"
          className="inline-flex h-[44px] items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          새 간병 신청
        </Link>
      </header>

      {/* 필터 탭 */}
      <nav className="flex flex-wrap gap-2 border-b border-border pb-3 overflow-x-auto">
        {(Object.keys(FILTER_LABELS) as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-brand-600 text-white'
                : 'bg-surface text-muted hover:bg-surface-hover hover:text-foreground'
            }`}
          >
            {FILTER_LABELS[f]}
            <span className={`rounded-full px-1.5 text-xs tabular-nums ${
              filter === f ? 'bg-white/20' : 'bg-warm-gray-200 dark:bg-warm-gray-800'
            }`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </nav>

      {filtered.length === 0 ? (
        filter === 'all' ? (
          <EmptyState
            title="아직 계약이 없어요"
            description="간병이 필요한 환자분이 계신가요? 지금 신청하면 3분 안에 매칭해드립니다."
            actionLabel="간병 신청하기"
            onAction={() => (window.location.href = '/guardian/request')}
          />
        ) : (
          <EmptyState
            title={`${FILTER_LABELS[filter]} 상태의 계약이 없습니다`}
            description="다른 탭에서 계약 내역을 확인해보세요."
          />
        )
      ) : (
        <ul className="space-y-4">
          {filtered.map((contract) => (
            <ContractCard key={contract.id} contract={contract} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ContractCard({ contract }: { contract: Contract }) {
  const badge = STATUS_BADGE[contract.status];
  const isActive = contract.status === 'active';
  const isCompleted = contract.status === 'completed';
  const progress =
    contract.days_total > 0
      ? Math.min(100, Math.round((contract.days_elapsed / contract.days_total) * 100))
      : 0;

  return (
    <li className="rounded-xl border border-border bg-background p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge variant={badge.variant}>{badge.label}</Badge>
        <span className="text-xs text-muted">계약 #{contract.id}</span>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <img
          src={contract.caregiver_profile_image}
          alt=""
          width={72}
          height={72}
          onError={(e) => {
            const img = e.currentTarget;
            if (!img.dataset.fallback) {
              img.dataset.fallback = '1';
              img.src = avatarFallback(contract.caregiver_name);
            }
          }}
          className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-xl object-cover bg-warm-gray-100"
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-foreground">
            {contract.caregiver_name} 간병사
          </h2>
          <p className="mt-1 text-sm text-muted">
            {contract.hospital_name} · {contract.patient_name}
          </p>
          <p className="mt-0.5 text-sm text-muted">
            {formatDate(contract.start_date)} ~ {formatDate(contract.end_date)} ({contract.days_total}일)
          </p>
        </div>
        <div className="shrink-0 sm:text-right">
          <p className="text-xs text-muted">일일 요금</p>
          <p className="text-base font-semibold text-foreground">
            {formatCurrency(contract.daily_rate)}
          </p>
          <p className="mt-1 text-xs text-muted">
            총 {formatCurrency(contract.total_amount)}
          </p>
        </div>
      </div>

      {isActive && (
        <div className="mt-4">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-muted">
              {contract.days_elapsed}일 / {contract.days_total}일 진행
            </span>
            <span className="font-semibold text-brand-700">{progress}%</span>
          </div>
          <div className="mt-1.5 h-2 rounded-full bg-warm-gray-200 dark:bg-warm-gray-800">
            <div
              className="h-full rounded-full bg-brand-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          size="lg"
          className="h-[44px] w-full sm:w-auto sm:px-5"
        >
          상세 보기
        </Button>
        {isActive && (
          <Button
            variant="primary"
            size="lg"
            className="h-[44px] w-full sm:w-auto sm:px-5 gap-1.5"
          >
            <FileText className="h-4 w-4" />
            근무일지
          </Button>
        )}
        {isCompleted && !contract.review_submitted && (
          <Button
            variant="primary"
            size="lg"
            className="h-[44px] w-full sm:w-auto sm:px-5 gap-1.5"
          >
            <Star className="h-4 w-4" />
            후기 작성
          </Button>
        )}
        {isCompleted && contract.review_submitted && (
          <Button
            variant="secondary"
            size="lg"
            className="h-[44px] w-full sm:w-auto sm:px-5 gap-1.5"
            disabled
          >
            <MessageSquareText className="h-4 w-4" />
            후기 작성 완료
          </Button>
        )}
      </div>
    </li>
  );
}
