"use client"

import { use, useMemo, useState } from "react"
import PlusIcon from "../icons/PlusIcon"
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext } from "@dnd-kit/sortable"
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";


function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState("");
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);

    const [tasks, setTasks] = useState<Task[]>([]);

    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3, //3px
            }
        })
    )

    console.log(columns);
    return (
        <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
            <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} sensors={sensors}>
                <div className="m-auto flex gap-4">
                    <div className="flex gap-4">
                        <SortableContext items={columnsId}>
                            {columns.map(col => (
                                <ColumnContainer
                                    key={col.id}
                                    column={col}
                                    deleteColumn={deleteColumn}
                                    updateColumn={updateColumn}
                                    createTask={createTask}
                                    tasks={tasks.filter(task => task.columnId === col.id)}
                                    deleteTask={deleteTask}
                                    updateTask={updateTask}></ColumnContainer>
                            ))}
                        </SortableContext>
                    </div>

                    {/* switches button and input box */}
                    {/* initial condition false button visible, when button clicked, condition true, button hide, input box visible. Create button clicked, condition become flase again add list button visible, input hidden */}
                    {!isAddingColumn ? (
                        <button
                            className="h-[60px] w-[50px] min-w-[350px] cursor-pointer rounded-lg bg-black border-2 border-black p-2 ring-rose-500 hover:ring-2 text-white flex gap-2"
                            onClick={() => setIsAddingColumn(true)}
                        >
                            Add another list
                        </button>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {/* Input Box */}
                            <input
                                className="h-[60px] w-[50px] min-w-[350px] text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                                type="text"
                                placeholder="Enter column title"
                                value={newColumnTitle}
                                onChange={(e) => setNewColumnTitle(e.target.value)}
                            />
                            {/* Button Group */}
                            <div className="flex gap-4">
                                <button
                                    className="flex-1 h-12 cursor-pointer rounded-lg bg-black border-2 border-black p-2 hover:ring-2 hover:ring-rose-500 text-white flex items-center justify-center gap-2"
                                    onClick={() => {
                                        createNewColumn();
                                    }}
                                >
                                    <PlusIcon /> Add List
                                </button>
                                <button
                                    className="flex-1 h-12 cursor-pointer rounded-lg bg-gray-600 border-2 border-gray-600 p-2 text-white hover:bg-gray-700"
                                    onClick={() => cancelCreateColumn()}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <ColumnContainer
                                column={activeColumn}
                                deleteColumn={deleteColumn}
                                updateColumn={updateColumn}
                                createTask={createTask}
                                tasks={tasks.filter(task => task.columnId === activeColumn.id)}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                            />
                        )}
                        {activeTask && (
                            <TaskCard
                                task={activeTask}
                                deleteTask={deleteTask}
                                updateTask={updateTask} />)}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    )


    function createNewColumn() {
        const columnToAdd: Column = {
            id: generateId(),
            title: newColumnTitle,
        };

        setColumns([...columns, columnToAdd]);
        setIsAddingColumn(false);
        setNewColumnTitle("")
    }

    function cancelCreateColumn() {
        setIsAddingColumn(false);
        setNewColumnTitle("");
    }

    function deleteColumn(id: Id) {
        const filteredColumns = columns.filter(col => col.id != id);
        setColumns(filteredColumns);

        const newTasks = tasks.filter((t) => t.columnId !== id);
        setTasks(newTasks)
    }

    function updateColumn(id: Id, title: string) {
        const newColumns = columns.map(col => {
            if (col.id !== id) {
                return col;
            }
            return { ...col, title }
        });

        setColumns(newColumns);
    }

    function createTask(columnId: Id, content: string) {
        const newTask: Task = {
            id: generateId(),
            columnId,
            content
        }

        setTasks([...tasks, newTask]);
    }

    function deleteTask(id: Id) {
        const newTasks = tasks.filter(task => task.id != id)

        setTasks(newTasks);
    }

    function updateTask(id: Id, content: string) {
        const newTasks = tasks.map(task => {
            if (task.id !== id) {
                return task;
            }

            return { ...task, content }
        });

        setTasks(newTasks)
    }

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }

        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null)
        setActiveTask(null)

        const { active, over } = event;

        if (!over) {
            return;
        }

        const activeColumnId = active.id;
        const overColumnId = over.id;

        if (activeColumnId === overColumnId) {
            return;
        }

        setColumns(columns => {
            const activeColumnIndex = columns.findIndex(col => col.id === activeColumnId);

            const overColumnIndex = columns.findIndex(col => col.id === overColumnId);

            return arrayMove(columns, activeColumnIndex, overColumnIndex)
        })
    }


    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) {
            return;
        }

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) {
            return;
        }

        const isActiveTask = active.data.current?.type === "Task";
        const isOverTask = active.data.current?.type === "Task";

        if (!isActiveTask) {
            return;
        }

        // In dropping a task over another task
        if (isActiveTask && isOverTask) {
            setTasks((tasks) => {
                const activeTaskIndex = tasks.findIndex((t) => t.id === activeId);
                const overTaskIndex = tasks.findIndex((t) => t.id === overId);

                if(activeTaskIndex === -1 || overTaskIndex === -1){
                    return tasks; //prevents accessing undefined index
                }

                //create a new tasks array without mutating state directly
                const updatedTasks = [...tasks]

                if (tasks[activeTaskIndex].columnId !== tasks[overTaskIndex].columnId) {
                    updatedTasks[activeTaskIndex] = {
                        ...updatedTasks[activeTaskIndex],
                        columnId: updatedTasks[overTaskIndex].columnId
                    }
                }

                return arrayMove(updatedTasks, activeTaskIndex, overTaskIndex);
            });
        }

        const isOverColumn = over.data.current?.type === "Column";

        // In  dropping a task over another column
        if (isActiveTask && isOverColumn) {
            setTasks((tasks) => {
                const activeTaskIndex = tasks.findIndex((t) => t.id === activeId);

                if(activeTaskIndex == -1){
                    return tasks; //prevents accessing undefined index
                }

                const updatedTasks = [...tasks]

                updatedTasks[activeTaskIndex] = {
                    ...updatedTasks[activeTaskIndex],
                    columnId: overId
                }

                return updatedTasks;

                // tasks[activeTaskIndex].columnId = overId;

                // return arrayMove(tasks, activeTaskIndex, activeTaskIndex);
            });
        }
    }
}

function generateId() {
    // Generate a random number between 0 and 10000
    return Math.floor(Math.random() * 10001);
}

export default KanbanBoard