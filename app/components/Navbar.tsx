"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { toggleCollapse } from "@/features/sidebar/sidebarSlice";
import { AlignJustify, X } from "lucide-react";



export const Navbar = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const isCollapsed = useSelector((state: RootState) => state.sidebar.isCollapsed);
    const dispatch = useDispatch();

    async function signupNavigation() {
        router.push("/signup")
    }

    async function createBoard() {
        router.push("/boards")
    }

    async function signOutFunction() {
        await signOut({ redirect: false });
        router.push("/signin")
    }

    return (
        <div className="fixed top-0 left-0 w-full flex justify-between bg-black h-12 items-center px-4">
            <div className="flex items-center space-x-4">
                {/* Toggle sidebar button */}
                <div className='text-xl font-bold text-gray-800 dark: text-white'>
                    {isCollapsed ? (
                        <button
                            className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                            onClick={() => {
                                dispatch(toggleCollapse())
                            }}><AlignJustify className='h-6 w-6 hover:text-gray-400 dark:text-white' />
                        </button>) : (
                        <button className='p-2 hover:bg-gray-700 rounded-full transition-colors'
                            onClick={() => {
                                dispatch(toggleCollapse())
                            }}>
                            <X className='h-6 w-6 hover:text-gray-400 dark:text-white' />
                        </button>
                    )}
                </div>
                {/* APP NAME */}
                <Link href={"/boards"}>
                    <h1 className="text-2xl font-bold text-white">Guild</h1>
                </Link>
            </div>
            <div className="flex items-center space-x-4">
                {!session ? (
                    <>
                        <Button onClick={() => signIn()} label="Signin" color="blue" />
                        <Button onClick={signupNavigation} label="Signup" color="gray" />
                    </>
                ) : (
                    <>
                        <Button onClick={() => signOutFunction()} label="Signout" color="red" />
                        <Button onClick={createBoard} label="Create" color="green" />
                    </>
                )}
            </div>
        </div>
    )
}

interface buttonProps {
    label: string,
    color: 'blue' | 'red' | 'gray' | 'green',
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

function Button({ label, color, onClick }: buttonProps) {
    const baseClasses = "rounded-lg text-white px-2 h-8 w-35";

    const colorClasses = {
        blue: "bg-blue-500",
        red: "bg-orange-500",
        gray: "bg-gray-500",
        green: "bg-green-500"
    }

    const colorClass = colorClasses[color] || "bg-gray-500"

    return (
        <div>
            <button onClick={onClick} className={`${baseClasses} ${colorClass}`}>{label}</button>
        </div>
    )
}