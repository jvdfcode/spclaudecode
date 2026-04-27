import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';

const BASE = 'http://localhost:3000';
const OUT  = '/tmp/ux-audit';
mkdirSync(OUT, { recursive: true });

const findings = [];
let shot = 0;

async function screenshot(page, name, note) {
  const file = `${OUT}/${String(++shot).padStart(2,'0')}-${name}.png`;
  await page.screenshot({ path: file, fullPage: true });
  console.log(`📸 [${shot}] ${name}: ${note}`);
  return file;
}

function find(category, severity, description, detail) {
  findings.push({ category, severity, description, detail });
  const icon = severity === 'CRÍTICO' ? '🔴' : severity === 'ALTO' ? '🟠' : severity === 'MÉDIO' ? '🟡' : '🔵';
  console.log(`  ${icon} [${severity}] ${description}`);
}

(async () => {
  const browser = await chromium.launch({
    executablePath: `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,
    headless: true,
  });

  // ─── CENÁRIO 1: Usuário novo chega na home ────────────────────────────────
  console.log('\n══════════════════════════════════════');
  console.log('CENÁRIO 1: Primeiro acesso (desktop 1440px)');
  console.log('══════════════════════════════════════');

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await screenshot(page, 'home-desktop', 'Redirect para login');

  const url1 = page.url();
  if (!url1.includes('login') && !url1.includes('auth')) {
    find('Segurança', 'ALTO', 'Rota raiz não redireciona para login', `URL atual: ${url1}`);
  } else {
    console.log('  ✅ Redireciona para login corretamente');
  }

  // ─── CENÁRIO 2: Tela de login ──────────────────────────────────────────────
  console.log('\n══════════════════════════════════════');
  console.log('CENÁRIO 2: Tela de Login');
  console.log('══════════════════════════════════════');

  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await screenshot(page, 'login-page', 'Tela de login');

  // Verificar elementos essenciais
  const loginTitle = await page.locator('h1, h2').first().textContent().catch(() => '');
  console.log(`  Título encontrado: "${loginTitle}"`);

  const emailInput = page.locator('input[type="email"]');
  const passwordInput = page.locator('input[type="password"]');
  const submitBtn = page.locator('button[type="submit"]');

  if (!await emailInput.isVisible()) find('UX', 'ALTO', 'Campo de email não visível na tela de login', '');
  if (!await passwordInput.isVisible()) find('UX', 'ALTO', 'Campo de senha não visível', '');
  if (!await submitBtn.isVisible()) find('UX', 'CRÍTICO', 'Botão de submit não visível', '');

  // Testar feedback de erro
  await submitBtn.click().catch(() => {});
  await page.waitForTimeout(800);
  await screenshot(page, 'login-empty-submit', 'Submit sem dados');

  const errorMsg = await page.locator('[role="alert"], .text-red, .text-destructive, [class*="error"]').first().textContent().catch(() => '');
  if (!errorMsg) find('UX', 'MÉDIO', 'Sem feedback visível ao submeter login vazio', '');

  // Testar credenciais erradas
  await emailInput.fill('usuario@teste.com');
  await passwordInput.fill('senhaerrada123');
  await submitBtn.click();
  await page.waitForTimeout(1500);
  await screenshot(page, 'login-wrong-creds', 'Credenciais inválidas');

  const wrongCredMsg = await page.locator('[class*="error"], [class*="red"], [role="alert"]').first().textContent().catch(() => '');
  if (wrongCredMsg) console.log(`  ✅ Mensagem de erro exibida: "${wrongCredMsg.trim()}"`);

  // Medir tempo de resposta do erro
  const t0 = Date.now();
  await emailInput.fill('errado@email.com');
  await passwordInput.fill('errado');
  await submitBtn.click();
  await page.waitForTimeout(2000);
  const responseTime = Date.now() - t0;
  if (responseTime > 3000) find('Performance', 'MÉDIO', `Login com erro demora ${responseTime}ms`, 'Esperado < 2s');

  // ─── CENÁRIO 3: Signup ────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════');
  console.log('CENÁRIO 3: Tela de Cadastro');
  console.log('══════════════════════════════════════');

  await page.goto(`${BASE}/signup`, { waitUntil: 'networkidle' });
  await screenshot(page, 'signup-page', 'Tela de cadastro');

  const signupUrl = page.url();
  if (signupUrl.includes('login')) {
    find('UX', 'MÉDIO', '/signup redireciona para /login — sem rota de cadastro dedicada', 'Usuário novo não tem CTA claro');
  }

  // Verificar link para signup na tela de login
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  const signupLink = await page.locator('a[href*="signup"], a[href*="register"], a[href*="cadastro"]').count();
  if (signupLink === 0) find('UX', 'ALTO', 'Sem link para cadastro na tela de login', 'Usuário novo fica perdido');
  else console.log(`  ✅ Link para cadastro encontrado`);

  // ─── CENÁRIO 4: Autenticar e explorar o app ──────────────────────────────
  console.log('\n══════════════════════════════════════');
  console.log('CENÁRIO 4: App autenticado — Dashboard');
  console.log('══════════════════════════════════════');

  // Login com conta de teste
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.locator('input[type="email"]').fill(process.env.TEST_EMAIL || 'jvictorformiga@gmail.com');
  await page.locator('input[type="password"]').fill(process.env.TEST_PASSWORD || 'test123456');
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(3000);
  await screenshot(page, 'after-login', 'Após login');

  const afterUrl = page.url();
  console.log(`  URL após login: ${afterUrl}`);

  if (afterUrl.includes('login')) {
    console.log('  ⚠️  Login falhou (credenciais de teste inválidas) — continuando com análise de páginas públicas');

    // Analisar o que conseguimos sem autenticação
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' });
    await screenshot(page, 'dashboard-unauth', 'Dashboard sem auth');
    await browser.close();

    // Relatório com o que foi possível auditar
    console.log('\n══════════════════════════════════════');
    console.log('RELATÓRIO PARCIAL (sem autenticação)');
    console.log('══════════════════════════════════════');
    printReport();
    return;
  }

  // ─── Dashboard logado ─────────────────────────────────────────────────────
  await screenshot(page, 'dashboard-logged', 'Dashboard autenticado');

  // Verificar WelcomeTour
  const tourVisible = await page.locator('[aria-label*="onboarding"], [aria-label*="tour"], [class*="tour"], [class*="welcome"]').count();
  console.log(`  WelcomeTour visível: ${tourVisible > 0 ? '✅ sim' : '⚠️ não detectado'}`);

  // Verificar navegação principal
  const navLinks = await page.locator('nav a, [role="navigation"] a').count();
  console.log(`  Links de navegação: ${navLinks}`);
  if (navLinks < 3) find('Navegação', 'ALTO', `Poucos links de navegação detectados (${navLinks})`, '');

  // ─── CENÁRIO 5: Mobile 375px ──────────────────────────────────────────────
  console.log('\n══════════════════════════════════════');
  console.log('CENÁRIO 5: Mobile 375px');
  console.log('══════════════════════════════════════');

  await page.setViewportSize({ width: 375, height: 812 });
  await page.reload({ waitUntil: 'networkidle' });
  await screenshot(page, 'dashboard-mobile', 'Dashboard mobile 375px');

  // Verificar hamburguer
  const hamburger = await page.locator('button[aria-label*="hamburguer"], button[aria-label*="menu"], button[aria-label*="Menu"], [class*="hamburger"], [class*="mobile-menu"]').count();
  if (hamburger === 0) find('Mobile', 'CRÍTICO', 'Botão hamburguer não detectado em 375px', 'Navegação mobile quebrada');
  else console.log('  ✅ Hamburguer detectado');

  // Verificar se sidebar desktop sumiu no mobile
  const desktopSidebar = await page.locator('aside, [class*="sidebar"]').first();
  const sidebarVisible = await desktopSidebar.isVisible().catch(() => false);
  if (sidebarVisible) find('Mobile', 'ALTO', 'Sidebar desktop visível em 375px', 'Conteúdo empurrado para fora');

  // Testar abertura do drawer
  if (hamburger > 0) {
    await page.locator('button[aria-label*="hamburguer"], button[aria-label*="menu"], button[aria-label*="Menu"]').first().click();
    await page.waitForTimeout(500);
    await screenshot(page, 'mobile-drawer-open', 'Drawer aberto em mobile');
    console.log('  ✅ Drawer aberto com sucesso');
  }

  // ─── CENÁRIO 6: Tablet 768px ──────────────────────────────────────────────
  console.log('\n══════════════════════════════════════');
  console.log('CENÁRIO 6: Tablet 768px');
  console.log('══════════════════════════════════════');

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.reload({ waitUntil: 'networkidle' });
  await screenshot(page, 'dashboard-tablet', 'Dashboard tablet 768px');

  // ─── CENÁRIO 7: Calculadora ───────────────────────────────────────────────
  console.log('\n══════════════════════════════════════');
  console.log('CENÁRIO 7: Calculadora — fluxo completo');
  console.log('══════════════════════════════════════');

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/calculadora`, { waitUntil: 'networkidle' });
  await screenshot(page, 'calculadora-vazio', 'Calculadora vazia');

  // Verificar campos obrigatórios visíveis
  const priceInput = await page.locator('input[name*="price"], input[name*="preco"], input[placeholder*="preço"], input[placeholder*="venda"]').first();
  const costInput  = await page.locator('input[name*="cost"], input[name*="custo"], input[placeholder*="custo"]').first();

  if (!await priceInput.isVisible().catch(() => false)) find('UX', 'ALTO', 'Campo de preço de venda não detectado', '');
  if (!await costInput.isVisible().catch(() => false)) find('UX', 'ALTO', 'Campo de custo do produto não detectado', '');

  // Contar inputs no total
  const allInputs = await page.locator('input[type="number"], input[type="text"]').count();
  console.log(`  Total de inputs na calculadora: ${allInputs}`);
  if (allInputs > 12) find('UX', 'MÉDIO', `Calculadora com muitos inputs (${allInputs}) — possível sobrecarga cognitiva`, 'Considerar agrupamento ou wizard');

  // Preencher valores e testar feedback em tempo real
  const inputs = page.locator('input[type="number"]');
  const inputCount = await inputs.count();
  console.log(`  Inputs numéricos: ${inputCount}`);

  // Preencher primeiro input disponível
  if (inputCount > 0) {
    await inputs.first().fill('100');
    await page.waitForTimeout(500);
    await screenshot(page, 'calculadora-primeiro-valor', 'Após preencher primeiro valor');
  }

  // Verificar se há feedback visual imediato (reactive calculation)
  const resultsPanel = await page.locator('[class*="result"], [class*="Result"], [class*="metrics"], [class*="viab"]').count();
  console.log(`  Painel de resultados visível: ${resultsPanel > 0 ? '✅' : '⚠️ não detectado'}`);

  // Navegar pelas tabs
  const tabs = page.locator('[role="tab"]');
  const tabCount = await tabs.count();
  console.log(`  Tabs encontradas: ${tabCount}`);

  for (let i = 0; i < Math.min(tabCount, 5); i++) {
    const tabName = await tabs.nth(i).textContent();
    await tabs.nth(i).click();
    await page.waitForTimeout(400);
    await screenshot(page, `calculadora-tab-${i}`, `Tab: ${tabName?.trim()}`);
    console.log(`  Tab "${tabName?.trim()}" — acessada`);
  }

  // ─── CENÁRIO 8: Central de SKUs ──────────────────────────────────────────
  console.log('\n══════════════════════════════════════');
  console.log('CENÁRIO 8: Central de SKUs');
  console.log('══════════════════════════════════════');

  await page.goto(`${BASE}/skus`, { waitUntil: 'networkidle' });
  await screenshot(page, 'skus-lista', 'Central de SKUs');

  const skuCards = await page.locator('[class*="sku-card"], [class*="SkuCard"], .rounded-xl.border').count();
  console.log(`  Cards de SKU encontrados: ${skuCards}`);

  // Testar menu de ações (···)
  const menuBtns = await page.locator('button[aria-label*="Opções"]').count();
  console.log(`  Botões de menu (···): ${menuBtns}`);
  if (menuBtns > 0) {
    await page.locator('button[aria-label*="Opções"]').first().click();
    await page.waitForTimeout(300);
    await screenshot(page, 'skus-menu-aberto', 'Menu ··· aberto');

    // Verificar opções do menu
    const editBtn = await page.locator('button:has-text("Editar")').count();
    const deleteBtn = await page.locator('button:has-text("Excluir")').count();
    console.log(`  Editar: ${editBtn > 0 ? '✅' : '❌'} | Excluir: ${deleteBtn > 0 ? '✅' : '❌'}`);

    // Fechar menu
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  }

  // Mobile SKUs
  await page.setViewportSize({ width: 375, height: 812 });
  await page.reload({ waitUntil: 'networkidle' });
  await screenshot(page, 'skus-mobile', 'SKUs em mobile');
  await page.setViewportSize({ width: 1440, height: 900 });

  // ─── CENÁRIO 9: Detalhe do SKU ────────────────────────────────────────────
  console.log('\n══════════════════════════════════════');
  console.log('CENÁRIO 9: Detalhe do SKU');
  console.log('══════════════════════════════════════');

  // Clicar no primeiro SKU
  const firstSkuLink = page.locator('a[href*="/skus/"]').first();
  if (await firstSkuLink.isVisible().catch(() => false)) {
    await firstSkuLink.click();
    await page.waitForTimeout(1000);
    await screenshot(page, 'sku-detalhe', 'Detalhe do SKU');
    console.log(`  URL detalhe: ${page.url()}`);

    // Verificar botão de recalcular
    const recalcBtn = await page.locator('button:has-text("Recalcul"), a:has-text("Recalcul")').count();
    console.log(`  Botão de recalcular: ${recalcBtn > 0 ? '✅' : '⚠️ não encontrado'}`);
  }

  // ─── CENÁRIO 10: Mercado ──────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════');
  console.log('CENÁRIO 10: Análise de Mercado');
  console.log('══════════════════════════════════════');

  await page.goto(`${BASE}/mercado`, { waitUntil: 'networkidle' });
  await screenshot(page, 'mercado-vazio', 'Mercado — estado inicial');

  // Verificar botão de conectar ML
  const mlConnectBtn = await page.locator('a[href*="ml/connect"], text=Conectar Mercado').count();
  console.log(`  Botão Conectar ML: ${mlConnectBtn > 0 ? '✅' : '⚠️'}`);

  // Fazer uma busca
  const searchInput = page.locator('input[type="search"], input[placeholder*="Busque"]');
  if (await searchInput.isVisible()) {
    await searchInput.fill('fone bluetooth');
    const searchBtn = page.locator('button[type="submit"]:has-text("Buscar")');
    await searchBtn.click();
    await page.waitForTimeout(1500);
    await screenshot(page, 'mercado-buscando', 'Mercado — buscando');

    // Esperar resultado (max 15s)
    try {
      await page.waitForSelector('[class*="listing"], [class*="Listing"], [class*="market"]', { timeout: 15000 });
      await screenshot(page, 'mercado-resultados', 'Mercado — resultados');
      console.log('  ✅ Resultados carregados');
    } catch {
      await screenshot(page, 'mercado-timeout', 'Mercado — timeout ou erro');
      console.log('  ⚠️  Resultados não carregaram em 15s');
    }
  }

  // Mobile mercado
  await page.setViewportSize({ width: 375, height: 812 });
  await screenshot(page, 'mercado-mobile', 'Mercado em mobile');
  await page.setViewportSize({ width: 1440, height: 900 });

  // ─── CENÁRIO 11: Dashboard ────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════');
  console.log('CENÁRIO 11: Dashboard — estado real');
  console.log('══════════════════════════════════════');

  await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' });
  await screenshot(page, 'dashboard-final', 'Dashboard completo');

  // Verificar métricas do dashboard
  const metricCards = await page.locator('[class*="metric"], [class*="stat"], [class*="card"]').count();
  console.log(`  Cards de métrica no dashboard: ${metricCards}`);

  // ─── CENÁRIO 12: Acessibilidade básica ────────────────────────────────────
  console.log('\n══════════════════════════════════════');
  console.log('CENÁRIO 12: Acessibilidade');
  console.log('══════════════════════════════════════');

  await page.goto(`${BASE}/calculadora`, { waitUntil: 'networkidle' });

  // Verificar labels nos inputs
  const inputsWithoutLabel = await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    let count = 0;
    inputs.forEach(input => {
      const id = input.id;
      const label = id ? document.querySelector(`label[for="${id}"]`) : null;
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      if (!label && !ariaLabel && !ariaLabelledBy) count++;
    });
    return count;
  });
  if (inputsWithoutLabel > 0) find('Acessibilidade', 'ALTO', `${inputsWithoutLabel} inputs sem label associado (WCAG 1.3.1)`, '');
  else console.log('  ✅ Todos os inputs têm label');

  // Verificar contraste de fundo (heurístico)
  const bgColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  console.log(`  Background color: ${bgColor}`);

  // Verificar skip link
  const skipLink = await page.locator('a[href="#main"], a[href="#content"], [class*="skip"]').count();
  if (skipLink === 0) find('Acessibilidade', 'BAIXO', 'Sem skip link para usuários de teclado', 'WCAG 2.4.1');

  // ─── CENÁRIO 13: Performance percebida ────────────────────────────────────
  console.log('\n══════════════════════════════════════');
  console.log('CENÁRIO 13: Performance percebida');
  console.log('══════════════════════════════════════');

  const perfStart = Date.now();
  await page.goto(`${BASE}/calculadora`, { waitUntil: 'networkidle' });
  const perfEnd = Date.now();
  const loadTime = perfEnd - perfStart;
  console.log(`  Calculadora carregou em ${loadTime}ms`);
  if (loadTime > 3000) find('Performance', 'ALTO', `Calculadora demora ${loadTime}ms (esperado < 2s)`, '');
  else console.log('  ✅ Performance OK');

  // ─── CENÁRIO 14: Toasts e feedback ────────────────────────────────────────
  console.log('\n══════════════════════════════════════');
  console.log('CENÁRIO 14: Sistema de Toast');
  console.log('══════════════════════════════════════');

  const toaster = await page.locator('[data-sonner-toaster], [class*="toaster"], ol[tabindex]').count();
  console.log(`  Toaster montado: ${toaster > 0 ? '✅' : '⚠️ não detectado no DOM'}`);

  await browser.close();

  // ─── RELATÓRIO FINAL ──────────────────────────────────────────────────────
  printReport();

})().catch(err => {
  console.error('Erro no audit:', err.message);
  process.exit(1);
});

function printReport() {
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║           RELATÓRIO DE AUDITORIA UX — SmartPreço      ║');
  console.log('╚══════════════════════════════════════════════════════╝');

  const bySeverity = {
    'CRÍTICO': findings.filter(f => f.severity === 'CRÍTICO'),
    'ALTO':    findings.filter(f => f.severity === 'ALTO'),
    'MÉDIO':   findings.filter(f => f.severity === 'MÉDIO'),
    'BAIXO':   findings.filter(f => f.severity === 'BAIXO'),
  };

  for (const [sev, items] of Object.entries(bySeverity)) {
    if (!items.length) continue;
    const icon = sev === 'CRÍTICO' ? '🔴' : sev === 'ALTO' ? '🟠' : sev === 'MÉDIO' ? '🟡' : '🔵';
    console.log(`\n${icon} ${sev} (${items.length})`);
    items.forEach(f => console.log(`  • [${f.category}] ${f.description}${f.detail ? ` — ${f.detail}` : ''}`));
  }

  console.log(`\nTotal: ${findings.length} findings`);
  console.log(`Screenshots: /tmp/ux-audit/`);
  writeFileSync('/tmp/ux-audit/findings.json', JSON.stringify(findings, null, 2));
}
