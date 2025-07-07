import React from 'react';
import { getMatriculas, deleteMatricula } from '../services/api';
import useApi from '../hooks/useApi';
import MatriculaForm from '../components/MatriculaForm';
import ListPage from '../components/ListPage';
import './MatriculasPage.css';
import '../components/ActionButtons.css';

const MatriculasPage = () => {
  // Define as colunas para a tabela de matrículas
  const matriculaColumns = [
    {
      header: 'Aluno',
      accessor: 'aluno',
      // Renderiza o nome do aluno a partir do objeto aninhado
      render: (matricula) => matricula.aluno.nome,
    },
    {
      header: 'Curso',
      accessor: 'curso',
      // Renderiza o nome do curso a partir do objeto aninhado
      render: (matricula) => matricula.curso.nome,
    },
  ];

  // A página de matrículas agora tem edição e exclusão.
  // A função agora recebe os manipuladores `onEdit` e `onDelete` do ListPage.
  const renderMatriculaActions = (matricula, { onEdit, onDelete }) => {
    return (
      <div className="action-buttons">
        <button
          onClick={() => onEdit(matricula)}
          className="edit-button"
          data-test-id={`edit-button-${matricula.id}`}
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(matricula)}
          className="delete-button"
          data-test-id={`delete-button-${matricula.id}`}
        >Apagar</button>
      </div>
    );
  };

  // Criamos um hook customizado para seguir as Regras dos Hooks do React.
  const useMatriculasApi = () => useApi(getMatriculas);

  // Define como obter o "nome" de uma matrícula para a mensagem de confirmação.
  const getMatriculaName = (matricula) => `a matrícula de ${matricula.aluno.nome} no curso ${matricula.curso.nome}`;

  return (
    <ListPage
      pageTitle="Lista de Matrículas"
      buttonText="Adicionar Nova Matrícula"
      buttonTestId="add-matricula-button"
      useApiHook={useMatriculasApi}
      FormComponent={MatriculaForm}
      tableColumns={matriculaColumns}
      tableClassName="matricula-table"
      renderActions={renderMatriculaActions}
      onDeleteItem={deleteMatricula}
      getItemName={getMatriculaName}
    />
  );
};

export default MatriculasPage;