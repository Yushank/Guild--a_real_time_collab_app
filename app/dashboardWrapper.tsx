"use client"

import { useState } from "react"
import { Navbar } from "./components/Navbar"
import { Sidebar } from "./components/Sidebar"
// import { Providers } from "./providers"
import { Provider, useDispatch, useSelector } from "react-redux"
import { RootState, store, persistor } from "./store"
import { Providers } from "./providers"
import { PersistGate } from "redux-persist/integration/react"



const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

    const isCollapsed = useSelector((state: RootState) => state.sidebar.isCollapsed);

    return (
        <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
            <Providers>
                <Navbar />
            </Providers>
            <Sidebar />
            <main className={`flex w-full flex-col bg-gray-50 dark:bg-dark-bg transition-all duration-300 ${isCollapsed ? "md:pl-20" : "md:pl-64"}`}>
                <Providers>

                    {children}
                </Providers>
            </main>
        </div>
    )
}

export const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <DashboardLayout>{children}</DashboardLayout>
            </PersistGate>
        </Provider>
    )
}