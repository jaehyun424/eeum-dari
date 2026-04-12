import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import './globals.css';

export const metadata: Metadata = {
  title: '이음다리 - 간병인 매칭 플랫폼',
  description:
    '환자와 간병인을 이어주는 신뢰할 수 있는 매칭 플랫폼. 맞춤형 간병 서비스를 찾아보세요.',
  keywords: ['간병인', '매칭', '돌봄', '케어', '병원'],
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
