import React from 'react';
import { getAlunos, deleteAluno } from '../services/api';
import useApi from '../hooks/useApi';
import AlunoForm from '../components/AlunoForm';
import ListPage from '../components/ListPage';
import './AlunosPage.css';
import '../components/ActionButtons.css';

const AlunosPage = () => {
  const alunoColumns = [
    { header: 'Nome', accessor: 'nome' },
    { header: 'Email', accessor: 'email' },
    { header: 'Telefone', accessor: 'telefone' },
  ];

  // A função agora recebe os manipuladores 'onEdit' e 'onDelete' do ListPage
  const renderAlunoActions = (aluno, { onEdit, onDelete }) => {
    return (
      <div className="action-buttons">
        <button
          onClick={() => onEdit(aluno)}
          className="edit-button"
          data-test-id={`edit-button-${aluno.id}`}
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(aluno)}
          className="delete-button"
          data-test-id={`delete-button-${aluno.id}`}
        >
          Apagar
        </button>
      </div>
    );
  };

  // Criamos um hook customizado que encapsula a chamada ao useApi com a função específica.
  // Isso segue as Regras dos Hooks do React, pois useApi é chamado no nível superior.
  const useAlunosApi = () => useApi(getAlunos);

  return (
    <ListPage
      pageTitle="Lista de Alunos"
      buttonText="Adicionar Novo Aluno"
      buttonTestId="add-aluno-button"
      useApiHook={useAlunosApi}
      FormComponent={AlunoForm}
      tableColumns={alunoColumns}
      tableClassName="aluno-table"
      renderActions={renderAlunoActions}
      onDeleteItem={deleteAluno}
    />
  );
};

export default AlunosPage;