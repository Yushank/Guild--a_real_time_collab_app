import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    isCollapsed : false
}

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleCollapse: (state) => {
            state.isCollapsed = !state.isCollapsed
        }
    }
});


export const {toggleCollapse} = sidebarSlice.actions;
export default sidebarSlice.reducer;