import React, { useState, useEffect } from 'react';
import { createCurso, updateCurso } from '../services/api';
import './CursoForm.css';

const CursoForm = ({ onSuccess, onCancel, itemToEdit }) => {
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    carga_horaria: '',
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(itemToEdit);

  // Popula o formulário com os dados do item a ser editado
  useEffect(() => {
    if (isEditing) {
      setFormData({
        nome: itemToEdit.nome,
        codigo: itemToEdit.codigo,
        carga_horaria: itemToEdit.carga_horaria,
      });
    }
  }, [itemToEdit, isEditing]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const dataToSend = {
        ...formData,
        carga_horaria: parseInt(formData.carga_horaria, 10),
      };

      if (isEditing) {
        // O backend atualiza pelo CÓDIGO do curso, não pelo ID.
        await updateCurso(itemToEdit.codigo, dataToSend);
      } else {
        await createCurso(dataToSend);
      }

      onSuccess(); // Chama o callback de sucesso (redireciona)
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="curso-form-modal">
      <div className="curso-form-container">
        <form onSubmit={handleSubmit}>
          <h2>{isEditing ? 'Editar Curso' : 'Adicionar Novo Curso'}</h2>
          {error && <p className="form-error">{error}</p>}

          <div className="form-group">
            <label htmlFor="nome">Nome do Curso</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              data-testid="curso-form-nome"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="codigo">Código do Curso</label>
            <input
              type="text"
              id="codigo"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              data-testid="curso-form-codigo"
              // O código não deve ser editável, pois é o identificador na URL de update.
              disabled={isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="carga_horaria">Carga Horária (horas)</label>
            <input
              type="number"
              id="carga_horaria"
              name="carga_horaria"
              value={formData.carga_horaria}
              onChange={handleChange}
              data-testid="curso-form-carga-horaria"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="btn-cancel"
              data-testid="curso-form-cancel-button"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-save"
              data-testid="curso-form-save-button"
            >
              {isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Curso')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CursoForm;