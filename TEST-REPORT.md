# 이음다리 — E2E 테스트 리포트 (Beta Hardening)

## 환경
- Next.js 16.2.3 (Turbopack) · React 19
- Playwright (chromium)
- Node 20+, pnpm

## 실행 방법

`playwright.config.ts`의 `webServer` 설정이 `pnpm dev`를 자동으로 띄우므로 별도 기동이 필요 없습니다.

```bash
# 최초 1회: Playwright 브라우저 설치
npx playwright install chromium

# 테스트 실행 (자동으로 dev 서버 기동됨)
pnpm test:e2e
```

이미 dev 서버를 다른 터미널에서 띄워둔 경우:

```bash
E2E_BASE_URL=http://127.0.0.1:3000 pnpm test:e2e
```

## 테스트 시나리오 (tests/matching.spec.ts)

| # | 시나리오 | 검증 항목 |
|---|---------|----------|
| 01 | 랜딩 페이지 | 헤더 "이음다리", 로고 SVG, "간병 신청" CTA, 히어로 `<video>` 또는 static SVG |
| 02 | 로그인 Suspense + 소셜 비활성 | email/password input, "준비 중" 뱃지 표시, 안내 문구 |
| 03 | 회원가입 (간병인) | "간병인 회원가입" 헤딩, 이메일/비밀번호 필드, 체크박스 4개+ |
| 04 | 매칭 진행 애니메이션 | "조건에 맞는 간병인을 찾고 있습니다" + SVG 원형 진행률 |
| 05 | 매칭 결과 (mock `req-1`) | "N명의 간병인을 찾았습니다", 3개+ 카드, "BEST MATCH" 배지 |
| 06 | 상세 프로필 모달 | `dialog[open]`, 프로필 이미지, 매칭 점수 분석, 후기 섹션 |
| 07 | 요청 확인 모달 — **beta-safe 카피** | "표준계약서 템플릿 안내", "에스크로 준비 중", "배상책임보험 준비 중", 수동 확인 안내 |
| 08 | 모바일 반응형 (375x667) | 결과 렌더링, 카드 세로 스택 |
| 09 | 간병 신청 폼 6단계 | "간병 신청" 헤딩, 프로그레스바 "1 / 6" |
| 10 | 공개 경로 HTTP 200 | `/`, `/login`, `/register`, `/legal/*` 4개, `/support/*` 3개 |
| 11 | **Private 경로 proxy 동작** | `/guardian/*`, `/caregiver/*`는 4xx/5xx 없음 (env에 따라 200 or 307/308) |
| 12 | **매칭 API formData 제출** | `{formData}` POST → 200 + `careRequestId` 발급, `req-1` 아닌 unique id |
| 13 | **매칭 API 미지 id → 404** | `code: NOT_FOUND` (이전의 silent first-mock fallback 제거 검증) |
| 14 | 매칭 API 빈 바디 → 400 | Zod union validation 통과 |
| 15 | **Footer 링크 `#` 없음** | 모든 footer `<a href>`가 실제 경로 |

각 시나리오는 `page.on('console')` + `page.on('pageerror')`로 런타임 에러도 함께 캡처하여 회귀를 감지합니다.

## 검증 명령

```bash
pnpm lint          # 0 errors, 0 warnings
pnpm tsc --noEmit  # 0 errors
pnpm build         # 빌드 성공 (Turbopack)
pnpm test:e2e      # 15 시나리오
```

## Beta Hardening 주요 변경 점검

| 영역 | 이전 | 현재 | 검증 |
|---|---|---|---|
| Auth | `console.log(data)` | Supabase 실연결 + missing-env fallback | #02 Suspense/소셜 비활성 |
| Register Suspense | fallback 없음 | `RegisterSkeleton` 제공 | #03 |
| Proxy redirect | `updateSession`만 | `/login?next=...` + role guard | #11 |
| Private noindex | 없음 | layout metadata `robots.noindex` | — |
| CareRequest id | 고정 `req-1` | `req-{ts}-{rand}` | #12 |
| `/api/matching` 미지 id | 첫 mock fallback | 404 NOT_FOUND | #13 |
| Footer links | `href="#"` 7개 | 실제 legal/support 경로 | #15 |
| 랜딩 카피 | "보험 자동 적용" | "준비 중" 뱃지 | 수동 스크린샷 |
| `<img>` 5곳 | raw `<img>` | Avatar(next/image) | lint 통과 |
| `/api/webhooks` | 헤더 존재만 체크 | `constructEvent` 서명 검증 | 수동 curl |
| `(admin)` | 빈 layout만 | `/admin` placeholder 페이지 | build 성공 |

## 알려진 환경 의존성

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` 가 `.env.local`에 설정되면:
  - proxy가 `/login?next=...` 로 redirect → 테스트 11번은 307/308 응답을 기대
  - `useAuth.signIn`이 실제 Supabase 호출 수행
- env 미설정(beta-preview):
  - proxy가 redirect 스킵 → 테스트 11번은 200 응답을 기대
  - 로그인/회원가입 폼이 "서비스가 현재 연결되어 있지 않습니다" 토스트

두 모드 모두 테스트 기대값에 포함되도록 작성돼 있어 어느 쪽에서든 통과합니다.
