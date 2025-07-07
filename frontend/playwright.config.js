import { defineConfig, devices } from '@playwright/test';

/**
 * Lê a URL base da variável de ambiente, com um fallback para o ambiente de desenvolvimento local.
 * Esta é a mesma variável que o docker-compose injeta.
 */
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Diretório onde os testes E2E estão localizados.
  testDir: './tests-e2e',
  // Executa os testes em paralelo.
  fullyParallel: true,
  // Previne o uso de `test.only` em ambientes de CI.
  forbidOnly: !!process.env.CI,
  // Número de tentativas para testes que falham (0 para local, 2 para CI).
  retries: process.env.CI ? 2 : 0,
  // Número de workers para rodar os testes.
  workers: process.env.CI ? 1 : undefined,
  // Formato do relatório de testes. 'html' é ótimo para análise visual.
  reporter: 'html',

  // Configurações globais para todos os projetos de teste.
  use: {
    
    timeout: 10000,
    // Define a URL base para todas as ações de navegação (ex: page.goto('/')).
    baseURL: baseURL,
    // Grava um traço da execução do teste na primeira tentativa falha.
    trace: 'on-first-retry',
  },

  // Configura projetos para os principais navegadores.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  // Inicia o servidor de desenvolvimento automaticamente ao rodar testes localmente.
  webServer: {
    command: 'npm run start',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});