"use client"

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { toggleCollapse } from '@/features/sidebar/sidebarSlice';
import { Home, LayoutDashboard, LucideIcon, Minus, StepForward, Users, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { clearSelectedBoard } from '@/features/board/boardSlice';

export const Sidebar = () => {
  const isCollapsed = useSelector((state: RootState) => state.sidebar.isCollapsed);
  const dispatch = useDispatch();

  const selectedBoard = useSelector((state: RootState) => state.board.selectedBoard);

  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith('/board/')) {
      dispatch(clearSelectedBoard());
    }
  }, [pathname, dispatch])


  const sidebarClassname = `fixed top-10 left-0 flex flex-col h-[100%] justify-between shadow-xl
    transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white
    ${isCollapsed ? "w-0" : "w-64"}`;

  return (
    <div className={sidebarClassname}>
      <div className='flex h-[100%] w-full flex-col justify-start'>
        <div className='z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black'>
          
        </div>

        {/* wrapped everything under isCollapsed condition so that when it is collapsed no icon is visible */}
        {!isCollapsed && (
          <>
            {/* Sidebar Links */}
            <nav className="z-10 w-full">
              <SidebarLink icon={LayoutDashboard} label="Boards" href="/boards" />
            </nav>

            {/* Board Info (Only visible when board is selected) */}
            {selectedBoard && (
              <div className="mt-4">
                {/* Board Name */}
                <div className="flex items-center px-6 py-2">
                  <Minus className="text-gray-100 dark:text-white mr-2" />
                  <h1 className="text-white">{selectedBoard.name}</h1>
                </div>

                {/* Members Button */}
                <SidebarLink icon={Users} label="Members" href="/members" />
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}


interface sidebarLinkProps {
  href: string,
  icon: LucideIcon,
  label: string,
}

const SidebarLink = ({ href, icon: Icon, label }: sidebarLinkProps) => {
  const pathName = usePathname();
  const isActive = pathName === href;

  return (
    <Link href={href} className='w-full'>
      <div className={
        `relative flex cursor-pointer items-center gap-3 transition-colors
        hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""}
        justify-start px-8 py-3`
      }>

        {isActive && (
          <div className='absolute left-0 top-0 h-{100%} w-{5px} bg-blue-200'></div>
        )}

        <Icon className='h-6 w-6 text-gray-800 dark:text-gray-100' />
        <span className='font-medium text-gray-800 dark:text-gray-100'>
          {label}
        </span>
      </div>
    </Link>
  )
}