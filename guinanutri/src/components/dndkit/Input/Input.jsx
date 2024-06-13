import React, { useState } from 'react';
import { Alert, Button } from 'flowbite-react';

export default function Input({ onAddElement }) {
  const [label, setLabel] = useState("");
  const [inputType, setInputType] = useState("text");
  const [showRangeMaxInput, setShowRangeMaxInput] = useState(false);
  const [rangeMax, setRangeMax] = useState("");
  const [droplistItems, setDroplistItems] = useState([]);
  const [newDroplistItem, setNewDroplistItem] = useState("");
  const [labelError, setLabelError] = useState(false);

  const handleInputTypeChange = e => {
    setInputType(e.target.value);
    if (e.target.value === "range") {
      setShowRangeMaxInput(true);
    } else {
      setShowRangeMaxInput(false);
      if (rangeMax > 0)
        setRangeMax("");
    }
  };

  const handleAddDroplistItem = () => {
    if (newDroplistItem) {
      setDroplistItems([...droplistItems, newDroplistItem]);
      setNewDroplistItem("");
    }
  };

  const handleRemoveDroplistItem = (index) => {
    setDroplistItems(droplistItems.filter((_, i) => i !== index));
  };

  const handleClearDroplist = () => {
    setDroplistItems([]);
  };

  const handleSubmit = () => {
    if (!label) {
      setLabelError(true);
      return;
    }
    let newElem = {
      inputType: inputType,
      label: label,
      max: rangeMax,
      droplist: droplistItems
    };
    onAddElement(newElem);
    setLabel("");
    setRangeMax("");
    setDroplistItems([]);
    setLabelError(false);
  };

  return (
    <div className=''>
      <input 
        placeholder='label' 
        className={`text-black mb-4 p-2 border rounded ${labelError ? 'border-red-500' : ''}`} 
        type='text' 
        value={label} 
        onChange={e => {
          setLabel(e.target.value);
          if (e.target.value) {
            setLabelError(false);
          }
        }}
      />
      {labelError && (
        <p className='text-red-500 mb-4'>Label is required</p>
      )}
      <select 
        className='text-black mb-4 p-2 border rounded' 
        value={inputType} 
        onChange={handleInputTypeChange}
      >
        <option value="text">Text</option>
        <option value="textarea">Textarea</option>
        <option value="range">Range (min 0 max 5)</option>
        <option value="button">Button</option>
        <option value="droplist">Droplist</option>
      </select>

      {inputType === "droplist" && (
        <div className='mb-4'>
          <div className='flex'>
            <input 
              placeholder='New droplist item' 
              className='text-black mb-2 p-2 border rounded flex-grow' 
              type='text' 
              value={newDroplistItem} 
              onChange={e => setNewDroplistItem(e.target.value)}
            />
            <Button 
              pill 
              color='success' 
              className='mb-2 ml-2'
              onClick={handleAddDroplistItem}
            >
              Ajout DropList élem
            </Button>
          </div>
          <ul className='border border-gray-400 shadow-lg dark:bg-gray-600 bg-gray-300 mt-2 p-2 rounded'>
            {droplistItems.map((item, index) => (
              <li key={index} className='flex justify-between items-center'>
                {item}
                <Button
                  pill
                  color='danger'
                  size='xs'
                  onClick={() => handleRemoveDroplistItem(index)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
          {droplistItems.length > 0 && (
            <Button 
              pill 
              color='danger' 
              className='mt-2'
              onClick={handleClearDroplist}
            >
              Clear Droplist
            </Button>
          )}
        </div>
      )}
      
      <Button 
        pill
        onClick={handleSubmit}
        disabled={!label}
      >
        Ajouter l'élément
      </Button>
    </div>
  );
}
