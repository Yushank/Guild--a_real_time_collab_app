import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from '@/features/sidebar/sidebarSlice'
import boardReducer from '@/features/board/boardSlice'
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

export const store = configureStore({
    reducer: {
        sidebar: sidebarReducer,
        board: boardReducer
    }
});


export  type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;