import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '이음다리 — 입원 간병 매칭 플랫폼';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #EFF5FF 0%, #DAE8FD 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            color: '#1E56A0',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={72} height={72}>
            <circle cx="8" cy="16" r="5" fill="currentColor" />
            <circle cx="24" cy="16" r="5" fill="currentColor" />
            <path
              d="M13 16 C16 8, 16 8, 19 16"
              stroke="#E8835A"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M13 16 C16 24, 16 24, 19 16"
              stroke="#E8835A"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span style={{ fontSize: 56, fontWeight: 700, color: '#1E56A0' }}>
            이음다리
          </span>
        </div>
        <p
          style={{
            marginTop: 36,
            fontSize: 48,
            fontWeight: 700,
            color: '#1A2B47',
            lineHeight: 1.2,
          }}
        >
          입원 간병, 이음다리가
          <br />
          이어드립니다
        </p>
        <p
          style={{
            marginTop: 24,
            fontSize: 28,
            color: '#52637A',
            lineHeight: 1.4,
          }}
        >
          설명 가능한 매칭 · 의료행위 경계관리 · 병원규칙 안내
        </p>
      </div>
    ),
    size,
  );
}
