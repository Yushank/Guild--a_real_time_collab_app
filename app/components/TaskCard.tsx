"use client"

import React, { useState } from 'react'
import { Card, Id, Task } from '../types'
import BinIcon from '../icons/BinIcon'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
    task: Card;
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, content: string) => void;
}
function TaskCard({ task, deleteTask, updateTask }: Props) {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: "Card",
            task
        },
        disabled: editMode
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    if(isDragging){
        return <div ref={setNodeRef} style={style}
        className='bg-gray-900 opacity-60 border-gray-700 p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl cursor-grab relative'></div>
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className='bg-gray-900 p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative'

            onMouseEnter={() => {
                setMouseIsOver(true)
            }}
            onMouseLeave={() => {
                setMouseIsOver(false)
            }}

            onClick={() => {
                toggleEdit()
            }}
        >{!editMode ? (
            (task.content)
        ) : (<input
            className="bg-black focus:border-rose-500 border rounded outline-none px-2 w-full"
            type='text'
            value={task.content}
            onChange={(e) => updateTask(task.id, e.target.value)}
            autoFocus
            onBlur={() => setEditMode(false)}
            onKeyDown={e => {
                if (e.key !== "Enter") {
                    return
                }
                setEditMode(false);
            }}
        />)}
            {mouseIsOver && (
                <button className='stroke-white absolute right-4 top-1/2-translate-y-1/2 bg-gray-700 p-2 rounded'
                    onClick={() => deleteTask(task.id)}><BinIcon /></button>
            )}
        </div>
    )

    function toggleEdit() {
        setEditMode(true);
        setMouseIsOver(false);
    }
}

export default TaskCard