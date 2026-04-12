import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} 이음다리. All rights reserved.
          </p>
          <nav className="flex gap-6">
            <Link
              href="#"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              이용약관
            </Link>
            <Link
              href="#"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              개인정보처리방침
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
