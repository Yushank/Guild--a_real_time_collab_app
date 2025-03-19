import socket from "@/utils/socket";
import axios from "axios";
import { useEffect, useState } from "react"
import { Board, Card, Id, Task } from "../types";


interface cards {
    id: number,
    title: string,
    listId: number
}

interface list {
    id: number,
    title: string,
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
                setBoards(response.data) // this update the whole state (with data gotten from DB), when hook is re-mounted.
                setIsLoading(false)
            });

        socket.on("board", (board) => {
            setBoards((prev) => [...prev, board])  //update list in real time (got from io.emit in boards/route.ts post route)
        });

        return () => {
            socket.off("board");
        }
    }, []);

    return { boards, isLoading }
}



export const useBoard = ({ id }: { id: string }) => {
    // console.log("📌 useBoard Hook is Called!"); // ✅ Log if function runs
    const [board, setBoard] = useState<Board | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // console.log("🛠 useEffect triggered with id:", id);

        if (!id || id === "") {
            // console.error("❌ useEffect Stopped: ID is missing or empty.");
            setIsLoading(false);
            setError("Invalid Board ID")
            return;
        }

        setIsLoading(true);
        // console.log(`Fetching log with ID : ${id}`);
        // console.log(`🚀 Sending API Request: /api/boards/${id}`);

        const fetchBoard = async () => {
            try {
                const response = await axios.get(`/api/boards/${id}`)
                // console.log("✅ API Response:", response);
                // console.log("Fetched board:", response.data.board); //data.board because route is returning object board:{}
                setBoard(response.data.board);
                setError(null);
                setIsLoading(false);
            } catch (error) {
                console.error("❌ Error fetching board:", error); // ✅ Log full error
            }
        }
        fetchBoard();

        setBoard(null);
        setIsLoading(false);

    }, [id])

    return { board, isLoading, error }
}


export const useList = ({ boardId }: { boardId: Id }) => {
    const [lists, setLists] = useState<list[]>([]);
    // console.log("board Id from prop in useList:", boardId)

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const response = await axios.get(`/api/boards/${boardId}/lists`);
                // console.log("Fetched lists:", response.data);
                setLists(response.data)
            } catch (error) {
                console.error("Error fetching lists:", error);
            }
        }
        fetchLists();

        const handleNewList = (list: any) => {
            // console.log("New list received via socket:", list);
            setLists((prev) => [...prev, list])
        }
        socket.on("list", handleNewList)

        return () => {
            socket.off("list", handleNewList);
        }
    }, [boardId]);

    return { lists, setLists };
}

export const useCard = (boardId: Id, listId: Id) => {
    const [cards, setCards] = useState<Card[]>([]);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await axios.get(`/api/boards/${boardId}/lists/${listId}/cards`);
                // console.log("Fetched cards:", response.data);
                setCards(response.data);
            } catch (error) {
                console.error("Error fetching cards:", error)
            }
        }
        fetchCards();

        const handleNewCard = (card: any) => {
            // console.log("New card received via socket:", card);
            if (card.listId === listId) {  // this to check and add only those cards whose listId match the hook calling column container id
                setCards((prev) => [...prev, card])
            }
        }
        socket.on("card", handleNewCard);

        return () => {
            socket.off("card", handleNewCard)
        }
    }, [listId]);

    return { cards };
}


export const useAllCards = ({ boardId }: { boardId: Id }) => {
    const [allCards, setAllCards] = useState<Card[]>([]);

    useEffect(() => {
        const fetchAllCards = async () => {
            try {
                const response = await axios.get(`/api/boards/${boardId}`)
                const cards = response.data.board.list.flatMap((list: list) => list.cards);
                // console.log("allCards fetched from board route:", cards)
                setAllCards(cards)
            }
            catch (error) {
                console.error("Error fetching all cards:", error)
            }
        }

        fetchAllCards();

        const handleNewCard = (card: any) => {
            // console.log("New card received via socket:", card);
            setAllCards((prev) => [...prev, card])

        }
        socket.on("card", handleNewCard);

        return () => {
            socket.off("card", handleNewCard)
        }

    }, [boardId]);

    return { allCards, setAllCards };
}

export const useBoardMembers = ({ boardId }: { boardId: number | undefined }) => {
    const [board, setBoard] = useState<Board | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!boardId) {
            setIsLoading(false);
            setError("Invalid board ID");
            return;
        }

        setIsLoading(true);

        const fetchBoard = async () => {
            try {
                const response = await axios.get(`/api/boards/${boardId}`)
                setBoard(response.data.board);
                setError(null);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching board data:", error)
            }
        }
        fetchBoard();

        const handleNewBoard = (board: any) => {
            if (!board) {
                console.log("Received null board update for member:");
                return; 
            }
            console.log("Received board update for ember:", board)
            setBoard(board)
        }
        socket.on("boardMembers", handleNewBoard);

        // setBoard(null);
        setIsLoading(false)

        return () => {
            socket.off("boardMembers", handleNewBoard)
        }
    }, [boardId]);

    return { board, isLoading, error }
}