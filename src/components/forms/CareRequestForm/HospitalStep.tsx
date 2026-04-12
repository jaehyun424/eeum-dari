'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import type { CareRequestFormData } from '@/lib/types/forms';
import { hospitals } from '@/lib/constants/hospitals';

interface StepProps {
  formData: Partial<CareRequestFormData>;
  onUpdate: (data: Partial<CareRequestFormData>) => void;
}

const regionFilters = ['전체', '서울', '경기', '기타'] as const;

export function HospitalStep({ formData, onUpdate }: StepProps) {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState<string>('전체');

  const filtered = hospitals.filter((h) => {
    const matchesSearch = h.name.includes(search) || h.address.includes(search);
    if (region === '전체') return matchesSearch;
    if (region === '기타') return matchesSearch && h.region !== '서울' && h.region !== '경기';
    return matchesSearch && h.region === region;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">병원 선택</h2>
      <p className="text-base text-muted">간병이 필요한 병원을 선택해주세요.</p>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="병원 이름으로 검색"
          className="block w-full rounded-lg border border-border bg-background pl-11 pr-4 py-3 text-base text-foreground placeholder:text-muted transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      {/* Region filter */}
      <div className="flex gap-2">
        {regionFilters.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRegion(r)}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              region === r
                ? 'bg-brand-600 text-white'
                : 'border border-border text-foreground hover:bg-surface-hover'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Hospital list */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-base text-muted">검색 결과가 없습니다.</p>
        ) : (
          filtered.map((hospital) => (
            <label
              key={hospital.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                formData.hospitalId === hospital.id
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-950'
                  : 'border-border hover:bg-surface-hover'
              }`}
            >
              <input
                type="radio"
                name="hospital"
                value={hospital.id}
                checked={formData.hospitalId === hospital.id}
                onChange={() => onUpdate({ hospitalId: hospital.id })}
                className="sr-only"
              />
              <div>
                <p className="text-base font-medium text-foreground">{hospital.name}</p>
                <p className="text-sm text-muted">{hospital.address}</p>
              </div>
            </label>
          ))
        )}
      </div>
    </div>
  );
}
