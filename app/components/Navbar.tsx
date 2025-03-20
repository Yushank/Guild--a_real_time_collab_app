"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";



export const Navbar = () => {
    const { data: session } = useSession();
    const router = useRouter();

    async function signupNavigation() {
        router.push("/signup")
    }

    async function createBoard() {
        router.push("/boards")
    }

    async function signOutFunction() {
         await signOut({redirect: false});
        router.push("/signin")
    }

    return (
        <div className="fixed top-0 left-0 w-full flex justify-between bg-black h-10 items-center">
            <div>
                <Link href={"/boards"}>
                    <h1 className="text-2xl font-bold text-white ml-2">Guild</h1>
                </Link>
            </div>
            <div className="flex space-x-5">
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