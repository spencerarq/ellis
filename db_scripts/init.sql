-- Cria a tabela de alunos
-- A estrutura corresponde aos campos do AlunoForm.js
CREATE TABLE IF NOT EXISTS alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20)
);

-- Cria a tabela de cursos
-- A estrutura corresponde aos campos do CursoForm.js
CREATE TABLE IF NOT EXISTS cursos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    carga_horaria INTEGER NOT NULL
);

-- Cria a tabela de matrículas, que relaciona alunos e cursos
CREATE TABLE IF NOT EXISTS matriculas (
    id SERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL,
    curso_id INTEGER NOT NULL,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
    UNIQUE (aluno_id, curso_id) -- Garante que um aluno não pode se matricular no mesmo curso duas vezes
);