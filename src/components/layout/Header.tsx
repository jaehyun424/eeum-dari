'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-brand-600">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" aria-hidden>
        <circle cx="8" cy="16" r="5" fill="currentColor"/>
        <circle cx="24" cy="16" r="5" fill="currentColor"/>
        <path d="M13 16 C16 8, 16 8, 19 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M13 16 C16 24, 16 24, 19 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </svg>
      이음다리
    </Link>
  );
}

function truncateEmail(email: string, max = 16): string {
  if (email.length <= max) return email;
  const [local, domain] = email.split('@');
  if (!domain) return email.slice(0, max - 1) + '…';
  const localShort = local.length > 8 ? local.slice(0, 7) + '…' : local;
  return `${localShort}@${domain}`;
}

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // body scroll lock + outside click + Escape
  useEffect(() => {
    if (!mobileMenuOpen && !userMenuOpen) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
      }
    }
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (userMenuOpen && userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [mobileMenuOpen, userMenuOpen]);

  // route change 시 메뉴 닫기
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // mobile menu open 시 body scroll lock
  useEffect(() => {
    if (mobileMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileMenuOpen]);

  async function handleSignOut() {
    await signOut();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    router.push('/');
    router.refresh();
  }

  const role = user?.user_metadata?.role as
    | 'guardian'
    | 'caregiver'
    | 'admin'
    | undefined;
  const dashboardHref =
    role === 'caregiver'
      ? '/caregiver/dashboard'
      : role === 'admin'
        ? '/admin'
        : '/guardian/dashboard';

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-3 sm:flex">
          {loading ? (
            <div className="h-8 w-28 animate-pulse rounded-lg bg-warm-gray-100" />
          ) : user ? (
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                aria-label="사용자 메뉴 열기"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-hover"
              >
                <UserIcon className="h-4 w-4 text-muted" />
                {truncateEmail(user.email ?? '계정')}
              </button>
              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+6px)] w-52 rounded-xl border border-border bg-background p-2 shadow-lg"
                >
                  <Link
                    href={dashboardHref}
                    role="menuitem"
                    className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-surface-hover"
                  >
                    내 대시보드
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-surface-hover"
                  >
                    <LogOut className="h-4 w-4 text-muted" />
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
              >
                시작하기
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-panel"
          className="sm:hidden rounded-lg p-2 text-muted hover:bg-surface-hover"
          onClick={() => setMobileMenuOpen((v) => !v)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu — backdrop + panel */}
      {mobileMenuOpen && (
        <>
          <div
            aria-hidden
            className="fixed inset-0 top-16 z-30 bg-foreground/20 sm:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            id="mobile-nav-panel"
            ref={mobileMenuRef}
            className="relative z-40 border-t border-border bg-background px-4 py-4 sm:hidden"
          >
            {loading ? (
              <div className="h-10 animate-pulse rounded-lg bg-warm-gray-100" />
            ) : user ? (
              <nav className="flex flex-col gap-1">
                <div className="px-3 py-2 text-xs text-muted">
                  {user.email ?? '로그인됨'}
                </div>
                <Link
                  href={dashboardHref}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-surface-hover"
                >
                  내 대시보드
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground hover:bg-surface-hover"
                >
                  <LogOut className="h-4 w-4 text-muted" />
                  로그아웃
                </button>
              </nav>
            ) : (
              <nav className="flex flex-col gap-1">
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-surface-hover hover:text-foreground"
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-brand-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
                >
                  시작하기
                </Link>
              </nav>
            )}
          </div>
        </>
      )}
    </header>
  );
}
