'use client';

import { Camera, CheckCircle2, Pencil, MapPin, Wallet, Award, Sparkles, User } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/format';
import { mockCaregivers } from '@/lib/mock/caregivers';

const completeness = 85;

function avatarFallback(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1E56A0&color=fff&size=300&bold=true`;
}

export default function CaregiverProfilePage() {
  const me = mockCaregivers[0];

  return (
    <div className="space-y-6 sm:space-y-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">프로필 관리</h1>
        <p className="mt-1 text-base text-muted">
          프로필이 충실할수록 매칭 우선순위가 높아집니다.
        </p>
      </header>

      {/* 완성도 바 */}
      <section className="rounded-xl border border-border bg-background p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">프로필 완성도</p>
          <span className="text-xl font-bold text-accent-600 tabular-nums">{completeness}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-warm-gray-200 dark:bg-warm-gray-800">
          <div className="h-full rounded-full bg-accent-500" style={{ width: `${completeness}%` }} />
        </div>
        <p className="mt-2 text-sm text-muted">
          자격증을 1개 더 추가하면 100% 완료됩니다.
        </p>
      </section>

      {/* 프로필 헤더 */}
      <section className="rounded-xl border border-border bg-background p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            <img
              src={me.profile_image}
              alt=""
              width={120}
              height={120}
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.dataset.fallback) {
                  img.dataset.fallback = '1';
                  img.src = avatarFallback(me.name);
                }
              }}
              className="h-28 w-28 rounded-xl object-cover bg-warm-gray-100"
            />
            <button
              type="button"
              className="absolute -bottom-2 -right-2 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-brand-600 text-white shadow hover:bg-brand-700"
              aria-label="사진 변경"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">{me.name}</h2>
              <span className="text-sm text-muted">
                {me.age}세 · {me.gender === 'female' ? '여성' : '남성'}
              </span>
            </div>
            {me.is_verified && (
              <Badge variant="brand" className="mt-2">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                신원·자격 검증 완료
              </Badge>
            )}
            <p className="mt-3 text-sm text-muted">
              회원 가입일: 2025-10-03 · 활성 상태
            </p>
          </div>
        </div>
      </section>

      {/* 섹션 목록 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          icon={<User className="h-4 w-4" />}
          title="기본 정보"
        >
          <Row label="이름" value={me.name} />
          <Row label="연락처" value="010-****-****" />
          <Row label="주소" value="서울 종로구 (상세 비공개)" />
        </SectionCard>

        <SectionCard
          icon={<Pencil className="h-4 w-4" />}
          title="경력 및 소개"
        >
          <Row label="경력" value={`${me.experience_years}년`} />
          <p className="mt-3 text-sm text-foreground leading-relaxed">{me.bio}</p>
        </SectionCard>

        <SectionCard
          icon={<Award className="h-4 w-4" />}
          title="보유 자격증"
        >
          <div className="flex flex-wrap gap-1.5">
            {me.certifications.map((cert) => (
              <Badge key={cert} variant="brand">{cert}</Badge>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">자격증을 1개 더 등록하면 매칭 노출이 증가합니다.</p>
        </SectionCard>

        <SectionCard
          icon={<Sparkles className="h-4 w-4" />}
          title="전문 분야"
        >
          <div className="flex flex-wrap gap-1.5">
            {me.specialties.map((s) => (
              <Badge key={s} variant="default">{s}</Badge>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          icon={<MapPin className="h-4 w-4" />}
          title="활동 지역"
        >
          <div className="flex flex-wrap gap-1.5">
            {me.available_areas.map((a) => (
              <Badge key={a} variant="default">{a}</Badge>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          icon={<Wallet className="h-4 w-4" />}
          title="시간당 요금"
        >
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {formatCurrency(me.hourly_rate)} <span className="text-sm font-normal text-muted">/ 시간</span>
          </p>
          <p className="mt-1 text-xs text-muted">
            1일 24시간 기준 약 {formatCurrency(me.daily_rate)}
          </p>
        </SectionCard>
      </div>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-background p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <span className="text-brand-600">{icon}</span>
          {title}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-brand-600 hover:text-brand-700"
        >
          <Pencil className="h-3.5 w-3.5" />
          수정
        </Button>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
