import React from 'react';
import { useDrag } from 'react-dnd';

export default function InputField({ type, id, name, label, errors }) {

    
  
    return (
      <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <label htmlFor={id}>{label}</label>
        <input
          type={type}
          id={id}
          name={name}
        />
        {errors && errors[name] && <span>{errors[name].message}</span>}
      </div>
    );
  }
  