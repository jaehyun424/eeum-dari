'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-brand-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24">
            <circle cx="8" cy="16" r="5" fill="currentColor"/>
            <circle cx="24" cy="16" r="5" fill="currentColor"/>
            <path d="M13 16 C16 8, 16 8, 19 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <path d="M13 16 C16 24, 16 24, 19 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          </svg>
          이음다리
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 sm:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            로그인
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
          >
            시작하기
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden rounded-lg p-2 text-muted hover:bg-surface-hover"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 sm:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              로그인
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              시작하기
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
