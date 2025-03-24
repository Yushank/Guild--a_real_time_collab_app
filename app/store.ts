import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from '@/features/sidebar/sidebarSlice'
import boardReducer from '@/features/board/boardSlice'
import boardMemberReducer from '@/features/boardMember/boardMemberSlice'
import darkModeReducer from '@/features/darkMode/darkModeSlice'
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const boardMemberPersistConfig = {
    key: "boardMembers",
    storage
}

const darkModePersistConfig = {
    key: "darkMode",
    storage
}

const persistedBoardMembersReducer = persistReducer(boardMemberPersistConfig, boardMemberReducer);
const persistedDarkModeReducer = persistReducer(darkModePersistConfig, darkModeReducer)

export const store = configureStore({
    reducer: {
        sidebar: sidebarReducer,
        board: boardReducer,
        boardMembers: persistedBoardMembersReducer,
        darkMode: persistedDarkModeReducer,
    }
});

export const persistor = persistStore(store);

export  type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;