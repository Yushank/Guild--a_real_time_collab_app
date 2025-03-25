"use client";
import { toggleCollapse } from "@/features/sidebar/sidebarSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Home() {
  const router = useRouter();
  const navigateToBoards = () => {
    router.push("/boards");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="text-black dark:text-white font-bold text-2xl">
        Get started with guild boards
      </div>
      <button
        className="rounded-lg px-6 py-3 text-white dark:text-black bg-gray-800 dark:bg-blue-500 hover:opacity-90 font-semibold"
        onClick={navigateToBoards}
      >
        BOARDS
      </button>
    </div>
  );
}