import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Dev 서버에 http://127.0.0.1:3000 과 http://localhost:3000 양쪽 접근 허용.
  // Playwright webServer는 기본적으로 127.0.0.1을 쓰기 때문에 필수.
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
    ],
  },
};

export default nextConfig;
