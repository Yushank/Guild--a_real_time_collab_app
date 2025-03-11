"use client"

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { toggleCollapse } from '@/features/sidebar/sidebarSlice';
import { Home, LayoutDashboard, LucideIcon, Minus, StepForward, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export const Sidebar = () => {
  const isCollapsed = useSelector((state: RootState) => state.sidebar.isCollapsed);
  const dispatch = useDispatch();

  const selectedBoard = useSelector((state: RootState) => state.board.selectedBoard);

  const sidebarClassname = `fixed top-10 left-0 flex flex-col h-[100%] justify-between shadow-xl
    transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white
    ${isCollapsed ? "w-20" : "w-64"}`;

  return (
    <div className={sidebarClassname}>
      <div className='flex h-[100%] w-full flex-col justify-start'>
        <div className='z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black'>
          <div className='text-xl font-bold text-gray-800 dark: text-white'>
            {isCollapsed ? <button
              className='py-3 hover:bg-gray-100 rounded-full p-1 transition-colors'
              onClick={() => {
                dispatch(toggleCollapse())
              }}><StepForward className=' hover:text-gray-500 dark:text-white' /></button> : ""}
          </div>

          <button className='py-3 hover:bg-gray-100 rounded-full p-1 transition-colors'
            onClick={() => {
              dispatch(toggleCollapse())
            }}>
            <X className='h-6 w-6 text-gray-100 hover:text-gray-500 dark:text-white' />
          </button>

        </div>

        
        <div>
          <nav className='z-10 w-full'>
            <SidebarLink icon={LayoutDashboard} label="Boards" href="/boards" />
          </nav>
        </div>

        <div className='flex pl-10'>
          <h1 className='text-white py-4'>
            <Minus className='text-gray-100 dark:text-white inline-block mr-2' />
            {selectedBoard ? selectedBoard.name : ""}
          </h1>
        </div>
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