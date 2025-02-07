"use client"

import { SortableContext, useSortable } from "@dnd-kit/sortable";
import BinIcon from "../icons/BinIcon";
import { Column, Id, Task } from "../types"
import { CSS } from "@dnd-kit/utilities"
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";


interface Props {
    column: Column;
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void;
    createTask: (columnId: Id, content: string) => void;
    tasks: Task[];
    deleteTask: (id: Id) => void
    updateTask: (id: Id, content: string) => void;
}

function ColumnContainer(props: Props) {
    const { column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask } = props;

    const [editMode, setEditMode] = useState(false);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTask, setNewTask] = useState("");

    const tasksId = useMemo(() => {
        return tasks.map((task) => task.id)
    }, [tasks]);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    if (isDragging) {
        return <div ref={setNodeRef} style={style}
            className="bg-gray-800 opacity-60 border-gray-700 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
        ></div>
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-gray-800 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col">


            {/* COLUMN TITLE */}
            <div
                {...attributes}
                {...listeners}
                onClick={() => setEditMode(true)}
                className="bg-black text-md text-white h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-black border-4 flex items-center justify-between">
                <div className="flex">
                    {!editMode ? (column.title) :
                        (<input
                            className="bg-black focus:border-rose-500 border rounded outline-none px-2 w-full"
                            value={column.title}
                            onChange={(e) => updateColumn(column.id, e.target.value)}
                            autoFocus
                            onBlur={() => setEditMode(false)}
                            onKeyDown={e => {
                                if (e.key !== "Enter") {
                                    return;
                                }
                                setEditMode(false)
                            }} />)}
                </div>

                {/* DELETE BUTTON */}
                <button
                    onClick={() => {
                        deleteColumn(column.id)
                    }}
                    className="stroke-gray-500 hover:stroke-white hover:bg-gray-800 rounded px-1 py-2"
                ><BinIcon /></button>
            </div>

            {/* COLUMN TASK CONTAINER */}
            <div className="flex  flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto text-white">
                <div>
                    <div>
                        <SortableContext items={tasksId}>
                            {tasks.map(task => (
                                <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask}></TaskCard>
                            ))}
                        </SortableContext>
                    </div>
                    {!isAddingTask ? (
                        <div className="pt-2">
                            <button onClick={() => setIsAddingTask(true)}
                                className="flex gap-2 pt-2 bg-gray-800 hover:ring-2 hover:ring-rose-500 rounded"><PlusIcon />Add a card</button>
                        </div>
                    ) : (
                        <div>
                            <input
                                className="bg-gray-700"
                                type="text"
                                placeholder="Add card value"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)} />
                            <div className="bg-blue-500">
                                <button onClick={() => createNewTask()}>Add Card</button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )

    function createNewTask() {
        createTask(column.id, newTask);
        setIsAddingTask(false);
        setNewTask("")
    }
}

export default ColumnContainer