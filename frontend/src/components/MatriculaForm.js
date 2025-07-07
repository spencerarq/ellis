import React, { useState, useEffect } from 'react';
import { createMatricula, updateMatricula, getAlunos, getCursos } from '../services/api';
import './MatriculaForm.css';

const MatriculaForm = ({ onSuccess, onCancel, itemToEdit }) => {
  const [alunoId, setAlunoId] = useState('');
  const [cursoId, setCursoId] = useState('');
  
  const [alunos, setAlunos] = useState([]);
  const [cursos, setCursos] = useState([]);

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(itemToEdit);

  // Popula o formulário com os dados do item a ser editado
  useEffect(() => {
    if (isEditing && itemToEdit) {
      // O itemToEdit tem a estrutura { id, aluno: { id, nome }, curso: { id, nome } }
      setAlunoId(itemToEdit.aluno.id);
      setCursoId(itemToEdit.curso.id);
    }
  }, [itemToEdit, isEditing]);

  // Busca alunos e cursos na montagem do componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const alunosData = await getAlunos();
        const cursosData = await getCursos();
        setAlunos(alunosData);
        setCursos(cursosData);
      } catch (err) {
        setError('Falha ao carregar alunos e cursos.');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!alunoId || !cursoId) {
      setError('Por favor, selecione um aluno e um curso.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const matriculaData = {
        aluno_id: parseInt(alunoId, 10),
        curso_id: parseInt(cursoId, 10),
      };

      if (isEditing) {
        await updateMatricula(itemToEdit.id, matriculaData);
      } else {
        await createMatricula(matriculaData);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || 'Ocorreu um erro. Verifique se o aluno já não está matriculado neste curso.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="matricula-form-modal">
      <div className="matricula-form-container">
        <form onSubmit={handleSubmit}>
          <h2>{isEditing ? 'Editar Matrícula' : 'Nova Matrícula'}</h2>
          {error && <p className="form-error">{error}</p>}
          
          <div className="form-group">
            <label htmlFor="alunoId">Aluno</label>
            <select id="alunoId" name="alunoId" value={alunoId} onChange={(e) => setAlunoId(e.target.value)} required>
              <option value="">Selecione um aluno</option>
              {alunos.map((aluno) => (
                <option key={aluno.id} value={aluno.id}>
                  {aluno.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cursoId">Curso</label>
            <select id="cursoId" name="cursoId" value={cursoId} onChange={(e) => setCursoId(e.target.value)} required>
              <option value="">Selecione um curso</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} disabled={isSubmitting} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-save">
              {isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Matricular Aluno')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MatriculaForm;