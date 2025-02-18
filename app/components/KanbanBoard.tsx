"use client"

import { useMemo, useState } from "react"
import PlusIcon from "../icons/PlusIcon"
import { Board, Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext } from "@dnd-kit/sortable"
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import axios from "axios";
import { useParams } from "next/navigation";
import { useList } from "../hooks";


interface KanbanBoardProps {
    board: Board
}

function KanbanBoard({board}: KanbanBoardProps) {
    const [columns, setColumns] = useState<Column[]>([]);
    const params = useParams();
    console.log("Params from kanbanboard:", params)
    const boardId = parseInt(Array.isArray(params.boardId) ? params.boardId[0] : params.boardId ?? "");
    console.log("Board Id in kanban board fetched:", boardId)
    const {lists} = useList({boardId})
    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState("");
    const columnsId = useMemo(() => lists.map((col) => col.id), [lists]);

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);

    const [tasks, setTasks] = useState<Task[]>([]);

    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3, //3px
            }
        })
    );

    console.log(lists);
    return (
        <div>
            <div>
                <h1 className="font-bold text-black">{board.name}</h1>
            </div>
            <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
                <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} sensors={sensors}>
                    <div className="m-auto flex gap-4">
                        <div className="flex gap-4">
                            <SortableContext items={columnsId}>
                                {lists.map(col => (
                                    <ColumnContainer
                                        key={col.id}
                                        column={col}
                                        deleteColumn={deleteColumn}
                                        updateColumn={updateColumn}
                                        createTask={createTask}
                                        tasks={tasks.filter(task => task.columnId === col.id)}
                                        deleteTask={deleteTask}
                                        updateTask={updateTask}
                                        boardId = {boardId}></ColumnContainer>
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
                                    boardId={boardId}
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
        </div>
    )

    async function createNewColumn() {
        const createdColumn = await submitListHandler(newColumnTitle, boardId);

        console.log("created column data:", createdColumn)

        if (!createdColumn || !createdColumn.list.id) {
            console.error("Failed to create list! :  no id");
            return;  // Stop execution if API call fails
        }

        const columnToAdd: Column = {
            id: createdColumn.list.id,  // Use real listId from backend
            title: newColumnTitle,
        };

        setColumns(prevColumns => [...prevColumns, columnToAdd]); // Add to state with correct ID
        setIsAddingColumn(false);
        setNewColumnTitle("");
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

    async function createTask(columnId: Id, content: string) {
        const createdCard = await submitCardHandler(content, boardId, columnId);

        console.log("Created task data:", createdCard);

        if(!createdCard || !createdCard.card.id){
            console.log("Failed to create card: no id")
            return;
        }

        const newTask: Task = {
            id: createdCard.card.id,
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

                if (activeTaskIndex === -1 || overTaskIndex === -1) {
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

                if (activeTaskIndex == -1) {
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


const submitListHandler = async (name: string, boardId: Id) => {
    try {
        const response = await axios.post(`/api/boards/${boardId}/lists`, {
            name,
            boardId
        });

        console.log("Created List:", response.data);  // Check if response contains the ID
        return response.data;  // Return the created list
    } catch (error) {
        console.error("Error creating list:", error);
        alert("Failed to create list!");
        return null;
    }
};

const submitCardHandler = async (content: string, boardId: Id, columnId: Id) => {
    try {
        console.log("Content is here")
        const response = await axios.post(`/api/boards/${boardId}/lists/${columnId}/cards`, {
            content: content,
            listId: columnId
        });

        console.log("Created Card:", response.data);
        return response.data;
    } catch (error) {
        alert('Error while creating card');
        console.log(error)
    }
}

export default KanbanBoard