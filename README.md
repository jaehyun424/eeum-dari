# 이음다리

> 입원 간병과 간병인을 이어주는 매칭 플랫폼 (Private Beta)

깜깜이 요금, 부족한 정보, 제도적 공백 — 이음다리는 **설명 가능한 매칭**과 **의료행위 경계관리**, **병원규칙 안내**로 이 문제를 풀고자 합니다. 표준계약·에스크로 안심결제·배상책임보험은 정식 출시와 함께 도입 예정입니다.

## 현재 상태 (Beta)

- 랜딩, 로그인/회원가입, 간병 신청 6단계, 매칭 엔진, 매칭 결과, 보호자·간병인 대시보드, 계약 관리 UI가 모두 구현돼 있습니다.
- 인증은 Supabase Auth로 **실제 연결**되어 있으며, env 미설정 시 `beta-preview` 모드로 동작합니다 (honest fallback).
- 간병 신청은 **unique id**를 서버에서 발급합니다 (`req-{ts}-{rand}`). 고정 `req-1` 아님.
- 결제·보험·Supabase DB는 **준비 중** — UI 카피에 명시돼 있습니다.
- **표시되는 사용자·간병인 정보는 예시(mock)** 입니다. 루트 배너로 고지됩니다.

## 주요 기능

- **규칙 기반 매칭 엔진**: 케어 항목·경력·평점·거리·응답속도·위험 대응력 6개 항목 가중평균 (`src/lib/matching/algorithm.ts`)
- **간병 신청 6단계 폼**: 병원 검색 · 환자 정보 · 케어 항목 · 위험 플래그 · 선호사항 · 민감정보 동의
- **수동 심사 플래그**: 기관절개·흡인·격리 등 의료행위 경계 항목 자동 감지
- **보호자·간병인 대시보드**: 계약 관리, 근무일지, 월별 정산, 프로필 관리
- **보호 라우트**: `/guardian`, `/caregiver`, `/admin`은 `src/proxy.ts`에서 로그인/role 검증 후 접근 허용 (Next.js 16 proxy convention)
- **베타 고지**: 루트 `DemoBanner` + 카피 전반이 구현 상태와 정합성 있게 조정됨

## 기술 스택

- **프레임워크**: Next.js 16 (App Router, Turbopack) · React 19
- **언어**: TypeScript · Zod v4 (런타임 검증)
- **스타일**: Tailwind CSS v4
- **애니메이션**: Framer Motion
- **폼**: React Hook Form
- **백엔드**: Supabase Auth (연결 완료) + Postgres (예정)
- **결제**: Stripe (`constructEvent` 서명 검증 적용, 이벤트 핸들러 TODO)
- **분석**: Vercel Analytics + Speed Insights
- **테스트**: Playwright (E2E 15 시나리오)
- **배포**: Vercel (서울 리전)

## 실행 방법

```bash
pnpm install
cp .env.example .env.local   # 값을 비워두면 beta-preview(mock) 모드로 동작
pnpm dev
```

`http://localhost:3000`

### Beta-preview(Mock) 모드 동작

env 미설정 시 다음과 같이 동작합니다 (fake success 금지, honest fallback):

| 영역 | 동작 |
|---|---|
| 로그인/회원가입 | `useAuth`가 `missing_env` 에러를 반환, 토스트로 "준비 중" 안내 |
| Proxy 보호 라우트 | env 없으면 로컬 dev 편의를 위해 redirect 스킵 (인증 자체 비활성) |
| 간병 신청 | 서버 런타임 메모리 저장소에 저장 (같은 lambda 내 즉시 조회) + 클라이언트 sessionStorage 복구 |
| Stripe 웹훅 | `mock` 모드 — 200 OK + 로깅, 실제 결제 처리 없음 |

### E2E 테스트

```bash
pnpm test:e2e
```

`playwright.config.ts`의 `webServer` 설정이 `pnpm dev`를 자동으로 띄웁니다. 별도 서버를 이미 띄워둔 경우 `E2E_BASE_URL` 환경변수를 지정하세요.

### 프로덕션 빌드

```bash
pnpm build
pnpm start
```

## 환경변수

| 키 | 설명 | 필수 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 배포 시 (없으면 beta-preview) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon 공개 키 | 배포 시 |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버 전용 서비스 키 (클라이언트 노출 금지) | 관리자 기능 적용 시 |
| `STRIPE_SECRET_KEY` | Stripe 서버 키 | 결제 연동 시 |
| `STRIPE_WEBHOOK_SECRET` | Stripe 웹훅 서명 검증 | 결제 연동 시 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe 공개 키 | 결제 연동 시 |
| `NEXT_PUBLIC_APP_URL` | 배포 URL (OG/sitemap에 사용, 기본 `http://localhost:3000`) | 선택 |

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 + DemoBanner + JSON-LD + Analytics
│   ├── robots.ts               # public allow, private/api disallow
│   ├── sitemap.ts              # public 경로 sitemap
│   ├── opengraph-image.tsx     # 1200x630 OG 이미지
│   ├── (marketing)/            # 랜딩, legal/*, support/*
│   ├── (auth)/                 # 로그인·회원가입 (Suspense 적용)
│   ├── (guardian)/             # 보호자 대시보드·신청·매칭·계약
│   ├── (caregiver)/            # 간병인 대시보드·일감·일지·정산·프로필
│   ├── (admin)/                # placeholder (정식 출시 이후)
│   └── api/
│       ├── auth/route.ts       # GET health/info (POST는 clientside useAuth 사용)
│       ├── matching/route.ts   # Zod union body — {careRequestId} | {formData}
│       └── webhooks/route.ts   # Stripe constructEvent 서명 검증
├── components/
│   ├── ui/                     # Button, Input, Modal, Badge, Card, Toast, Avatar
│   ├── legal/                  # LegalLayout (약관·운영정책 공통)
│   ├── forms/CareRequestForm/  # 6단계 폼
│   ├── matching/               # 매칭 결과 UI (MatchSummaryCard, CaregiverMatchCard, …)
│   └── layout/                 # Header, Sidebar, MobileNav, Footer, DemoBanner
├── hooks/
│   ├── useAuth.ts              # Supabase 연결 + env 미설정 fallback
│   ├── useCareRequest.ts
│   └── useMatching.ts          # POST /api/matching 호출 + notFound 플래그
├── lib/
│   ├── matching/algorithm.ts   # 가중치 기반 매칭 + clampScore
│   ├── repositories/           # care-requests.ts (runtime + mock fallback)
│   ├── supabase/               # client, server, admin, middleware
│   ├── mock/                   # caregivers, contracts, work-logs, earnings, …
│   ├── types/                  # database, matching, forms, api-errors
│   ├── constants/              # hospitals, care-items, risk-flags
│   └── utils/                  # format, validation
├── proxy.ts                    # Next.js 16 proxy — auth redirect + role guard
└── styles/
```

## 알려진 제한사항 (Beta)

- **Runtime store persistence**: `lib/repositories/care-requests.ts`의 in-memory Map은 Vercel serverless 환경에서 function instance마다 분리됩니다. 클라이언트 `sessionStorage` 복구가 first-line, Supabase 테이블 연동이 long-term 해결책.
- **인증**: 비밀번호 리셋, 이메일 재인증, OAuth는 미구현. 소셜 로그인 버튼은 "준비 중" 상태로 표시만.
- **결제·보험·법적 효력**: 표준계약서 템플릿, 에스크로 결제, 배상책임보험은 설계 단계. UI 카피는 모두 "준비 중" 으로 정직하게 표시.
- **관리자 도구**: placeholder 페이지만 노출. role === 'admin' 일 때만 proxy가 통과시킴.

## 기여

- main 브랜치는 보호됩니다. feature 브랜치에서 PR 보내주세요.
- Commit 컨벤션: `type(scope): 한국어 설명` (`feat`, `fix`, `test`, `refactor`, `docs`, `chore`, `perf`)

## 라이선스

© 2026 이음다리. All rights reserved.
