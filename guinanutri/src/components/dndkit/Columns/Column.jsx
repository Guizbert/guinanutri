import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Task from '../Task/Task';

export default function Column({ elements }) {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <SortableContext items={elements.map(el => el.id)} strategy={verticalListSortingStrategy}>
        {elements.map((element) => (
          <Task
            key={element.id}
            id={element.id}
            inputType={element.inputType}
            label={element.label}
            droplist={element.droplist}
          />
        ))}
      </SortableContext>
    </div>
  );
}
