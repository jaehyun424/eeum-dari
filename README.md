# 이음다리

> 입원 간병과 간병인을 이어주는 매칭 플랫폼

깜깜이 요금, 부족한 정보, 제도적 공백 — 이음다리는 이 세 가지 문제를 표준계약·안심결제·배상책임보험으로 해결합니다.

## 주요 기능

- **규칙 기반 매칭 엔진**: 경력·자격·지역·평점·응답속도·위험 대응력 6개 항목 가중치 점수 (설명 가능한 매칭)
- **간병 신청 6단계 폼**: 병원 검색·환자 정보·케어 항목·위험 플래그·선호사항·민감정보 동의
- **수동 심사 플래그**: 의료행위 경계(기관삽관·석션·감염격리) 자동 감지 → 전문 간병인 배정
- **보호자·간병인 대시보드**: 계약 관리, 근무일지(mood/events), 정산(월별 차트), 프로필 관리
- **표준계약·에스크로·보험**: 간병 요청 → 확인 → 자동 계약 흐름

## 기술 스택

- **프레임워크**: Next.js 16 (App Router, Turbopack) · React 19
- **언어**: TypeScript · Zod (런타임 검증)
- **스타일**: Tailwind CSS v4 + Pretendard
- **애니메이션**: Framer Motion
- **폼**: React Hook Form
- **백엔드**: Supabase (Auth, Postgres, Storage) — 예정
- **결제**: Stripe (에스크로) — 예정
- **테스트**: Playwright (E2E)
- **배포**: Vercel (서울 리전)

## 실행 방법

```bash
pnpm install
cp .env.example .env.local   # 필요 시 값 채우기 — Mock 모드에서는 비워둬도 동작
pnpm dev
```

`http://localhost:3000`에서 확인할 수 있습니다.

### E2E 테스트

```bash
pnpm test:e2e
```

별도 dev 서버가 떠 있어야 합니다. 시나리오는 `tests/matching.spec.ts` 참고.

### 프로덕션 빌드

```bash
pnpm build
pnpm start
```

## 환경변수

| 키 | 설명 | 필수 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 배포 시 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon 공개 키 | 배포 시 |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버 전용 서비스 키 (클라이언트 노출 금지) | 배포 시 |
| `STRIPE_WEBHOOK_SECRET` | Stripe 웹훅 서명 검증 | 결제 연동 시 |
| `STRIPE_SECRET_KEY` | Stripe 서버 키 | 결제 연동 시 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe 공개 키 | 결제 연동 시 |
| `NEXT_PUBLIC_APP_URL` | 배포 URL (기본 `http://localhost:3000`) | 선택 |

로컬 Mock 모드에서는 위 변수가 비어 있어도 매칭/대시보드가 동작합니다.

## 프로젝트 구조

```
src/
├── app/                      # Next.js App Router
│   ├── (marketing)/          # 랜딩
│   ├── (auth)/               # 로그인·회원가입
│   ├── (guardian)/           # 보호자
│   │   └── guardian/
│   │       ├── dashboard/
│   │       ├── request/      # 간병 신청 폼
│   │       ├── matching/[id]/
│   │       └── contracts/
│   ├── (caregiver)/          # 간병인
│   │   └── caregiver/
│   │       ├── dashboard/
│   │       ├── jobs/
│   │       ├── profile/
│   │       ├── worklog/
│   │       └── earnings/
│   └── api/
│       ├── auth/
│       ├── matching/
│       └── webhooks/
├── components/
│   ├── ui/                   # Button, Input, Modal, Badge, Card, Toast
│   ├── forms/                # CareRequestForm 6단계
│   ├── matching/             # 매칭 결과 UI 컴포넌트
│   └── layout/               # Header, Sidebar, MobileNav, Footer
├── hooks/                    # useAuth, useCareRequest, useMatching
├── lib/
│   ├── matching/             # algorithm.ts (가중치·규칙 기반 매칭)
│   ├── mock/                 # caregivers, reviews, contracts, work-logs, earnings
│   ├── types/                # database.ts, matching.ts, forms.ts
│   ├── constants/            # hospitals, care-items, risk-flags
│   └── utils/                # format, validation
└── styles/
```

## 기여

- main 브랜치는 보호됩니다. feature 브랜치에서 PR 보내주세요.
- Commit 컨벤션: `type: 한국어 설명` (`feat`, `fix`, `test`, `refactor`, `docs`, `chore`)

## 라이선스

© 2026 이음다리. All rights reserved.
