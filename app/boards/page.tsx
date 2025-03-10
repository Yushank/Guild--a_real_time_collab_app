"use client"

import { useRouter } from "next/navigation";
import { useBoards } from "../hooks";
import { BoardsCard } from "../components/Boards";
import CreateBoard from "../components/CreateBoard";



export default function Boards() {
    const { boards, isLoading } = useBoards();
    const router = useRouter();

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="p-4 mt-8">
            <div className="flex flex-wrap gap-4">
                {boards.map(board => <BoardsCard
                    key={board.id}
                    id={board.id}
                    name={board.name}
                ></BoardsCard>)}
                <div>
                    <CreateBoard /> 
                </div>
            </div>
        </div>
    )
}