import { test, expect, devices, type Page } from '@playwright/test';

const SHOT_DIR = 'tests/screenshots';

function capture(name: string) {
  return `${SHOT_DIR}/${name}`;
}

// 브라우저/확장이 주입하는 style(caret-color) 로 인한 hydration 경고는 환경
// 의존적이므로 테스트 관점에서는 무시한다.
const IGNORED_CONSOLE_PATTERNS: RegExp[] = [
  /caret-color/i,
  /webpack-hmr/i,
  /hydration mismatch/i,
  /hydrated but some attributes of the server rendered html didn't match/i,
];

function shouldIgnoreConsole(text: string): boolean {
  return IGNORED_CONSOLE_PATTERNS.some((re) => re.test(text));
}

async function listenConsole(page: Page, errors: string[]) {
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (shouldIgnoreConsole(text)) return;
    errors.push(`[console.error] ${text}`);
  });
  page.on('pageerror', (err) => {
    if (shouldIgnoreConsole(err.message)) return;
    errors.push(`[pageerror] ${err.message}`);
  });
}

test.describe('이음다리 Beta Hardening E2E', () => {
  test('01: 랜딩 페이지 기본 동작', async ({ page }) => {
    const errors: string[] = [];
    await listenConsole(page, errors);
    await page.goto('/');
    await expect(page.locator('header').getByText('이음다리')).toBeVisible();
    await expect(page.locator('header svg').first()).toBeVisible();
    await expect(
      page.getByRole('link', { name: /간병 신청/ }).first(),
    ).toBeVisible();
    // Hero 비디오 또는 static fallback 둘 중 하나는 존재
    const hasMedia =
      (await page.locator('video, svg[viewBox="0 0 800 440"]').count()) > 0;
    expect(hasMedia).toBe(true);
    await page.screenshot({ path: capture('01-landing.png'), fullPage: true });
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('02: 로그인 페이지 Suspense + 소셜 비활성', async ({ page }) => {
    const errors: string[] = [];
    await listenConsole(page, errors);
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    const kakao = page.getByRole('button', { name: /카카오.*준비 중/ });
    const naver = page.getByRole('button', { name: /네이버.*준비 중/ });
    const google = page.getByRole('button', { name: /Google.*준비 중/i });
    await expect(kakao).toBeVisible();
    await expect(naver).toBeVisible();
    await expect(google).toBeVisible();
    await expect(page.getByText(/소셜 로그인은 베타 기간 중 준비 중/)).toBeVisible();
    await page.screenshot({ path: capture('02-login.png'), fullPage: true });
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('03: 회원가입 페이지 Suspense 렌더 — 역할 선택 후 폼', async ({ page }) => {
    const errors: string[] = [];
    await listenConsole(page, errors);
    await page.goto('/register?role=caregiver');
    await expect(
      page.getByRole('heading', { name: '간병인 회원가입' }),
    ).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    const checkboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    expect(checkboxCount).toBeGreaterThanOrEqual(4);
    await page.screenshot({ path: capture('03-register.png'), fullPage: true });
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('04: 매칭 페이지 — 진행 애니메이션 (mock id)', async ({ page }) => {
    const errors: string[] = [];
    await listenConsole(page, errors);
    await page.goto('/guardian/matching/req-1');
    await expect(
      page.getByText('조건에 맞는 간병인을 찾고 있습니다'),
    ).toBeVisible();
    await expect(page.locator('svg circle').first()).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: capture('04-matching-progress.png'),
      fullPage: true,
    });
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('05: 매칭 페이지 — 결과 화면 (mock id)', async ({ page }) => {
    const errors: string[] = [];
    await listenConsole(page, errors);
    await page.goto('/guardian/matching/req-1');
    await page.waitForTimeout(4000);
    await expect(page.getByText(/명의 간병인을 찾았습니다/)).toBeVisible();
    const cards = page.locator('article');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThanOrEqual(3);
    await expect(page.getByText('BEST MATCH').first()).toBeVisible();
    await expect(page.getByRole('button', { name: '상세 프로필' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: '이 분께 요청' }).first()).toBeVisible();
    await page.screenshot({
      path: capture('05-matching-results.png'),
      fullPage: true,
    });
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('06: 간병인 상세 프로필 모달', async ({ page }) => {
    const errors: string[] = [];
    await listenConsole(page, errors);
    await page.goto('/guardian/matching/req-1');
    await page.waitForTimeout(4000);
    await page.getByRole('button', { name: '상세 프로필' }).first().click();
    const dialog = page.locator('dialog[open]');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('img').first()).toBeVisible();
    await expect(
      dialog.getByRole('heading', { name: /매칭 점수 분석/ }),
    ).toBeVisible();
    await expect(
      dialog.getByRole('heading', { name: /보호자 후기/ }),
    ).toBeVisible();
    await page.screenshot({
      path: capture('06-profile-modal.png'),
      fullPage: true,
    });
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('07: 요청 확인 모달 — beta-safe 카피', async ({ page }) => {
    const errors: string[] = [];
    await listenConsole(page, errors);
    await page.goto('/guardian/matching/req-1');
    await page.waitForTimeout(4000);
    await page.getByRole('button', { name: '이 분께 요청' }).first().click();
    const dialog = page.locator('dialog[open]');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/표준계약서 템플릿이 함께 안내/)).toBeVisible();
    await expect(dialog.getByText(/에스크로.*준비 중/)).toBeVisible();
    await expect(dialog.getByText(/배상책임보험.*준비 중/)).toBeVisible();
    await expect(
      dialog.getByText(/베타 단계이므로 요청은 운영팀이 수동 확인/),
    ).toBeVisible();
    await page.screenshot({
      path: capture('07-request-confirm.png'),
      fullPage: true,
    });
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('08: 모바일 반응형 (375x667)', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone SE'] });
    const page = await context.newPage();
    const errors: string[] = [];
    await listenConsole(page, errors);
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/guardian/matching/req-1');
    await page.waitForTimeout(4000);
    await expect(page.getByText(/명의 간병인을 찾았습니다/)).toBeVisible();
    await page.screenshot({
      path: capture('08-mobile-matching.png'),
      fullPage: true,
    });
    await context.close();
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('09: 간병 신청 폼 6단계', async ({ page }) => {
    const errors: string[] = [];
    await listenConsole(page, errors);
    await page.goto('/guardian/request');
    await expect(page.getByRole('heading', { name: '간병 신청' })).toBeVisible();
    // desktop/mobile 둘 다 "1 / 6" 텍스트가 존재 — visible 조건 완화
    const progressText = page.getByText(/1\s*\/\s*6/);
    await expect(progressText.first()).toBeAttached();
    await page.screenshot({
      path: capture('09-care-request-form.png'),
      fullPage: true,
    });
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('10: 공개 경로 HTTP 200 — 랜딩/인증/legal/support', async ({
    request,
  }) => {
    const paths = [
      '/',
      '/login',
      '/register',
      '/legal/terms',
      '/legal/privacy',
      '/legal/sensitive-info',
      '/legal/operations',
      '/support/faq',
      '/support/notices',
      '/support/contact',
    ];
    const failures: Array<{ path: string; status: number }> = [];
    for (const p of paths) {
      const res = await request.get(p);
      if (res.status() !== 200) {
        failures.push({ path: p, status: res.status() });
      }
    }
    expect(failures, JSON.stringify(failures)).toEqual([]);
  });

  test('11: private 경로는 Supabase env 미설정 시 200 (mock proxy)', async ({
    request,
  }) => {
    // Supabase env가 설정돼 있으면 /login?next=... redirect, 미설정이면 200 OK.
    // 둘 중 어떤 응답이든 에러(4xx/5xx)는 없어야 함.
    const paths = [
      '/guardian/dashboard',
      '/guardian/request',
      '/guardian/contracts',
      '/caregiver/dashboard',
      '/caregiver/jobs',
      '/caregiver/earnings',
    ];
    const failures: Array<{ path: string; status: number }> = [];
    for (const p of paths) {
      const res = await request.get(p, { maxRedirects: 0 });
      const s = res.status();
      // 200(mock), 307/308(redirect to /login) 허용. 4xx/5xx만 실패.
      if (s >= 400) failures.push({ path: p, status: s });
    }
    expect(failures, JSON.stringify(failures)).toEqual([]);
  });

  test('12: 매칭 API — 유효 formData는 400이 아닌 200 반환', async ({ request }) => {
    const res = await request.post('/api/matching', {
      data: {
        formData: {
          hospitalId: 'h1',
          patientName: '테스트환자',
          patientAge: 70,
          patientGender: 'female',
          careItems: ['basic_meal'],
          riskFlags: [],
          preferredGender: 'any',
          careStartDate: '2027-01-01',
        },
      },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(typeof data.careRequestId).toBe('string');
    expect(data.careRequestId.startsWith('req-')).toBe(true);
    // 반환 ID가 고정 req-1이 아니어야 — 실제 formData 저장 검증
    expect(data.careRequestId).not.toBe('req-1');
    expect(Array.isArray(data.matches)).toBe(true);
  });

  test('13: 매칭 API — 미지의 careRequestId는 404', async ({ request }) => {
    const res = await request.post('/api/matching', {
      data: { careRequestId: 'req-does-not-exist-xxx' },
    });
    expect(res.status()).toBe(404);
    const data = await res.json();
    expect(data.code).toBe('NOT_FOUND');
  });

  test('14: 매칭 API — 빈 바디는 400', async ({ request }) => {
    const res = await request.post('/api/matching', {
      data: {},
    });
    expect(res.status()).toBe(400);
  });

  test('15: Footer legal/support 링크 — href가 # 이 아님', async ({ page }) => {
    await page.goto('/');
    const footerLinks = page.locator('footer a[href]');
    const hrefs = await footerLinks.evaluateAll((links) =>
      links.map((l) => (l as HTMLAnchorElement).getAttribute('href')),
    );
    const hasHash = hrefs.some((h) => h === '#');
    expect(hasHash, `Footer links: ${hrefs.join(', ')}`).toBe(false);
  });
});
