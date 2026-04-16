import { test, expect, devices, type Page } from '@playwright/test';

const SHOT_DIR = 'tests/screenshots';

function capture(name: string) {
  return `${SHOT_DIR}/${name}`;
}

async function listenConsole(page: Page, errors: string[]) {
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[console.error] ${msg.text()}`);
  });
  page.on('pageerror', (err) => {
    errors.push(`[pageerror] ${err.message}`);
  });
}

test.describe('이음다리 Phase 5 E2E', () => {
  test('01: 랜딩 페이지 기본 동작', async ({ page }) => {
    const errors: string[] = [];
    await listenConsole(page, errors);
    await page.goto('/');
    await expect(page.locator('header').getByText('이음다리')).toBeVisible();
    await expect(page.locator('header svg').first()).toBeVisible();
    await expect(
      page.getByRole('link', { name: /간병 신청/ }).first(),
    ).toBeVisible();
    await expect(page.locator('video').first()).toBeAttached();
    await page.screenshot({ path: capture('01-landing.png'), fullPage: true });
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('02: 로그인 페이지', async ({ page }) => {
    const errors: string[] = [];
    await listenConsole(page, errors);
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /카카오/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /네이버/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Google/i })).toBeVisible();
    await page.screenshot({ path: capture('02-login.png'), fullPage: true });
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('03: 회원가입 페이지 (간병인)', async ({ page }) => {
    const errors: string[] = [];
    await listenConsole(page, errors);
    await page.goto('/register?role=caregiver');
    await expect(
      page.getByRole('heading', { name: '간병인 회원가입' }),
    ).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    const checkboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    expect(checkboxCount).toBeGreaterThanOrEqual(4);
    await page.screenshot({ path: capture('03-register.png'), fullPage: true });
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('04: 매칭 페이지 — 진행 애니메이션', async ({ page }) => {
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

  test('05: 매칭 페이지 — 결과 화면', async ({ page }) => {
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

  test('07: 요청 확인 모달', async ({ page }) => {
    const errors: string[] = [];
    await listenConsole(page, errors);
    await page.goto('/guardian/matching/req-1');
    await page.waitForTimeout(4000);
    await page.getByRole('button', { name: '이 분께 요청' }).first().click();
    const dialog = page.locator('dialog[open]');
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByText('표준계약서가 자동 생성됩니다'),
    ).toBeVisible();
    await expect(
      dialog.getByText('에스크로 결제로 완료 후 정산됩니다'),
    ).toBeVisible();
    await expect(
      dialog.getByText('배상책임보험이 자동 적용됩니다'),
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
    await expect(page.getByText(/1\s*\/\s*6/).first()).toBeVisible();
    await page.screenshot({
      path: capture('09-care-request-form.png'),
      fullPage: true,
    });
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('10: 주요 경로 HTTP 200 확인', async ({ request }) => {
    const paths = [
      '/',
      '/login',
      '/register',
      '/guardian/dashboard',
      '/guardian/request',
      '/guardian/matching/req-1',
      '/guardian/contracts',
      '/caregiver/dashboard',
      '/caregiver/jobs',
      '/caregiver/profile',
      '/caregiver/worklog',
      '/caregiver/earnings',
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
});
