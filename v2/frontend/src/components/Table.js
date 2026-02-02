// frontend/src/components/Table.js
// Retro • High-Contrast • FinTech Table

import React from 'react';

function Table({ columns, data }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="muted">
              No data available
            </td>
          </tr>
        ) : (
          data.map((row, i) => (
            <tr key={i}>
              {columns.map(col => (
                <td key={col}>{row[col]}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default Table;
