'use client';

import { CareRequestForm } from '@/components/forms/CareRequestForm';

export default function CareRequestPage() {
  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground">간병 신청</h1>
        <p className="mt-2 text-base text-muted">
          필요한 정보를 입력하면 맞춤 간병인을 매칭해드립니다.
        </p>
      </div>
      <div className="mt-8">
        <CareRequestForm />
      </div>
    </div>
  );
}
