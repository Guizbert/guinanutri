import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities";
import { FaTrash } from "react-icons/fa";
import { TextInput, Radio, RangeSlider, Checkbox, Select, Textarea } from 'flowbite-react';

export default function Task({ id, inputType, label, droplist = [] }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} className="dark:bg-gray-800 p-2 flex items-center justify-between w-1/2" style={style}>
      <div className="flex-grow">
        {inputType === 'text' && (
          <>
            <label htmlFor={id} className="block text-sm font-bold mb-2">{label}</label>
            <TextInput
              id={id}
              type={inputType}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </>
        )}
        {inputType === 'radio' && (
          <>
            <label htmlFor={id} className="block text-sm font-bold mb-2">{label}</label>
            <Radio
              id={id}
              name={label}
              className="text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </>
        )}
        {inputType === 'range' && (
          <>
            <label htmlFor={id} className="block text-sm font-bold mb-2">{label}</label>
            <RangeSlider
              id={id}
              min="1"
              max="5"
              className="text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </>
        )}
        {inputType === 'checkbox' && (
          <>
            <label htmlFor={id} className="block text-sm font-bold mb-2">{label}</label>
            <Checkbox 
              id={id}
              className=''
            />
          </>
        )}
        {inputType === 'droplist' && (
          <>
            <label htmlFor={id} className="block text-sm font-bold mb-2">{label}</label>
            <Select
              id={id}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {droplist.map((item, i) => (
                <option key={i} value={item}>{item}</option>
              ))}
            </Select>
          </>
        )}
        {inputType === 'button' && (
          <>
            <button id={id} disabled className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              {label}
            </button>
          </>
        )}
        {inputType === 'textarea' && (
          <>
            <label htmlFor={id} className="block text-sm font-bold mb-2">{label}</label>
            <Textarea
              id={id}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </>
        )}
        {id === 'trash' && (
          <>
            <div className="bg-red-800 p-4 rounded">
              <label htmlFor={id} className="block text-sm font-bold mb-2">Drop here to delete:</label>
              <FaTrash 
                className="text-red-500 text-6xl transition-colors duration-500 ease-in-out hover:scale-110 hover:text-red-800 delay-110" 
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
