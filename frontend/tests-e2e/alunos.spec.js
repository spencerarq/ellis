const { test, expect } = require('@playwright/test');

test.describe('Gerenciamento de Alunos', () => {
  let createdStudents = [];

  test.beforeEach(async ({ page }) => {
    // Navega para a página de alunos e aguarda o carregamento da rede
    await page.goto('/alunos');
    await page.waitForLoadState('networkidle');
    createdStudents = []; // Limpa a lista antes de cada teste
  });

  test.afterEach(async ({ page }) => {
    // Limpa apenas os alunos criados durante o teste para garantir o isolamento
    await cleanupSpecificStudents(page, createdStudents);
  });

  test('deve permitir a criação de um novo aluno', async ({ page }) => {
    // Verificar se a página carregou corretamente
    await expect(page.getByRole('heading', { name: 'Lista de Alunos' })).toBeVisible();

    // Criar dados únicos para o novo aluno
    const timestamp = Date.now();
    const studentName = `Aluno Teste ${timestamp}`;
    const studentEmail = `aluno.teste.${timestamp}@example.com`;
    const studentPhone = '987654321';

    // Abrir o formulário de adição
    await page.getByTestId('add-aluno-button').click();

    // Preencher o formulário
    await page.getByTestId('aluno-form-nome').fill(studentName);
    await page.getByTestId('aluno-form-email').fill(studentEmail);
    await page.getByTestId('aluno-form-telefone').fill(studentPhone);

    // Salvar o novo aluno
    await page.getByTestId('aluno-form-save-button').click();
    await page.waitForLoadState('networkidle');

    // Registrar o aluno criado para limpeza posterior
    createdStudents.push({ email: studentEmail, name: studentName });

    // Localizar a linha esperada na tabela
    const row = page.locator(`tr:has-text("${studentName}")`);

    // Esperar explicitamente que a linha apareça no DOM. Esta é a correção principal.
    await row.waitFor();

    // Agora, fazer as asserções com segurança
    await expect(row.getByRole('cell', { name: studentEmail })).toBeVisible();
    await expect(row.getByRole('cell', { name: studentPhone })).toBeVisible();
  });

  /**
   * Limpa os alunos específicos criados durante a execução do teste.
   */
  async function cleanupSpecificStudents(page, studentsToDelete) {
    if (studentsToDelete.length === 0) {
      return;
    }

    // Garante que esta na página correta para a limpeza, caso o teste tenha navegado para outro lugar.
    if (!page.url().includes('/alunos')) {
      await page.goto('/alunos');
    }
    await page.waitForLoadState('networkidle');

    for (const student of studentsToDelete) {
      try {
        const studentRow = page.locator('tr', { hasText: student.name });
        if (await studentRow.isVisible()) {
          await studentRow.getByRole('button', { name: 'Apagar' }).click();
          await page.waitForLoadState('networkidle'); // Garante que a exclusão foi processada.
        }
      } catch (error) {
        console.log(`Não foi possível apagar o aluno de teste "${student.name}": ${error.message}`);
      }
    }
  }
});