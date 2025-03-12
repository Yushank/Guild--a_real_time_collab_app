"use client"

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { usePathname } from 'next/navigation'
import { clearSelectedBoardMembers } from '@/features/boardMember/boardMemberSlice'

export const Members = () => {
    const selectedBoardMembers = useSelector((state: RootState) => state.boardMembers.selectedBoardMembers);
    console.log("Selected board members:", selectedBoardMembers);
    const pathname = usePathname();
    const dispatch = useDispatch();

    // useEffect(()=> {
    //     if(!pathname.startsWith('/members/')){
    //         dispatch(clearSelectedBoardMembers())
    //     }
    // }, [pathname, dispatch])

    return (
        <div className="pt-16 px-6 z-10">
            {selectedBoardMembers?.members?.length ? (
                selectedBoardMembers.members.map((member) => (
                    <div key={member.id} className="mb-2 flex gap-2">
                        <h1 className="text-black font-semibold">
                            {member.firstName} {member.lastName}
                        </h1>
                        <p className='text-black'>({member.email})</p>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 dark:text-gray-400">No members found.</p>
            )}
        </div>
    );
}

