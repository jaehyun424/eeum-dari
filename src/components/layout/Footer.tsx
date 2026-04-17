import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold text-brand-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="22" height="22" aria-hidden>
                <circle cx="8" cy="16" r="5" fill="currentColor" />
                <circle cx="24" cy="16" r="5" fill="currentColor" />
                <path d="M13 16 C16 8, 16 8, 19 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M13 16 C16 24, 16 24, 19 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
              이음다리
            </Link>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              설명 가능한 간병 매칭.<br />
              이음다리가 이어드립니다.
            </p>
          </div>

          {/* 서비스 */}
          <div>
            <p className="text-sm font-semibold text-foreground">서비스</p>
            <nav className="mt-3 flex flex-col gap-2">
              <FooterLink href="/guardian/request">간병 신청</FooterLink>
              <FooterLink href="/register?role=caregiver">간병인 등록</FooterLink>
              <FooterLink href="/login?next=/guardian/dashboard">보호자 로그인</FooterLink>
              <FooterLink href="/login?next=/caregiver/dashboard">간병인 로그인</FooterLink>
            </nav>
          </div>

          {/* 고객 지원 */}
          <div>
            <p className="text-sm font-semibold text-foreground">고객 지원</p>
            <nav className="mt-3 flex flex-col gap-2">
              <FooterLink href="/support/faq">자주 묻는 질문</FooterLink>
              <FooterLink href="/support/notices">공지사항</FooterLink>
              <FooterLink href="/support/contact">문의하기</FooterLink>
              <FooterLink href="mailto:support@eeumdari.kr">support@eeumdari.kr</FooterLink>
            </nav>
          </div>

          {/* 정책 */}
          <div>
            <p className="text-sm font-semibold text-foreground">정책</p>
            <nav className="mt-3 flex flex-col gap-2">
              <FooterLink href="/legal/terms">이용약관</FooterLink>
              <FooterLink href="/legal/privacy">개인정보처리방침</FooterLink>
              <FooterLink href="/legal/sensitive-info">민감정보 수집·이용 동의</FooterLink>
              <FooterLink href="/legal/operations">운영정책</FooterLink>
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted">
          <p>© {year} 이음다리. All rights reserved.</p>
          <p className="mt-1">
            베타 서비스 운영 중 · 정식 출시 시 사업자 정보가 공시됩니다.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-muted hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  );
}
