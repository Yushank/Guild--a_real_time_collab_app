import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface Board {
    id: number,
    name: string
}

const initialState: {
    selectedBoard: Board | null
} = {
    selectedBoard: null
}

const boardSlice = createSlice({
    name: "board",
    initialState,
    reducers: {
        setSelectedBoard: (state, action: PayloadAction<Board>) => {
            state.selectedBoard = action.payload
        },
        clearSelectedBoard: (state) => {
            state.selectedBoard = null
        }
    }
});

export const { setSelectedBoard, clearSelectedBoard } = boardSlice.actions;
export default boardSlice.reducer;