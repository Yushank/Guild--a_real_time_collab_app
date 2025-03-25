"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const navigateToBoards = () => {
        router.push("/boards");
    };

    const { data: session } = useSession();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <div className="text-black font-bold text-2xl">
                Get started with guild boards
            </div>
            {!session ? (
                <div className="flex gap-4">
                    <Link href="/signin" className="rounded-lg px-6 py-3 text-white bg-gray-800 hover:opacity-90 font-semibold">Signin</Link>
                    <Link href="/signup" className="rounded-lg px-6 py-3 text-black bg-gray-100 border-black border-2 hover:bg-gray-200 font-semibold">Signup</Link>
                </div>
            ) : (
                <button
                    className="rounded-lg px-6 py-3 text-white bg-gray-800 hover:opacity-90 font-semibold"
                    onClick={navigateToBoards}
                >
                    BOARDS
                </button>
            )}
        </div>
    );
}