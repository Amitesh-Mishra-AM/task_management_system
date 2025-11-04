import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  // Calculate page numbers to show
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (currentPage <= 3) {
    endPage = Math.min(5, totalPages);
  }

  if (currentPage >= totalPages - 2) {
    startPage = Math.max(1, totalPages - 4);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn btn-sm"
      >
        &larr; Previous
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`btn btn-sm ${1 === currentPage ? 'active' : ''}`}
          >
            1
          </button>
          {startPage > 2 && <span className="pagination-ellipsis">...</span>}
        </>
      )}

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`btn btn-sm ${page === currentPage ? 'active' : ''}`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`btn btn-sm ${totalPages === currentPage ? 'active' : ''}`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn btn-sm"
      >
        Next &rarr;
      </button>
    </div>
  );
};

export default Pagination;