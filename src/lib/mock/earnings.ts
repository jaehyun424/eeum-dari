import type {
  EarningEntry,
  MonthlyEarning,
} from '@/lib/types/database';

export const mockMonthlyEarnings: MonthlyEarning[] = [
  { month: '2026-02', total: 5_256_000, days_worked: 20, status: 'paid' },
  { month: '2026-03', total: 7_776_000, days_worked: 30, status: 'paid' },
  { month: '2026-04', total: 6_480_000, days_worked: 15, status: 'pending' },
];

function dateIn(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

const APRIL_RATE = 18000 * 24; // cg-001 일당

export const mockEarningEntries: EarningEntry[] = Array.from({ length: 15 }).map(
  (_, i) => {
    const day = 17 - i;
    return {
      id: `er-apr-${String(day).padStart(2, '0')}`,
      contract_id: 'ct-001',
      caregiver_id: 'cg-001',
      work_date: dateIn(2026, 4, day),
      hours: 24,
      amount: APRIL_RATE,
      status: 'pending',
      paid_at: null,
    };
  },
);

// 3월 정산 완료 내역 (샘플 10개)
const MARCH_RATE = 18000 * 24;
for (let day = 22; day <= 31; day++) {
  mockEarningEntries.push({
    id: `er-mar-${String(day).padStart(2, '0')}`,
    contract_id: 'ct-001',
    caregiver_id: 'cg-001',
    work_date: dateIn(2026, 3, day),
    hours: 24,
    amount: MARCH_RATE,
    status: 'paid',
    paid_at: '2026-04-03T10:00:00.000Z',
  });
}

export function getMonthlyEarnings(): MonthlyEarning[] {
  return [...mockMonthlyEarnings];
}

export function getEarningEntries(
  caregiverId: string = 'cg-001',
): EarningEntry[] {
  return mockEarningEntries
    .filter((e) => e.caregiver_id === caregiverId)
    .sort((a, b) => b.work_date.localeCompare(a.work_date));
}

export function getNextPayoutDate(): string {
  return '2026-05-03';
}

export function getCurrentMonthEarning(): MonthlyEarning {
  return mockMonthlyEarnings[mockMonthlyEarnings.length - 1];
}

export function getPreviousMonthEarning(): MonthlyEarning | null {
  const len = mockMonthlyEarnings.length;
  return len >= 2 ? mockMonthlyEarnings[len - 2] : null;
}
