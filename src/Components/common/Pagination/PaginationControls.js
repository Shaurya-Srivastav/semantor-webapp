import React from 'react';
import './PaginationControls.css'; 

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination-controls">
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </button>
      
      <span className="pagination-current-page">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
