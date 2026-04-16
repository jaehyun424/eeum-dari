# 이음다리 — Phase 5 E2E 테스트 리포트

## 환경
- Next.js 16.2.3 (Turbopack)
- Playwright (chromium)
- Node 20+, pnpm

## 실행 방법

```bash
# 1) 최초 1회: Playwright 설치
pnpm add -D @playwright/test
npx playwright install chromium

# 2) dev 서버 기동 (백그라운드)
pnpm dev > /tmp/eeum-dev.log 2>&1 &
DEV_PID=$!
sleep 8

# 3) 서버 응답 확인
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000   # 200 이어야 함

# 4) 테스트 실행
pnpm test:e2e

# 5) 종료
kill $DEV_PID
```

`pnpm test:e2e`는 `playwright test`를 실행합니다. `playwright.config.ts`에 chromium 프로젝트와 baseURL이 설정되어 있습니다.

## 테스트 시나리오 (tests/matching.spec.ts)

| # | 시나리오 | 검증 항목 | 스크린샷 |
|---|---------|----------|---------|
| 1 | 랜딩 페이지 | 헤더 "이음다리", 로고 SVG, "간병 신청" CTA, 히어로 `<video>` | `01-landing.png` |
| 2 | 로그인 | email/password input, 카카오/네이버/Google 버튼 3개 | `02-login.png` |
| 3 | 회원가입 (간병인) | "간병인 회원가입" 헤딩, 이메일/비밀번호 필드, 체크박스 4개+ | `03-register.png` |
| 4 | 매칭 진행 애니메이션 | "조건에 맞는 간병인을 찾고 있습니다" + SVG 원형 진행률 | `04-matching-progress.png` |
| 5 | 매칭 결과 화면 | "N명의 간병인을 찾았습니다", 3개+ 카드, "BEST MATCH" 배지 | `05-matching-results.png` |
| 6 | 상세 프로필 모달 | `dialog[open]`, 프로필 이미지, 매칭 점수 분석, 후기 섹션 | `06-profile-modal.png` |
| 7 | 요청 확인 모달 | "표준계약", "에스크로", "보험" 3줄 안내 | `07-request-confirm.png` |
| 8 | 모바일 반응형 (375x667) | 결과 렌더링, 카드 세로 스택 | `08-mobile-matching.png` |
| 9 | 간병 신청 폼 | "간병 신청" 헤딩, 프로그레스바 "1 / 6" | `09-care-request-form.png` |
| 10 | HTTP 200 경로 12개 | / , /login, /register, /guardian/*, /caregiver/* 전부 200 | — |

각 시나리오는 `page.on('console')` / `page.on('pageerror')`로 런타임 에러도 함께 캡처하여 회귀를 감지합니다.

## 결과 기록용 체크리스트

테스트 실행 후 아래를 채워주세요.

- [ ] 통과/실패: __ / 10
- [ ] 실패 테스트 에러: (있으면 메시지와 원인)
- [ ] `tests/screenshots/` 파일 수: __
- [ ] 각 스크린샷 파일 크기 20KB 이상: (확인 시 ✅)
- [ ] 콘솔 에러 0건: (있으면 내용)

## 스크린샷 경로

```
tests/screenshots/
├── 01-landing.png
├── 02-login.png
├── 03-register.png
├── 04-matching-progress.png
├── 05-matching-results.png
├── 06-profile-modal.png
├── 07-request-confirm.png
├── 08-mobile-matching.png
└── 09-care-request-form.png
```

스크린샷은 테스트 실행 시마다 재생성됩니다. `.gitignore`로 제외되어 있어 저장소에는 올라가지 않습니다.

## 실패 시 참고
- `tests/screenshots/` 외에도 실패 시 자동으로 `test-results/`에 trace와 스크린샷이 저장됩니다 (`trace: 'retain-on-failure'`).
- `npx playwright show-trace test-results/<trace-zip>`로 재현 가능합니다.
