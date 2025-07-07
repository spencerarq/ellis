import { test, expect } from '@playwright/test';

test('deve permitir a criação de um novo curso', async ({ page }) => {
  // 1. Navegar para a página de cursos
  // Usar um caminho relativo é melhor, pois aproveita a `baseURL` da sua configuração do Playwright.
  await page.goto('/cursos');

  // 2. Verificar se a página correta foi carregada antes de prosseguir
  await expect(page.getByRole('heading', { name: 'Lista de Cursos' })).toBeVisible();

  // 3. Abrir o formulário de novo curso
  await page.getByTestId('add-curso-button').click();

  // 4. Preencher o formulário com os dados do curso
  // O .fill() já foca no campo, então o .click() antes é desnecessário.
  await page.getByTestId('curso-form-nome').fill('Playwright Avançado');
  await page.getByTestId('curso-form-codigo').fill('PW-02');
  await page.getByTestId('curso-form-carga-horaria').fill('420');

  // 5. Salvar o novo curso
  await page.getByTestId('curso-form-save-button').click();

  // 6. VERIFICAR se o novo curso aparece na lista com os dados corretos
  // Esta é a parte mais importante: um teste sem verificação não garante nada.
  const row = page.locator('tr', { hasText: 'Playwright Avançado' });
  await expect(row.getByRole('cell', { name: 'PW-02' })).toBeVisible();
  await expect(row.getByRole('cell', { name: '420' })).toBeVisible();
});