import { setSelectedBoard } from "@/features/board/boardSlice";
import Link from "next/link"
import { useDispatch } from "react-redux"


interface boardsProp {
    id: number,
    name: string
}

export const BoardsCard = ({ id, name }: boardsProp) => {

    return (
        <Link href={`board/${id}`}>
            <div className="w-48 h-24 bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center cursor-pointer">
                <span className="text-white font-semibold text-lg">{name}</span>
            </div>
        </Link>
    )
}
