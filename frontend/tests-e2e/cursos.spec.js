import { test, expect } from '@playwright/test';

test.describe('Gerenciamento de Cursos', () => {
  let createdCourses = [];

  test.beforeEach(async ({ page }) => {
    await page.goto('/cursos');
    await page.waitForLoadState('networkidle');
    createdCourses = [];
  });

  test.afterEach(async ({ page }) => {
    // Limpeza específica apenas dos cursos criados no teste
    await cleanupSpecificCourses(page, createdCourses);
  });

  test('deve permitir a criação de um novo curso', async ({ page }) => {
    // Verificar se página carregou
    await expect(page.getByRole('heading', { name: 'Lista de Cursos' })).toBeVisible();

    // Criar curso com dados únicos
    const timestamp = Date.now();
    const courseCode = `PW-${timestamp}`;
    const courseName = `Playwright Avançado ${timestamp}`;

    // Abrir formulário
    await page.getByTestId('add-curso-button').click();

    // Preencher formulário
    await page.getByTestId('curso-form-nome').fill(courseName);
    await page.getByTestId('curso-form-codigo').fill(courseCode);
    await page.getByTestId('curso-form-carga-horaria').fill('420');

    // Salvar curso
    await page.getByTestId('curso-form-save-button').click();
    
    // Aguardar criação
    await page.waitForLoadState('networkidle');

    // Registrar curso criado para limpeza posterior
    createdCourses.push({ code: courseCode, name: courseName });

    // Verificar se curso foi criado
    const courseRow = page.locator('tr', { hasText: courseName });
    await expect(courseRow).toBeVisible();
    await expect(courseRow.getByRole('cell', { name: courseCode })).toBeVisible();
    await expect(courseRow.getByRole('cell', { name: '420' })).toBeVisible();
  });

  /**
   * Limpa apenas os cursos criados durante o teste
   */
  async function cleanupSpecificCourses(page, coursesToDelete) {
    if (coursesToDelete.length === 0) return;

    try {
      await page.goto('/cursos');
      await page.waitForLoadState('networkidle');

      for (const course of coursesToDelete) {
        try {
          // Procurar especificamente pelo curso criado
          const courseRow = page.locator('tr', { hasText: course.name });
          const deleteButton = courseRow.getByTestId('delete-button');
          
          if (await deleteButton.isVisible()) {
            await deleteButton.click();
            
            // Confirmar exclusão se modal aparecer
            const confirmButton = page.getByTestId('confirm-delete-button');
            if (await confirmButton.isVisible({ timeout: 2000 })) {
              await confirmButton.click();
            }
            
            await page.waitForLoadState('networkidle');
          }
        } catch (error) {
          console.log(`Erro ao deletar curso ${course.name}:`, error.message);
          // Continua para próximo curso
        }
      }
    } catch (error) {
      console.log('Erro geral na limpeza:', error.message);
    }
  }
});