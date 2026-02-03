import React from 'react';
import './Modals.css';

const ConfirmationModal = ({ title, message, onClose, onConfirm, confirmText = 'CONFIRM', isDanger = false }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content pixel-border small-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{'>'} {title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="confirmation-message">{message}</div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>CANCEL</button>
          <button 
            className={isDanger ? 'btn-danger' : 'btn-primary'}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;