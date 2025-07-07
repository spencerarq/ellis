import React, { useState } from 'react';
import Table from './Table';
import './ListPage.css';

const ListPage = ({
  pageTitle,
  buttonText,
  buttonTestId,
  useApiHook,
  FormComponent,
  tableColumns,
  tableClassName,
  renderActions,
  onDeleteItem,
  getItemName = (item) => item.nome, // Função para obter o nome do item para confirmação
}) => {
  const { data, loading, error, refetch } = useApiHook();
  // O estado agora controla o modo do formulário ('add' ou 'edit') e o item em edição.
  const [formState, setFormState] = useState(null); // { mode: 'add' | 'edit', item: any } | null

  const handleSuccess = () => {
    setFormState(null);
    refetch();
  };

  const handleCancel = () => {
    setFormState(null);
  };

  const handleAddItem = () => {
    setFormState({ mode: 'add', item: null });
  };

  const handleEditItem = (item) => {
    setFormState({ mode: 'edit', item });
  };

  const handleDeleteItem = async (item) => {
    const itemName = getItemName(item);
    if (onDeleteItem && window.confirm(`Tem certeza que deseja apagar "${itemName}"?`)) {
      try {
        await onDeleteItem(item.id);
        refetch();
      } catch (err) {
        alert(`Erro ao apagar: ${err.message}`);
      }
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!data) return <p>Nenhum item encontrado.</p>;

  return (
    <div className="list-page-container">
      <div className="list-header">
        <h2>{pageTitle}</h2>
        <button
          onClick={handleAddItem}
          className="add-button"
          data-test-id={buttonTestId}
        >
          {buttonText}
        </button>
      </div>

      {formState && (
        <FormComponent
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          itemToEdit={formState.mode === 'edit' ? formState.item : null}
        />
      )}

      <Table
        columns={tableColumns}
        data={data}
        // Passa os manipuladores para a função que renderiza os botões de ação
        renderActions={(item) => renderActions(item, { onEdit: handleEditItem, onDelete: handleDeleteItem })}
        tableClassName={tableClassName}
      />
    </div>
  );
};

export default ListPage;