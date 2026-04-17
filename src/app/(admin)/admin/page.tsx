import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: '관리자',
  robots: { index: false, follow: false, nocache: true },
};

// 관리자 화면은 정식 출시 이후 활성화됩니다.
// 인증·권한 판정은 src/proxy.ts에서 role === 'admin' 일 때만 통과.
export default function AdminPage() {
  return (
    <div className="mx-auto max-w-2xl py-20">
      <div className="rounded-xl border border-border bg-background p-8 sm:p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-warm-gray-100 text-muted">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-foreground">
          관리자 기능은 준비 중입니다
        </h1>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          사용자·간병인 심사, 분쟁 처리, 정산 관리 도구가 정식 출시와 함께
          공개됩니다. 문의는{' '}
          <a className="text-brand-600 underline" href="mailto:support@eeumdari.kr">
            support@eeumdari.kr
          </a>
          로 부탁드립니다.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-hover"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
