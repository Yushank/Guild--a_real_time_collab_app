"use client"

import { useMemo, useState } from "react"
import PlusIcon from "../icons/PlusIcon"
import { Card, Column, Id, Task, updatedCardOrder } from "../types";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext } from "@dnd-kit/sortable"
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import axios from "axios";
import { useParams } from "next/navigation";
import { useAllCards, useList } from "../hooks";



function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    const params = useParams();
    // console.log("Params from kanbanboard:", params)
    const boardId = parseInt(Array.isArray(params.boardId) ? params.boardId[0] : params.boardId ?? "");
    // console.log("Board Id in kanban board fetched:", boardId)
    const { lists, setLists } = useList({ boardId })
    const { allCards, setAllCards } = useAllCards({ boardId })
    // console.log("All cards in kanbanboard:", allCards)
    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState("");
    const columnsId = useMemo(() => lists.map((col) => col.id), [lists]);

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);

    const [tasks, setTasks] = useState<Task[]>([]);

    const [activeTask, setActiveTask] = useState<Card | null>(null);

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
            {/* <div>
                <h1 className="font-bold text-black">{board.name}</h1>
            </div> */}
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
                                        tasks={allCards.filter(task => task.listId === col.id)}
                                        deleteTask={deleteTask}
                                        updateTask={updateTask}
                                        boardId={boardId}></ColumnContainer>
                                ))}
                            </SortableContext>
                        </div>

                        {/* switches button and input box */}
                        {/* initial condition false button visible, when button clicked, condition true, button hide, input box visible. Create button clicked, condition become flase again add list button visible, input hidden */}
                        {!isAddingColumn ? (
                            <button
                                className="h-[60px] w-[50px] min-w-[350px] cursor-pointer rounded-lg bg-containerHeader border-blue-900 hover:ring-blue-400 dark:bg-black border-2 dark:border-black p-2 dark:hover:ring-rose-500 hover:ring-2 text-black dark:text-white flex gap-2"
                                onClick={() => setIsAddingColumn(true)}
                            >
                                Add another list
                            </button>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {/* Input Box */}
                                <input
                                    className="h-[60px] w-[50px] min-w-[350px] text-black bg-gray-300 dark:text-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-rose-500"
                                    type="text"
                                    placeholder="Enter column title"
                                    value={newColumnTitle}
                                    onChange={(e) => setNewColumnTitle(e.target.value)}
                                />
                                {/* Button Group */}
                                <div className="flex gap-4">
                                    <button
                                        className="flex-1 h-12 cursor-pointer rounded-lg bg-blue-500 border-blue-400 dark:bg-black border-2 dark:border-black p-2 hover:ring-2 hover: ring-blue-200 dark:hover:ring-rose-500 text-white flex items-center justify-center gap-2"
                                        onClick={() => {
                                            createNewColumn();
                                        }}
                                    >
                                        <PlusIcon /> Add List
                                    </button>
                                    <button
                                        className="flex-1 h-12 cursor-pointer rounded-lg bg-gray-800 border-2 border-gray-600 p-2 text-white hover:bg-gray-700"
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
                                    tasks={allCards.filter(task => task.listId === activeColumn.id)}
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
        const filteredColumns = lists.filter(col => col.id != id);
        setLists(filteredColumns);

        const newTasks = allCards.filter((t) => t.listId !== id);
        setAllCards(newTasks);

        submitDeleteList(id, boardId)
    }

    function updateColumn(id: Id, title: string) {
        console.log("title recieved after updating column title:", title)
        // const newColumns = columns.map(col => {
        //     if (col.id !== id) {
        //         return col;
        //     }
        //     return { ...col, title }
        // });

        const newLists = lists.map(col => {
            if (col.id !== id) {
                return col;
            }
            return { ...col, title }
        });

        submitUpdatedListTitle(id, boardId, title);

        // setColumns(newColumns);
        setLists(newLists);
        console.log("columns state after updating col title:", columns)
        console.log("columns state after updating col title:", lists)
    }

    async function createTask(columnId: Id, content: string) {
        const createdCard = await submitCardHandler(content, boardId, columnId);

        console.log("Created task data:", createdCard);

        if (!createdCard || !createdCard.card.id) {
            console.log("Failed to create card: no id")
            return;
        }
    }

    function deleteTask(id: Id) {
        const newTasks = allCards.filter(task => task.id != id);

        setAllCards(newTasks);

        submitDeleteCard(id, boardId);
    }

    function updateTask(id: Id, content: string) {
        const newTasks = allCards.map(task => {
            if (task.id !== id) {
                return task;
            }

            return { ...task, content }
        });

        submitUpdatedCardContent(id, content, boardId);
        setAllCards(newTasks)
    }

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }

        if (event.active.data.current?.type === "Card") {
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

        setLists(lists => {
            const activeColumnIndex = lists.findIndex(col => col.id === activeColumnId);

            const overColumnIndex = lists.findIndex(col => col.id === overColumnId);

            const newColumnOrder = arrayMove(lists, activeColumnIndex, overColumnIndex);

            console.log("newColumnOrder:", newColumnOrder)

            submitUpdatedListOrder(newColumnOrder.map(col => col.id), boardId);

            return newColumnOrder
        });
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

        const isActiveTask = active.data.current?.type === "Card";
        const isOverTask = active.data.current?.type === "Card";
        const isOverColumn = active.data.current?.type === "Column";

        if (!isActiveTask) {
            return;
        }

        setAllCards((tasks) => {
            const activeTaskIndex = tasks.findIndex((t) => t.id === activeId);
            const overTaskIndex = tasks.findIndex((t) => t.id === overId);

            if (activeTaskIndex === -1) return tasks; //prevent errors

            const updatedTasks = [...tasks];
            const movedTask = { ...updatedTasks[activeTaskIndex] };

            if (isActiveTask && isOverTask) {
                if (tasks[overTaskIndex]) {
                    if (tasks[activeTaskIndex].listId !== tasks[overTaskIndex].listId) {
                        movedTask.listId = tasks[overTaskIndex].listId
                    }

                    updatedTasks.splice(activeTaskIndex, 1); //remove from old position
                    updatedTasks.splice(overTaskIndex, 0, movedTask); //insert to new position
                }
            }

            if (isActiveTask && isOverColumn) {
                movedTask.listId = overId  //move to empty list

                updatedTasks.splice(activeTaskIndex, 1);
                updatedTasks.push(movedTask);
            }

            // const reorderedTasks = updatedTasks.map((task, index) => ({
            //     ...task,
            //     order: index,
            // }));


            const groupedByList = new Map<Id, Card[]>();
            updatedTasks.forEach(task => {
                if (!groupedByList.has(task.listId)) {
                    groupedByList.set(task.listId, [])
                }
                groupedByList.get(task.listId)!.push(task);
            });

            const reorderedTasks = Array.from(groupedByList.values())
                .flatMap(listcards =>
                    listcards.map((card, index) => ({
                        ...card,
                        order: index
                    }))
                )

            submitUpdatedCardOrder(reorderedTasks, boardId);

            return reorderedTasks
        });
    }
}


const submitListHandler = async (name: string, boardId: Id) => {
    try {
        const response = await axios.post(`/api/boards/${boardId}/lists`, {
            name,
            boardId
        });

        // console.log("Created List:", response.data);  // Check if response contains the ID
        return response.data;  // Return the created list
    } catch (error) {
        console.error("Error creating list:", error);
        alert("Failed to create list!");
        return null;
    }
};

const submitUpdatedListOrder = async (orderedListIds: Id[], boardId: Id) => {
    try {
        // const orderedListIds = columns.map(col=> col.id); 
        console.log("orderedListIds:", orderedListIds)
        const response = await axios.put(`/api/boards/${boardId}/lists`, {
            type: "updateListOrder",
            orderedListIds
        });
        console.log("Updated lists order:", response.data);
        return response.data
    }
    catch (error) {
        console.error("Error updating lists order:", error);
        return null
    }
}

const submitCardHandler = async (content: string, boardId: Id, columnId: Id) => {
    try {
        // console.log("Content is here")
        const response = await axios.post(`/api/boards/${boardId}/lists/${columnId}/cards`, {
            content: content,
            listId: columnId
        });

        // console.log("Created Card:", response.data);
        return response.data;
    } catch (error) {
        alert('Error while creating card');
        console.log(error)
    }
}

const submitUpdatedCardOrder = async (updatedCards: updatedCardOrder[], boardId: Id) => {
    try {
        const response = await axios.put(`/api/boards/${boardId}/allcards`, {
            type: "updateCardOrder",
            cards: updatedCards
        });
        console.log("New order sending to backend:", updatedCards)
        console.log("Updated card order:", response.data)
    }
    catch (error) {
        console.error("failed to udpate card order:", error)
    }
}

const submitDeleteList = async (listId: Id, boardId: Id) => {
    try {
        const response = await axios.delete(`/api/boards/${boardId}/lists/`, {
            data: {
                id: listId
            }
        })
        console.log("ListId:", listId)
        console.log("boardId:", boardId)
        console.log("DELETE rqst is sent to backend route:", response)
    } catch (error) {
        console.error("Failed to delete task:", error)
    }
}

const submitDeleteCard = async (id: Id, boardId: Id) => {
    try{
        const response = await axios.delete(`/api/boards/${boardId}/allcards/`, {
            data: {
                id
            }
        })
        console.log("boardId:", boardId);
        console.log("card id:", id);
        console.log("DELETE rqst for card is sent:", response);
    } catch(error){
        console.error("Failed to delte card:", error)
    }
}

const submitUpdatedListTitle = async (id: Id, boardId: Id, title: string) => {
    try{
        const response = await axios.put(`/api/boards/${boardId}/lists`, {
            type: "updateListTitle",
            id: id,
            title: title
        });
        console.log("updated list title:", response);
        return response.data
    }
    catch(error){
        console.error("failed to update list title:", error)
    }
}

const submitUpdatedCardContent = async (id: Id, content: string, boardId: Id) => {
    try{
        const response = await axios.put(`/api/boards/${boardId}/allcards`, {
            type: "updateCardContent",
            id: id,
            content: content
        });
        console.log("updated card content:", response);
        return response.data
    }
    catch(error){
        console.error("failed to updated card content:", error)
    }
}

export default KanbanBoard