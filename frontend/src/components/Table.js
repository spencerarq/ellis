import React from 'react';
import './Table.css';

const Table = ({ columns, data, renderActions, tableClassName }) => {
  return (
    <table className={`generic-table ${tableClassName || ''}`}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.accessor}>{col.header}</th>
          ))}
          {renderActions && <th>Ações</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            {columns.map((col) => (
              <td key={col.accessor}>
                {col.render ? col.render(item) : item[col.accessor]}
              </td>
            ))}
            {renderActions && (
              <td className="actions-cell">{renderActions(item)}</td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;