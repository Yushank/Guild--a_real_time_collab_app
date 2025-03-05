"use client"

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { toggleCollapse } from '@/features/sidebar/sidebarSlice';
import { StepForward, X } from 'lucide-react';

export const Sidebar = () => {
  const isCollapsed = useSelector((state: RootState) => state.sidebar.isCollapsed);
  const dispatch = useDispatch();

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
              }}><StepForward className=' hover:text-gray-500 dark:text-white' /></button> : "LOGO"}
          </div>

          <button className='py-3 hover:bg-gray-100 rounded-full p-1 transition-colors'
            onClick={() => {
              dispatch(toggleCollapse())
            }}>
            <X className='h-6 w-6 text-gray-100 hover:text-gray-500 dark:text-white' />
          </button>

        </div>
      </div>
    </div>
  )
}
