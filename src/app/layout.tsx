import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { DemoBanner } from '@/components/layout/DemoBanner';
import './globals.css';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: '이음다리 — 입원 간병 매칭 플랫폼',
    template: '%s · 이음다리',
  },
  description:
    '설명 가능한 매칭, 의료행위 경계관리, 병원규칙 안내. 3분이면 시작할 수 있는 입원 간병 매칭 플랫폼.',
  keywords: ['간병인', '입원 간병', '매칭', '돌봄', '요양보호사', '병원'],
  authors: [{ name: '이음다리' }],
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: '이음다리 — 입원 간병 매칭 플랫폼',
    description:
      '설명 가능한 매칭, 의료행위 경계관리, 병원규칙 안내. 3분이면 시작할 수 있습니다.',
    locale: 'ko_KR',
    type: 'website',
    siteName: '이음다리',
    url: BASE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: '이음다리 — 입원 간병 매칭 플랫폼',
    description: '설명 가능한 간병 매칭 플랫폼.',
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}#organization`,
      name: '이음다리',
      url: BASE_URL,
      logo: `${BASE_URL}/favicon.svg`,
      email: 'support@eeumdari.kr',
    },
    {
      '@type': 'Service',
      '@id': `${BASE_URL}#service`,
      name: '이음다리 간병 매칭',
      serviceType: '간병인 매칭 중개',
      areaServed: { '@type': 'Country', name: 'South Korea' },
      provider: { '@id': `${BASE_URL}#organization` },
      description:
        '입원 환자와 간병인을 연결하는 매칭 플랫폼. 케어 항목, 경력, 평점, 위험 요인 대응력을 가중 평균해 추천합니다.',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <DemoBanner />
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
