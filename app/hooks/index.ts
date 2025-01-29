import axios from "axios";
import { useEffect, useState } from "react"


interface cards {
    id: number,
    title: string,
    listId: number
}

interface list {
    id: number,
    name: string,
    boardId: number,
    cards: cards[]
}

interface board {
    id: number,
    name: string,
    list: list[],
}


export const useBoards = () => {
    const [boards, setBoards] = useState<board[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);

        axios.get("/api/boards")
            .then(response => {
                setBoards(response.data)
                setIsLoading(false)
            });
    }, []);

    return { boards, isLoading }
}


export const useBoard = ({ id }: { id: string }) => {
    const [board, setBoard] = useState<board | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        console.log(`Fetching log with ID : ${id}`);

        axios.get(`api/boards/${id}`)
            .then(response => {
                setBoard(response.data);
                setError(null);
                setIsLoading(false);
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.status === 403) {
                        setError("You don't haver permission to view this Board");
                    } else if (err.response.status === 401) {
                        setError("Please login to view this Board")
                    } else {
                        setError("An error occured while fetching this board")
                    }
                } else if (err.request) {
                    setError("No response recieved from the server")
                } else {
                    setError("Error setting up the request")
                }

                setBoard(null);
                setIsLoading(false);
            })
    }, [id])

    return { board, isLoading, error }
}