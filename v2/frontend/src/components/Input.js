// frontend/src/components/Input.js

import React from 'react';

function Input({ label, ...props }) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input className="input-field" {...props} />
    </div>
  );
}

export default Input;
