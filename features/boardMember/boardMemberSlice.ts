import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface User {
    id: number,
    firstName: string,
    lastName: string,
    email: string
}

interface Board {
    id:number,
    name: string,
    members?: User[]
}

const initialState:{
    selectedBoardMembers : Board | null
} = {
    selectedBoardMembers: null
};

const boardMemberSlice = createSlice({
    name: "boardMembers",
    initialState,
    reducers: {
        setSelectedBoardMembers: (state, action: PayloadAction<Board>) =>{
            state.selectedBoardMembers = action.payload
        },
        clearSelectedBoardMembers: (state) =>{
            state.selectedBoardMembers = null
        }
    }
});

export const {setSelectedBoardMembers, clearSelectedBoardMembers} = boardMemberSlice.actions;
export default boardMemberSlice.reducer;