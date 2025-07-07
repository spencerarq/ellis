import { test, expect } from '@playwright/test';

test.describe('Gerenciamento de Matrículas com Dados Dinâmicos', () => {
  // Variáveis para armazenar os dados gerados dinamicamente
  let alunoRandomico;
  let cursoRandomico1;
  let cursoRandomico2;

  // SETUP 
  test.beforeEach(async ({ page }) => {
    // Gera um ID único para garantir que os dados sejam sempre novos a cada execução
    const randomId = `_${Date.now()}`;

    // Define os dados únicos para esta execução de teste
    alunoRandomico = {
      nome: `Aluno Random ${randomId}`,
      email: `aluno.random.${randomId}@teste.com`,
      telefone: '123456789',
    };
    cursoRandomico1 = {
      nome: `Curso Random 1 ${randomId}`,
      codigo: `CR1${randomId}`,
      carga_horaria: '100',
    };
    cursoRandomico2 = {
      nome: `Curso Random 2 ${randomId}`,
      codigo: `CR2${randomId}`,
      carga_horaria: '120',
    };

    page.on('dialog', dialog => dialog.accept());

    // CRIAÇÃO DO ALUNO PELA UI
    await page.goto('/alunos');
    await page.getByTestId('add-aluno-button').click();
    await page.getByTestId('aluno-form-nome').fill(alunoRandomico.nome);
    await page.getByTestId('aluno-form-email').fill(alunoRandomico.email);
    await page.getByTestId('aluno-form-telefone').fill(alunoRandomico.telefone);
    await page.getByTestId('aluno-form-save-button').click();
    // Confirma que o aluno foi criado antes de prosseguir
    await expect(page.locator('tr', { hasText: alunoRandomico.nome })).toBeVisible();

    // CRIAÇÃO DOS CURSOS PELA UI
    await page.goto('/cursos');
    // Criação do Curso 1
    await page.getByTestId('add-curso-button').click();
    await page.getByTestId('curso-form-nome').fill(cursoRandomico1.nome);
    await page.getByTestId('curso-form-codigo').fill(cursoRandomico1.codigo);
    await page.getByTestId('curso-form-carga-horaria').fill(cursoRandomico1.carga_horaria);
    await page.getByTestId('curso-form-save-button').click();
    await expect(page.locator('tr', { hasText: cursoRandomico1.nome })).toBeVisible();
    // Criação do Curso 2
    await page.getByTestId('add-curso-button').click();
    await page.getByTestId('curso-form-nome').fill(cursoRandomico2.nome);
    await page.getByTestId('curso-form-codigo').fill(cursoRandomico2.codigo);
    await page.getByTestId('curso-form-carga-horaria').fill(cursoRandomico2.carga_horaria);
    await page.getByTestId('curso-form-save-button').click();
    await expect(page.locator('tr', { hasText: cursoRandomico2.nome })).toBeVisible();
  });

  // EXECUÇÃO DO TESTE
  test('deve criar, editar e apagar uma matrícula usando dados criados dinamicamente', async ({ page }) => {
    // Navega para a página de matrículas
    await page.goto('/matriculas');
    await expect(page.getByRole('heading', { name: 'Lista de Matrículas' })).toBeVisible();

    // CRIAR MATRÍCULA 
    await page.getByTestId('add-matricula-button').click();
    await page.locator('#alunoId').selectOption({ label: alunoRandomico.nome });
    await page.locator('#cursoId').selectOption({ label: cursoRandomico1.nome });
    await page.getByRole('button', { name: 'Matricular Aluno' }).click();

    // VERIFICAR CRIAÇÃO
    const matriculaRow = page.locator('tr', { hasText: alunoRandomico.nome });
    await expect(matriculaRow).toBeVisible();
    await expect(matriculaRow.getByRole('cell', { name: cursoRandomico1.nome })).toBeVisible();

    // EDITAR MATRÍCULA
    await matriculaRow.getByTestId(/edit-button-/).click();
    await page.locator('#cursoId').selectOption({ label: cursoRandomico2.nome });
    await page.getByRole('button', { name: 'Salvar Alterações' }).click();

    // VERIFICAR EDIÇÃO
    await expect(matriculaRow.getByRole('cell', { name: cursoRandomico2.nome })).toBeVisible();
    await expect(matriculaRow.getByRole('cell', { name: cursoRandomico1.nome })).not.toBeVisible();

    // APAGAR MATRÍCULA
    await matriculaRow.getByTestId(/delete-button-/).click();
    
    // VERIFICAR EXCLUSÃO
    await expect(matriculaRow).not.toBeVisible();
  });

  // TEARDOWN
  test.afterEach(async ({ page }) => {
    // APAGAR ALUNO CRIADO
    await page.goto('/alunos');
    const alunoRow = page.locator('tr', { hasText: alunoRandomico.nome });
    await alunoRow.getByTestId(/delete-button-/).click();
    await expect(alunoRow).not.toBeVisible();

    // APAGAR CURSOS CRIADOS
    await page.goto('/cursos');
    // Apaga Curso 1
    const curso1Row = page.locator('tr', { hasText: cursoRandomico1.nome });
    await curso1Row.getByTestId(/delete-button-/).click();
    await expect(curso1Row).not.toBeVisible();
    // Apaga Curso 2
    const curso2Row = page.locator('tr', { hasText: cursoRandomico2.nome });
    await curso2Row.getByTestId(/delete-button-/).click();
    await expect(curso2Row).not.toBeVisible();
  });
});