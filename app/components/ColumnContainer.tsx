"use client"

import { SortableContext, useSortable } from "@dnd-kit/sortable";
import BinIcon from "../icons/BinIcon";
import { Card, Column, Id, Task } from "../types"
import { CSS } from "@dnd-kit/utilities"
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";
import { useCard } from "../hooks";


interface Props {
    column: Column;
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void;
    createTask: (columnId: Id, content: string) => void;
    tasks: Card[];
    deleteTask: (id: Id) => void
    updateTask: (id: Id, content: string) => void;
    boardId: Id
}

function ColumnContainer(props: Props) {
    const { column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask, boardId } = props;

    const [editMode, setEditMode] = useState(false);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTask, setNewTask] = useState("");
    const listId = column.id;
    const { cards } = useCard(boardId, listId)

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
            className="bg-container dark:bg-gray-800 opacity-60 border-gray-700 border-2 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
        ></div>
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-container dark:bg-gray-800 border-gray-700 border-2 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col">


            {/* COLUMN TITLE */}
            <div
                {...attributes}
                {...listeners}
                onClick={() => setEditMode(true)}
                className="bg-containerHeader dark:bg-black text-md text-black dark:text-white h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-blue-900 dark:border-black border-b-2 flex items-center justify-between">
                <div className="flex">
                    {!editMode ? (column.title) :
                        (<input
                            className="bg-white text-black focus:border-blue-900 dark:focus:border-rose-500 border rounded outline-none px-2 w-full"
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
                    className="stroke-gray-100 dark:stroke-gray-500 hover:stroke-white hover:bg-gray-800 rounded px-1 py-2"
                ><BinIcon /></button>
            </div>

            {/* COLUMN TASK CONTAINER */}
            <div className="flex  flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto text-gray-900 font-semibold dark:text-white">
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
                                className="flex gap-2 border-2 border-gray-700 bg-card dark:bg-gray-700 dark:text-gray-100 hover:ring-2 hover:ring-gray-800 dark:hover:ring-rose-500 rounded p-2"><PlusIcon />Add a card</button>
                        </div>
                    ) : (
                        <div>
                            <input
                                className="w-full p-2 mb-2 border-2 border-blue-300 rounded-md text-black dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="text"
                                placeholder="Add card value"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)} />
                            <div className="flex gap-4">
                                <button
                                    onClick={() => createNewTask()}
                                    className="flex-1 h-12 cursor-pointer rounded-lg bg-rose-300 dark:bg-blue-500 border-2 border-rose-400 dark:border-blue-600 p-2 text-black dark:text-white hover:bg-rose-200 dark:hover:bg-blue-400">
                                    Add Card
                                </button>

                                <button
                                    className="flex-1 h-12 cursor-pointer rounded-lg bg-gray-800 dark:bg-gray-700 border-2 border-gray-600 p-2 text-white hover:bg-gray-700 dark:hover:bg-gray-600"
                                    onClick={() => cancelCreateTask()}
                                >
                                    Cancel
                                </button>
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

    function cancelCreateTask() {
        setIsAddingTask(false);
        setNewTask("");
    }
}

export default ColumnContainer