-- Popula a tabela de cursos com 5 exemplos
INSERT INTO cursos (nome, codigo, carga_horaria) VALUES
('Engenharia de Software', 'ES-01', 360),
('Ciência de Dados', 'CD-02', 240),
('Desenvolvimento Web Full Stack', 'DWFS-03', 400),
('Segurança da Informação', 'SI-04', 300),
('Inteligência Artificial e Machine Learning', 'IAML-05', 450)
ON CONFLICT (codigo) DO NOTHING; -- Evita erro se o curso já existir

-- Popula a tabela de alunos com 10 exemplos
INSERT INTO alunos (nome, email, telefone) VALUES
('Ana Silva', 'ana.silva@example.com', '11911111111'),
('Bruno Costa', 'bruno.costa@example.com', '11922222222'),
('Carla Dias', 'carla.dias@example.com', '11933333333'),
('Daniel Martins', 'daniel.martins@example.com', '11944444444'),
('Eduarda Ferreira', 'eduarda.ferreira@example.com', '11955555555'),
('Felipe Almeida', 'felipe.almeida@example.com', '11966666666'),
('Gabriela Lima', 'gabriela.lima@example.com', '11977777777'),
('Heitor Souza', 'heitor.souza@example.com', '11988888888'),
('Isabela Pereira', 'isabela.pereira@example.com', '11999999999'),
('João Oliveira', 'joao.oliveira@example.com', '11900000000')
ON CONFLICT (email) DO NOTHING; -- Evita erro se o aluno já existir

-- Popula a tabela de matrículas com alguns exemplos
INSERT INTO matriculas (aluno_id, curso_id) VALUES
(1, 1), (1, 2), -- Ana Silva em Engenharia de Software e Ciência de Dados
(2, 3)        -- Bruno Costa em Desenvolvimento Web Full Stack
ON CONFLICT (aluno_id, curso_id) DO NOTHING; -- Evita erro se a matrícula já existir