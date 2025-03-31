"use client"

import KanbanBoard from "@/app/components/KanbanBoard";
import { useBoard } from "@/app/hooks";
import { setSelectedBoard } from "@/features/board/boardSlice";
import { setSelectedBoardMembers } from "@/features/boardMember/boardMemberSlice";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


export default function Board(){
    const params = useParams();
    console.log("useparams output:", params)
    const id = Array.isArray(params.boardId) ? params.boardId[0] : params.boardId ?? "";
    console.log("Extracted board id:", id)
    const {board, error, isLoading} = useBoard({id})
    const dispatch = useDispatch();

    useEffect(()=>{
        console.log("board data before fetching:", board)
        if(board){
            dispatch(setSelectedBoard(board))
            dispatch(setSelectedBoardMembers(board))
        }
    }, [board, dispatch])


    if(isLoading){
        return <div>Loading...</div>
    }

    if(error){
        return (
            <div>
                <p>{error}</p>
                {error.includes('log in') && (
                    <button onClick={()=> window.location.href = '/signin'}>
                        Go to sign in
                    </button>
                )}
            </div>
        )
    }

    if(!board){
        return (
            <div>
                Board not found
            </div>
        )
    }
    return (
        <div>
            <KanbanBoard board = {board}></KanbanBoard>
        </div>
    )
}