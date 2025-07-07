import React, { useState, useEffect } from 'react';
import { createAluno, updateAluno } from '../services/api';
import './AlunoForm.css';

const AlunoForm = ({ onSuccess, onCancel, itemToEdit }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(itemToEdit);

  // Popula o formulário com os dados do item a ser editado
  useEffect(() => {
    if (isEditing) {
      setFormData({
        nome: itemToEdit.nome,
        email: itemToEdit.email,
        telefone: itemToEdit.telefone,
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
      if (isEditing) {
        await updateAluno(itemToEdit.id, formData);
      } else {
        await createAluno(formData);
      }
      onSuccess(); // Chama o callback de sucesso (refetch e fecha o form)
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="aluno-form-modal">
      <div className="aluno-form-container">
        <form onSubmit={handleSubmit}>
          <h2>{isEditing ? 'Editar Aluno' : 'Adicionar Novo Aluno'}</h2>
          {error && <p className="form-error">{error}</p>}
          
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              data-testid="aluno-form-nome"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              data-testid="aluno-form-email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefone">Telefone</label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              data-testid="aluno-form-telefone"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="btn-cancel"
              data-testid="aluno-form-cancel-button"
            >
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-save" data-testid="aluno-form-save-button">
              {isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Aluno')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlunoForm;