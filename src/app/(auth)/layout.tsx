import Link from 'next/link';

function LogoSvg({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size} className={className}>
      <circle cx="8" cy="16" r="5" fill="currentColor"/>
      <circle cx="24" cy="16" r="5" fill="currentColor"/>
      <path d="M13 16 C16 8, 16 8, 19 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M13 16 C16 24, 16 24, 19 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between bg-brand-600 px-12 py-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white">
          <LogoSvg size={28} />
          이음다리
        </Link>

        {/* Center text */}
        <h2 className="text-3xl font-bold leading-snug text-white">
          간병의 시작과 끝을,
          <br />
          안심하고 맡기세요.
        </h2>

        {/* Empty bottom for spacing */}
        <div />
      </div>

      {/* Right panel — form area */}
      <div className="flex w-full flex-col lg:w-1/2">
        {/* Mobile logo */}
        <div className="px-6 pt-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-brand-600">
            <LogoSvg />
            이음다리
          </Link>
        </div>

        {/* Form */}
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
