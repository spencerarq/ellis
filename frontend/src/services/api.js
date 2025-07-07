import axios from 'axios';

// Define a URL base da sua API FastAPI.
// Usar uma variável de ambiente para isso em produção é uma boa prática.
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

// Cria uma instância do axios com a configuração base.
// Isso permite compartilhar configurações (como headers) entre todas as chamadas.
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Funções para Alunos ---

/**
 * Busca a lista de todos os alunos.
 * @returns {Promise<Array>} Uma promessa que resolve para um array de alunos.
 */
export const getAlunos = async () => {
  try {
    const response = await apiClient.get('/alunos');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    throw new Error('Não foi possível buscar os dados dos alunos.');
  }
};

/**
 * Cria um novo aluno.
 * @param {Object} alunoData - Os dados do aluno a ser criado (nome, email, telefone).
 * @returns {Promise<Object>} Uma promessa que resolve para o objeto do aluno criado.
 */
export const createAluno = async (alunoData) => {
  try {
    const response = await apiClient.post('/alunos', alunoData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar aluno:', error.response?.data || error.message);
    const apiError = error.response?.data?.detail || 'Não foi possível criar o aluno. Verifique os dados e tente novamente.';
    throw new Error(apiError);
  }
};

/**
 * Atualiza um aluno existente.
 * @param {number|string} id - O ID do aluno a ser atualizado.
 * @param {Object} alunoData - Os dados do aluno a serem atualizados.
 * @returns {Promise<Object>} Uma promessa que resolve para o objeto do aluno atualizado.
 */
export const updateAluno = async (id, alunoData) => {
  try {
    const response = await apiClient.put(`/alunos/${id}`, alunoData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar aluno ${id}:`, error.response?.data || error.message);
    const apiError = error.response?.data?.detail || 'Não foi possível atualizar o aluno.';
    throw new Error(apiError);
  }
};

/**
 * Apaga um aluno.
 * @param {number|string} id - O ID do aluno a ser apagado.
 * @returns {Promise<Object>} Uma promessa que resolve com os dados da resposta (pode ser um objeto de sucesso).
 */
export const deleteAluno = async (id) => {
  try {
    const response = await apiClient.delete(`/alunos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao apagar aluno ${id}:`, error.response?.data || error.message);
    const apiError = error.response?.data?.detail || 'Não foi possível apagar o aluno.';
    throw new Error(apiError);
  }
};

// --- Funções para Cursos ---

/**
 * Busca a lista de todos os cursos.
 * @returns {Promise<Array>} Uma promessa que resolve para um array de cursos.
 */
export const getCursos = async () => {
  try {
    const response = await apiClient.get('/cursos');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    throw new Error('Não foi possível buscar os dados dos cursos.');
  }
};

/**
 * Cria um novo curso.
 * @param {Object} cursoData - Os dados do curso a ser criado (nome, codigo, carga_horaria).
 * @returns {Promise<Object>} Uma promessa que resolve para o objeto do curso criado.
 */
export const createCurso = async (cursoData) => {
  try {
    const response = await apiClient.post('/cursos', cursoData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar curso:', error.response?.data || error.message);
    const apiError = error.response?.data?.detail || 'Não foi possível criar o curso. Verifique os dados e tente novamente.';
    throw new Error(apiError);
  }
};

/**
 * Atualiza um curso existente.
 * @param {string} codigo - O CÓDIGO do curso a ser atualizado.
 * @param {Object} cursoData - Os dados do curso a serem atualizados.
 * @returns {Promise<Object>} Uma promessa que resolve para o objeto do curso atualizado.
 */
export const updateCurso = async (codigo, cursoData) => {
  try {
    // O backend espera o CÓDIGO do curso na URL, não o ID.
    const response = await apiClient.put(`/cursos/${codigo}`, cursoData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar curso ${codigo}:`, error.response?.data || error.message);
    const apiError = error.response?.data?.detail || 'Não foi possível atualizar o curso.';
    throw new Error(apiError);
  }
};

/**
 * Apaga um curso.
 * @param {number|string} id - O ID do curso a ser apagado.
 * @returns {Promise<Object>} Uma promessa que resolve com os dados da resposta.
 */
export const deleteCurso = async (id) => {
  try {
    const response = await apiClient.delete(`/cursos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao apagar curso ${id}:`, error.response?.data || error.message);
    const apiError = error.response?.data?.detail || 'Não foi possível apagar o curso.';
    throw new Error(apiError);
  }
};

// --- Funções para Matrículas ---

/**
 * Busca a lista de todas as matrículas.
 * @returns {Promise<Array>} Uma promessa que resolve para um array de matrículas.
 */
export const getMatriculas = async () => {
  try {
    const response = await apiClient.get('/matriculas');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar matrículas:', error);
    throw new Error('Não foi possível buscar os dados das matrículas.');
  }
};

/**
 * Cria uma nova matrícula.
 * @param {Object} matriculaData - Os dados da matrícula (aluno_id, curso_id).
 * @returns {Promise<Object>} Uma promessa que resolve para o objeto da matrícula criada.
 */
export const createMatricula = async (matriculaData) => {
  try {
    const response = await apiClient.post('/matriculas', matriculaData);
    return response.data;
  } catch (error) {
    // O backend pode retornar um erro específico se a matrícula já existir.
    // Ex: "Aluno já matriculado neste curso"
    console.error('Erro ao criar matrícula:', error.response?.data || error.message);
    const apiError = error.response?.data?.detail || 'Não foi possível criar a matrícula.';
    throw new Error(apiError);
  }
};

/**
 * Atualiza uma matrícula existente.
 * @param {number|string} id - O ID da matrícula a ser atualizada.
 * @param {Object} matriculaData - Os dados da matrícula (aluno_id, curso_id).
 * @returns {Promise<Object>} Uma promessa que resolve para o objeto da matrícula atualizada.
 */
export const updateMatricula = async (id, matriculaData) => {
  try {
    const response = await apiClient.put(`/matriculas/${id}`, matriculaData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar matrícula ${id}:`, error.response?.data || error.message);
    const apiError = error.response?.data?.detail || 'Não foi possível atualizar a matrícula.';
    throw new Error(apiError);
  }
};

/**
 * Apaga uma matrícula.
 * @param {number|string} id - O ID da matrícula a ser apagada.
 * @returns {Promise<Object>} Uma promessa que resolve com os dados da resposta.
 */
export const deleteMatricula = async (id) => {
  try {
    // Note que a rota para deletar uma matrícula pode variar.
    // Ex: /matriculas/{id} ou /alunos/{aluno_id}/matriculas/{curso_id}
    // Ajuste conforme a sua API.
    const response = await apiClient.delete(`/matriculas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao apagar matrícula ${id}:`, error.response?.data || error.message);
    const apiError = error.response?.data?.detail || 'Não foi possível apagar a matrícula.';
    throw new Error(apiError);
  }
};
