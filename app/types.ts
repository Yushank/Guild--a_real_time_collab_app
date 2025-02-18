export type Id = string | number;
 
export type Column = {
    id: Id;
    title: string
}

export type Task = {
    id: Id;
    columnId: Id;
    content: string
}

export type List = {
    id: number,
    title: string,
    boardId: number,
    cards: Task[]
}

export type Board = {
    id: number,
    name: string,
    list: List[],
}