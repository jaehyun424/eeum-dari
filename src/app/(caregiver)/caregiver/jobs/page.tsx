'use client';

import { useState } from 'react';
import { Building2, Calendar, Wallet, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/matching/EmptyState';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { mockCaregivers } from '@/lib/mock/caregivers';
import { mockCareRequests } from '@/lib/mock/care-requests';
import { generateMatches } from '@/lib/matching/algorithm';
import { hospitals } from '@/lib/constants/hospitals';
import { careItems } from '@/lib/constants/care-items';
import type { CareRequest } from '@/lib/types/database';

const extraJobs: CareRequest[] = [
  {
    id: 'job-a',
    guardian_id: 'g-100',
    hospital_id: 'h4',
    patient_name: '윤미자',
    patient_age: 79,
    patient_gender: 'female',
    care_start_date: '2026-04-25',
    care_end_date: '2026-05-25',
    care_items: ['basic_meal', 'basic_diaper', 'basic_hygiene', 'basic_position'],
    risk_flags: ['risk_bedsore'],
    preferences: { preferredGender: 'female', nightCareNeeded: true, mobilityLevel: 'bedridden' },
    status: 'matching',
    created_at: '2026-04-16T10:00:00.000Z',
    updated_at: '2026-04-16T10:00:00.000Z',
  },
  {
    id: 'job-b',
    guardian_id: 'g-101',
    hospital_id: 'h5',
    patient_name: '한명수',
    patient_age: 74,
    patient_gender: 'male',
    care_start_date: '2026-04-28',
    care_end_date: '2026-05-12',
    care_items: ['basic_meal', 'basic_medicine', 'move_walk'],
    risk_flags: ['risk_fall'],
    preferences: { preferredGender: 'any', nightCareNeeded: false, mobilityLevel: 'assisted' },
    status: 'matching',
    created_at: '2026-04-16T11:00:00.000Z',
    updated_at: '2026-04-16T11:00:00.000Z',
  },
  {
    id: 'job-c',
    guardian_id: 'g-102',
    hospital_id: 'h3',
    patient_name: '장경자',
    patient_age: 81,
    patient_gender: 'female',
    care_start_date: '2026-05-01',
    care_end_date: '2026-06-01',
    care_items: ['basic_meal', 'basic_diaper', 'emotional_companion', 'move_wheelchair'],
    risk_flags: ['risk_dementia', 'risk_wandering'],
    preferences: { preferredGender: 'female', nightCareNeeded: true, mobilityLevel: 'wheelchair' },
    status: 'matching',
    created_at: '2026-04-16T12:00:00.000Z',
    updated_at: '2026-04-16T12:00:00.000Z',
  },
  {
    id: 'job-d',
    guardian_id: 'g-103',
    hospital_id: 'h6',
    patient_name: '권순옥',
    patient_age: 68,
    patient_gender: 'female',
    care_start_date: '2026-04-30',
    care_end_date: '2026-05-14',
    care_items: ['basic_meal', 'basic_hygiene', 'move_transfer'],
    risk_flags: [],
    preferences: { preferredGender: 'any', nightCareNeeded: false, mobilityLevel: 'assisted' },
    status: 'matching',
    created_at: '2026-04-16T13:00:00.000Z',
    updated_at: '2026-04-16T13:00:00.000Z',
  },
  {
    id: 'job-e',
    guardian_id: 'g-104',
    hospital_id: 'h8',
    patient_name: '백춘자',
    patient_age: 83,
    patient_gender: 'female',
    care_start_date: '2026-05-05',
    care_end_date: '2026-05-19',
    care_items: ['basic_meal', 'basic_toilet', 'emotional_companion'],
    risk_flags: ['risk_dementia'],
    preferences: { preferredGender: 'female', nightCareNeeded: false, mobilityLevel: 'independent' },
    status: 'matching',
    created_at: '2026-04-16T14:00:00.000Z',
    updated_at: '2026-04-16T14:00:00.000Z',
  },
];

const ALL_JOBS: CareRequest[] = [...mockCareRequests, ...extraJobs];

const REGION_FILTERS = ['전체', '서울', '경기', '인천'];

export default function JobsPage() {
  const me = mockCaregivers[0];
  const [regionFilter, setRegionFilter] = useState<string>('전체');

  const jobs = ALL_JOBS.filter((job) => {
    if (regionFilter === '전체') return true;
    const hospital = hospitals.find((h) => h.id === job.hospital_id);
    return hospital?.region === regionFilter;
  }).map((job) => {
    const result = generateMatches(job, [me]);
    return { job, score: result.matches[0]?.score.totalScore ?? 0 };
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">일감 찾기</h1>
        <p className="mt-1 text-base text-muted">
          {me.name}님께 적합한 일감을 점수 순으로 보여드립니다.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-sm text-muted mr-2">
          <SlidersHorizontal className="h-4 w-4" />
          지역
        </span>
        {REGION_FILTERS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRegionFilter(r)}
            className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-medium transition-colors ${
              regionFilter === r
                ? 'bg-brand-600 text-white'
                : 'bg-surface text-muted hover:bg-surface-hover hover:text-foreground'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          title="조건에 맞는 일감이 없어요"
          description="다른 지역을 선택해보세요."
        />
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {jobs.map(({ job, score }) => (
            <JobCard key={job.id} job={job} score={score} />
          ))}
        </ul>
      )}
    </div>
  );
}

function JobCard({ job, score }: { job: CareRequest; score: number }) {
  const hospital = hospitals.find((h) => h.id === job.hospital_id);
  const itemLabels = job.care_items
    .map((id) => careItems.find((c) => c.id === id)?.label)
    .filter((l): l is string => Boolean(l));

  const days = Math.max(
    1,
    Math.round(
      (new Date(job.care_end_date).getTime() - new Date(job.care_start_date).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );

  return (
    <li className="flex flex-col rounded-xl border border-border bg-background p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <Building2 className="h-4 w-4" />
            {hospital?.name}
          </p>
          <h2 className="mt-1 text-lg font-bold text-foreground">
            {job.patient_name} · {job.patient_age}세 {job.patient_gender === 'female' ? '여성' : '남성'}
          </h2>
        </div>
        <div className="shrink-0 text-right">
          <span className="text-xs text-muted">매칭 점수</span>
          <p className="text-2xl font-bold text-brand-600 tabular-nums leading-none">{score}</p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            기간
          </dt>
          <dd className="mt-0.5 font-medium text-foreground">
            {formatDate(job.care_start_date)}부터
          </dd>
          <dd className="text-xs text-muted">약 {days}일</dd>
        </div>
        <div>
          <dt className="text-xs text-muted flex items-center gap-1">
            <Wallet className="h-3.5 w-3.5" />
            일일 요금 (예상)
          </dt>
          <dd className="mt-0.5 font-medium text-foreground">
            {formatCurrency(18000 * 24)}
          </dd>
          <dd className="text-xs text-muted">24시간 기준</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {itemLabels.slice(0, 4).map((label) => (
          <Badge key={label} variant="default">{label}</Badge>
        ))}
        {itemLabels.length > 4 && (
          <Badge variant="default">+{itemLabels.length - 4}</Badge>
        )}
      </div>

      {job.risk_flags.length > 0 && (
        <p className="mt-3 text-xs text-muted flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-accent-500" />
          특이사항: {job.risk_flags.length}건
        </p>
      )}

      <div className="mt-5 flex gap-2">
        <Button variant="outline" size="lg" className="h-[44px] flex-1">
          상세 보기
        </Button>
        <Button variant="primary" size="lg" className="h-[44px] flex-1">
          지원하기
        </Button>
      </div>
    </li>
  );
}
