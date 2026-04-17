import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface LegalLayoutProps {
  title: string;
  description?: string;
  updatedAt: string;
  children: React.ReactNode;
}

export function LegalLayout({
  title,
  description,
  updatedAt,
  children,
}: LegalLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <nav className="flex items-center gap-1 text-xs text-muted" aria-label="breadcrumb">
        <Link href="/" className="hover:text-foreground">
          홈
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <span className="text-foreground">{title}</span>
      </nav>

      <header className="mt-4">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="mt-3 text-base text-muted leading-relaxed">{description}</p>
        )}
        <p className="mt-4 text-xs text-muted">최종 업데이트: {updatedAt}</p>
      </header>

      <div className="mt-8 prose prose-sm max-w-none dark:prose-invert">
        {children}
      </div>

      <div className="mt-12 flex items-center gap-2 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
        <p>
          본 문서는 베타 운영 기간의 임시 버전입니다. 정식 출시 시점에 사업자 정보,
          분쟁 해결 절차, 결제·환불 약관 등이 추가·갱신됩니다.
        </p>
      </div>
    </div>
  );
}
