import React from 'react';
import { useDrop } from 'react-dnd';
import { useDrag } from 'react-dnd';
import { useForm } from 'react-hook-form';
import InputField from './InputField';
import * as yup from 'yup';

export default function ExampleForm() {
  const [formElements, setFormElements] = React.useState([
    { id: 1, type: 'input', inputType: 'text', label: 'First Name:', ref: null, name: 'firstName', validation: yup.string().required('First name is required') },
    { id: 2, type: 'input', inputType: 'number', label: 'Age:', ref: null, name: 'age', validation: yup.number().required('Age is required') },
    { id: 3, type: 'input', inputType: 'date', label: 'Date of Birth:', ref: null, name: 'dob', validation: yup.date().required('Date of birth is required') },
    { id: 4, type: 'button', label: 'Submit', ref: null }
  ]);

  


  return (
    <form onSubmit={handleSubmit(onSubmit)} ref={drop}>
      {formElements.map((element, index) => (
        element && (
          <div key={element.id} ref={element.ref}>
            {element.type === 'input' && (
              <div ref={drop}>
                <InputField
                  type={element.inputType}
                  id={`input-${index}`}
                  name={element.name}
                  label={element.label}
                  errors={errors}
                />
              </div>
            )}
            {element.type === 'button' && (
              <div>
                <button type="submit">{element.label}</button>
              </div>
            )}
          </div>
        )
      ))}
    </form>
  );
}

