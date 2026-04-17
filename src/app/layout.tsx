import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { DemoBanner } from '@/components/layout/DemoBanner';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '이음다리 — 입원 간병 매칭 플랫폼',
    template: '%s · 이음다리',
  },
  description:
    '검증된 간병인, 표준계약, 안심결제까지. 3분이면 시작할 수 있는 입원 간병 매칭 플랫폼.',
  keywords: ['간병인', '입원 간병', '매칭', '돌봄', '요양보호사', '병원'],
  authors: [{ name: '이음다리' }],
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: '이음다리 — 입원 간병 매칭 플랫폼',
    description:
      '검증된 간병인, 표준계약, 안심결제까지. 3분이면 시작할 수 있습니다.',
    locale: 'ko_KR',
    type: 'website',
    siteName: '이음다리',
  },
  twitter: {
    card: 'summary_large_image',
    title: '이음다리 — 입원 간병 매칭 플랫폼',
    description: '검증된 간병인, 표준계약, 안심결제.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <DemoBanner />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
