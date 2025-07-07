import React from 'react';
import { getCursos, deleteCurso } from '../services/api';
import useApi from '../hooks/useApi';
import CursoForm from '../components/CursoForm';
import ListPage from '../components/ListPage';
import './CursosPage.css';
import '../components/ActionButtons.css';

const CursosPage = () => {
  const cursoColumns = [
    { header: 'Nome', accessor: 'nome' },
    { header: 'Código', accessor: 'codigo' },
    {
      header: 'Carga Horária',
      accessor: 'carga_horaria',
      render: (curso) => `${curso.carga_horaria}h`,
    },
  ];

  const renderCursoActions = (curso, { onEdit, onDelete }) => {
    return (
      <div className="action-buttons">
        <button
          onClick={() => onEdit(curso)}
          className="edit-button"
          data-test-id={`edit-button-${curso.id}`}
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(curso)}
          className="delete-button"
          data-test-id={`delete-button-${curso.id}`}
        >
          Apagar
        </button>
      </div>
    );
  };

  // Criamos um hook customizado que encapsula a chamada ao useApi com a função específica.
  const useCursosApi = () => useApi(getCursos);

  return (
    <ListPage
      pageTitle="Lista de Cursos"
      buttonText="Adicionar Novo Curso"
      buttonTestId="add-curso-button"
      useApiHook={useCursosApi}
      FormComponent={CursoForm}
      tableColumns={cursoColumns}
      tableClassName="curso-table"
      renderActions={renderCursoActions}
      onDeleteItem={deleteCurso}
    />
  );
};

export default CursosPage;