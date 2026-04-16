'use client';

import { useState } from 'react';
import {
  Plus,
  Utensils,
  Pill,
  Bath,
  Calendar as CalendarIcon,
  List,
  Smile,
  Meh,
  Frown,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/format';
import { getWorkLogsForCaregiver } from '@/lib/mock/work-logs';
import { getContractsForCaregiver } from '@/lib/mock/contracts';
import { EmptyState } from '@/components/matching/EmptyState';
import type { WorkLog, WorkLogMood } from '@/lib/types/database';

const MOOD_ICONS: Record<WorkLogMood, React.ReactNode> = {
  happy: <Smile className="h-4 w-4 text-success" />,
  normal: <Meh className="h-4 w-4 text-brand-500" />,
  tired: <Frown className="h-4 w-4 text-accent-600" />,
};

const MOOD_LABEL: Record<WorkLogMood, string> = {
  happy: '좋음',
  normal: '보통',
  tired: '피로',
};

type View = 'list' | 'calendar';

export default function WorklogPage() {
  const logs = getWorkLogsForCaregiver();
  const contracts = getContractsForCaregiver();
  const activeContracts = contracts.filter((c) => c.status === 'active' || c.status === 'completed');
  const [selectedContract, setSelectedContract] = useState<string>(
    activeContracts[0]?.id ?? 'all',
  );
  const [view, setView] = useState<View>('list');

  const filtered = logs.filter((l) =>
    selectedContract === 'all' ? true : l.contract_id === selectedContract,
  );

  const monthlyHours = filtered.reduce(
    (acc, l) => acc + hoursBetween(l.start_time, l.end_time),
    0,
  );

  return (
    <div className="relative space-y-6 sm:space-y-8 pb-24">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">근무일지</h1>
          <p className="mt-1 text-base text-muted">
            이번 달 근무 {filtered.length}일 · 누적 {Math.round(monthlyHours)}시간
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedContract}
            onChange={(e) => setSelectedContract(e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="all">전체 계약</option>
            {activeContracts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.hospital_name} · {c.patient_name}
              </option>
            ))}
          </select>

          <div className="inline-flex h-10 overflow-hidden rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setView('list')}
              className={`inline-flex items-center gap-1 px-3 text-sm font-medium transition-colors ${
                view === 'list' ? 'bg-brand-600 text-white' : 'bg-background text-muted hover:bg-surface-hover'
              }`}
            >
              <List className="h-4 w-4" />
              리스트
            </button>
            <button
              type="button"
              onClick={() => setView('calendar')}
              className={`inline-flex items-center gap-1 border-l border-border px-3 text-sm font-medium transition-colors ${
                view === 'calendar' ? 'bg-brand-600 text-white' : 'bg-background text-muted hover:bg-surface-hover'
              }`}
            >
              <CalendarIcon className="h-4 w-4" />
              달력
            </button>
          </div>
        </div>
      </header>

      {filtered.length === 0 ? (
        <EmptyState
          title="아직 근무 기록이 없어요"
          description="간병이 시작되면 이곳에 일지가 쌓입니다."
        />
      ) : view === 'list' ? (
        <ul className="space-y-3">
          {filtered.map((log) => (
            <WorkLogCard key={log.id} log={log} />
          ))}
        </ul>
      ) : (
        <CalendarView logs={filtered} />
      )}

      {/* FAB */}
      <button
        type="button"
        className="fixed bottom-20 right-4 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg hover:bg-brand-700 sm:bottom-8 sm:right-8"
        aria-label="새 근무일지 작성"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}

function WorkLogCard({ log }: { log: WorkLog }) {
  return (
    <li className="rounded-xl border border-border bg-background p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold text-foreground">{formatDate(log.date)}</p>
          <span className="text-sm text-muted">
            {log.start_time} ~ {log.end_time}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted">
          {MOOD_ICONS[log.mood]}
          <span>{MOOD_LABEL[log.mood]}</span>
        </div>
      </div>

      <p className="mt-3 text-sm text-foreground leading-relaxed">{log.notes}</p>

      <dl className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <Stat icon={<Utensils className="h-3.5 w-3.5" />} label="식사" value={`${log.meal_count}회`} />
        <Stat icon={<Bath className="h-3.5 w-3.5" />} label="화장실" value={`${log.bathroom_count}회`} />
        <Stat icon={<Pill className="h-3.5 w-3.5" />} label="복약" value={log.medicine_taken ? '완료' : '미완료'} />
      </dl>

      {log.significant_events.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {log.significant_events.map((ev) => (
            <Badge key={ev} variant="warning">{ev}</Badge>
          ))}
        </div>
      )}
    </li>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted">
      {icon}
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </span>
  );
}

function CalendarView({ logs }: { logs: WorkLog[] }) {
  const dateSet = new Set(logs.map((l) => l.date));

  // Build current month grid from the latest log date
  const latest = logs[0]?.date ?? new Date().toISOString().slice(0, 10);
  const [yearStr, monthStr] = latest.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr) - 1;
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = first.getDay(); // 0=Sun

  const cells: Array<{ day: number; hasLog: boolean } | null> = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${yearStr}-${monthStr}-${String(d).padStart(2, '0')}`;
    cells.push({ day: d, hasLog: dateSet.has(dateStr) });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <section className="rounded-xl border border-border bg-background p-5 sm:p-6 shadow-sm">
      <p className="text-base font-semibold text-foreground">
        {year}년 {month + 1}월
      </p>
      <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-xs text-muted">
        {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
          <div key={d} className="py-2 font-medium">{d}</div>
        ))}
        {cells.map((c, i) => (
          <div
            key={i}
            className={`aspect-square flex items-center justify-center rounded-lg text-sm ${
              !c
                ? ''
                : c.hasLog
                  ? 'bg-brand-600 text-white font-semibold'
                  : 'bg-warm-gray-100 dark:bg-warm-gray-800 text-muted'
            }`}
          >
            {c?.day ?? ''}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">
        파란색 날짜는 근무일지가 작성된 날입니다.
      </p>
    </section>
  );
}

function hoursBetween(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return (eh + em / 60) - (sh + sm / 60);
}
