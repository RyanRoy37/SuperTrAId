import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisible = 5;

  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button 
        className="btn" 
        onClick={() => onPageChange(1)} 
        disabled={currentPage === 1}
      >
        &#171;
      </button>
      <button 
        className="btn" 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        &#8249;
      </button>
      {pages.map(page => (
        <button
          key={page}
          className={`btn ${page === currentPage ? 'btn-secondary' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button 
        className="btn" 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        &#8250;
      </button>
      <button 
        className="btn" 
        onClick={() => onPageChange(totalPages)} 
        disabled={currentPage === totalPages}
      >
        &#187;
      </button>
    </div>
  );
};

export default Pagination;