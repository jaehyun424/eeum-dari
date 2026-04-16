'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, CircleDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import {
  getCurrentMonthEarning,
  getEarningEntries,
  getMonthlyEarnings,
  getNextPayoutDate,
  getPreviousMonthEarning,
} from '@/lib/mock/earnings';
import type { EarningEntry } from '@/lib/types/database';

type Tab = 'pending' | 'paid';

function monthLabel(ym: string): string {
  const [y, m] = ym.split('-');
  return `${y.slice(2)}년 ${Number(m)}월`;
}

export default function EarningsPage() {
  const currentMonth = getCurrentMonthEarning();
  const prevMonth = getPreviousMonthEarning();
  const months = getMonthlyEarnings();
  const entries = getEarningEntries();
  const [tab, setTab] = useState<Tab>('pending');

  const changePct = prevMonth
    ? Math.round(((currentMonth.total - prevMonth.total) / prevMonth.total) * 100)
    : 0;
  const isUp = changePct >= 0;

  const pendingEntries = entries.filter((e) => e.status === 'pending');
  const paidEntries = entries.filter((e) => e.status === 'paid');
  const visibleEntries = tab === 'pending' ? pendingEntries : paidEntries;

  const maxMonthAmount = Math.max(...months.map((m) => m.total), 1);

  return (
    <div className="space-y-6 sm:space-y-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">정산</h1>
        <p className="mt-1 text-base text-muted">
          수입 내역과 정산 상태를 확인하세요.
        </p>
      </header>

      {/* 이번 달 수입 큰 카드 */}
      <section className="rounded-xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 sm:p-8 shadow-sm dark:border-brand-900/40 dark:from-brand-950/30 dark:to-background">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-700 dark:text-brand-300">
              {monthLabel(currentMonth.month)} 수입
            </p>
            <p className="mt-2 text-3xl sm:text-4xl font-bold text-foreground tabular-nums">
              {formatCurrency(currentMonth.total)}
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-sm">
              <span
                className={`inline-flex items-center gap-0.5 font-semibold ${
                  isUp ? 'text-success' : 'text-danger'
                }`}
              >
                {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {Math.abs(changePct)}%
              </span>
              <span className="text-muted">vs {prevMonth ? monthLabel(prevMonth.month) : '지난달'}</span>
            </p>
          </div>
          <div className="text-sm">
            <p className="text-muted">다음 정산 예정일</p>
            <p className="mt-1 text-base font-semibold text-foreground">
              {formatDate(getNextPayoutDate())}
            </p>
            <Button
              variant="outline"
              size="lg"
              className="mt-3 h-[44px] gap-1.5"
              disabled
              title="준비 중입니다"
            >
              <Wallet className="h-4 w-4" />
              빠른 출금 (준비 중)
            </Button>
          </div>
        </div>
      </section>

      {/* 월별 차트 */}
      <section className="rounded-xl border border-border bg-background p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">최근 3개월 추이</h2>
          <span className="text-xs text-muted">단위: 원</span>
        </div>
        <div className="mt-6 flex items-end justify-between gap-4">
          {months.map((m) => {
            const heightPct = (m.total / maxMonthAmount) * 100;
            return (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs tabular-nums text-muted">
                  {Math.round(m.total / 10_000).toLocaleString()}만
                </span>
                <div className="w-full h-48 rounded-t-lg bg-warm-gray-100 dark:bg-warm-gray-800 flex items-end overflow-hidden">
                  <div
                    className={`w-full rounded-t-lg transition-[height] duration-700 ${
                      m.status === 'paid'
                        ? 'bg-brand-500'
                        : 'bg-gradient-to-t from-brand-600 to-brand-400'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">{monthLabel(m.month)}</p>
                  <p className="text-xs text-muted">{m.days_worked}일</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 탭 */}
      <section>
        <div className="flex gap-2 border-b border-border mb-4">
          {(['pending', 'paid'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`relative inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === t ? 'text-brand-700 dark:text-brand-300' : 'text-muted hover:text-foreground'
              }`}
            >
              {t === 'pending' ? '정산 예정' : '정산 완료'}
              <span
                className={`inline-flex h-5 items-center rounded-full px-2 text-xs tabular-nums ${
                  tab === t
                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300'
                    : 'bg-warm-gray-100 text-muted dark:bg-warm-gray-800'
                }`}
              >
                {t === 'pending' ? pendingEntries.length : paidEntries.length}
              </span>
              {tab === t && (
                <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand-600" />
              )}
            </button>
          ))}
        </div>

        {visibleEntries.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted">
            해당 내역이 없습니다.
          </p>
        ) : (
          <ul className="space-y-2">
            {visibleEntries.map((e) => (
              <EntryRow key={e.id} entry={e} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function EntryRow({ entry }: { entry: EarningEntry }) {
  const isPaid = entry.status === 'paid';
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3.5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
          <CircleDollarSign className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {formatDate(entry.work_date)}
          </p>
          <p className="text-xs text-muted">{entry.hours}시간 근무</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-base font-bold text-foreground tabular-nums">
          {formatCurrency(entry.amount)}
        </p>
        <Badge variant={isPaid ? 'success' : 'warning'}>
          {isPaid ? '정산 완료' : '정산 예정'}
        </Badge>
      </div>
    </li>
  );
}
