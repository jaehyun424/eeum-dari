'use client';

import { Building2, User, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/format';
import { hospitals } from '@/lib/constants/hospitals';
import { careItems } from '@/lib/constants/care-items';
import type { MatchResult } from '@/lib/types/matching';

interface Props {
  result: MatchResult;
}

export function MatchSummaryCard({ result }: Props) {
  const { careRequest, matches } = result;
  const hospital = hospitals.find((h) => h.id === careRequest.hospital_id);
  const itemLabels = careRequest.care_items
    .map((id) => careItems.find((c) => c.id === id)?.label)
    .filter((label): label is string => Boolean(label));

  return (
    <Card className="border-brand-100 dark:border-brand-900/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand-600">매칭 결과</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-foreground">
            {matches.length}명의 간병인을 찾았습니다
          </h1>
        </div>
        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="28"
            height="28"
            className="text-brand-600"
          >
            <circle cx="8" cy="16" r="5" fill="currentColor" />
            <circle cx="24" cy="16" r="5" fill="currentColor" />
            <path
              d="M13 16 C16 8, 16 8, 19 16"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M13 16 C16 24, 16 24, 19 16"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="flex items-start gap-2.5">
          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
          <div>
            <dt className="text-xs text-muted">병원</dt>
            <dd className="text-sm font-medium text-foreground">
              {hospital?.name ?? '—'}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <User className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
          <div>
            <dt className="text-xs text-muted">환자</dt>
            <dd className="text-sm font-medium text-foreground">
              {careRequest.patient_name} · {careRequest.patient_age}세{' '}
              {careRequest.patient_gender === 'female' ? '여' : '남'}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
          <div>
            <dt className="text-xs text-muted">기간</dt>
            <dd className="text-sm font-medium text-foreground">
              {formatDate(careRequest.care_start_date)}
              {careRequest.care_end_date
                ? ` ~ ${formatDate(careRequest.care_end_date)}`
                : ''}
            </dd>
          </div>
        </div>
      </dl>

      {itemLabels.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {itemLabels.map((label) => (
            <Badge key={label} variant="brand">
              {label}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
