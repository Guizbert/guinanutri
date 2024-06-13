import React, { useState } from 'react';
import Column from './Columns/Column';
import { FaTrash } from "react-icons/fa";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Input from './Input/Input';
import { Alert, Button } from 'flowbite-react';
import { v4 as uuidv4 } from 'uuid';

export default function FormBuilder({ onUpdateForm, title }) {
  const [formElements, setFormElements] = useState([
    { id: uuidv4(), inputType: 'textarea', label: 'Donner son avis sur le module:' },
    { id: uuidv4(), inputType: 'button', label: 'Envoyer le formulaire' }
  ]);

  const [showTrash, setShowTrash] = useState(false);
  const [showMessage, setMessage] = useState(false);
  const [trash] = useState([{ id: "trash" }]);

  const addElement = (formElement) => {
    setFormElements((prevFormElements) => [
      ...prevFormElements,
      {
        id: uuidv4(),
        inputType: formElement.inputType,
        label: formElement.label,
        max: formElement.max || null,
        droplist: formElement.droplist || []
      }
    ]);
  };

  const handleDragEnd = (e) => {
    const { active, over } = e;
    setShowTrash(false);
    if (!over) return;

    if (over.id === 'trash') {
      setFormElements(formElements.filter(elem => elem.id !== active.id));
    } else {
      if (active.id === over.id) return;

      setFormElements((elem) => {
        const originalPos = formElements.findIndex(el => el.id === active.id);
        const newPos = formElements.findIndex(el => el.id === over.id);
        return arrayMove(formElements, originalPos, newPos);
      });
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleSubmit = () => {
    if(formElements.length === 0){
      console.log("no element...");
      setMessage(true);
      onUpdateForm(formElements);
    } else {
      setMessage(false);
      onUpdateForm(formElements);
    }
  };

  const showTrashCol = () => {
    setShowTrash(true);
  };

  return (
    <div className="flex flex-col items-center justify-center  dark:bg-gray-700 bg-gray-200">
      <h1 className="text-2xl font-bold mb-4">Form Builder</h1>
      <Input onAddElement={addElement} className="mb-4" />
      <DndContext
        sensors={sensors}
        onDragMove={showTrashCol}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <Column elements={formElements} className="mb-4" />
        {showTrash && (
          <Column elements={trash} />
        )}
      </DndContext>
      {showMessage && (
        <Alert className="w-40 mb-4" color="failure">Il faut un élément.</Alert>
      )}
      <Button color="warning" onClick={handleSubmit}>
        Mettre à jour les éléments pour le module : {title}
      </Button>
    </div>
  );
}
