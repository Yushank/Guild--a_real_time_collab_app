"use client"

import React, { ChangeEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { usePathname } from 'next/navigation'
import { clearSelectedBoardMembers } from '@/features/boardMember/boardMemberSlice'
import axios from 'axios'
import { useBoardMembers } from '../hooks'

export const Members = () => {
    const selectedBoardMembers = useSelector((state: RootState) => state.boardMembers.selectedBoardMembers);
    console.log("Selected board members:", selectedBoardMembers);
    const boardId: number | undefined = selectedBoardMembers?.id;
    console.log("board id in members component:", boardId)
    const { board, error, isLoading } = useBoardMembers({ boardId })

    const [members, setMembers] = useState("");

    async function sendRequest() {
        try {
            const response = await axios.post(`/api/boards/${boardId}`, {
                email: members
            });
            setMembers("")

            console.log(response);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                // Handle Axios-specific errors
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log("Error response data:", error.response.data);
                    console.log("Error response status:", error.response.status);
                    console.log("Error response headers:", error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log("Error request:", error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error message:", error.message);
                }
                console.log("Error config:", error.config);
            } else {
                // Handle non-Axios errors (e.g., network errors, syntax errors, etc.)
                console.log("Unexpected error:", error);
            }
        }
    }

    return (
        <div>
            <div>
                <div>Add members in board</div>
                <InputBox
                    label='Member Email'
                    type='text'
                    placeholder='peter@gmail.com'
                    value = {members}
                    onChange={(e) => setMembers(e.target.value)}
                ></InputBox>
                <button onClick={sendRequest}>Add</button>
            </div>


            <div className="pt-16 px-6 z-10">
                {board?.members?.length ? (
                    board.members.map((member) => (
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
        </div>
    );
}


interface InputType {
    label: string,
    type: string,
    placeholder: string,
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

function InputBox({ label, type, placeholder, value, onChange }: InputType) {
    return (
        <div>
            <label>{label}</label>
            <input type={type} placeholder={placeholder} value={value} onChange={onChange} />
        </div>
    )
}

