"use client"

import React, { ChangeEvent, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import axios from 'axios'
import { useBoardMembers } from '../hooks'
import { Dot } from 'lucide-react'

export const Members = () => {
    const selectedBoardMembers = useSelector((state: RootState) => state.boardMembers.selectedBoardMembers);
    console.log("Selected board members:", selectedBoardMembers);
    const boardId: number | undefined = selectedBoardMembers?.id;
    console.log("board id in members component:", boardId)
    const { board, isLoading } = useBoardMembers({ boardId })

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

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <div>
                <div>
                    <h1 className='text-black dark:text-white font-bold py-2'>Add members in board</h1>
                </div>
                <InputBox
                    label='Member Email: '
                    type='text'
                    placeholder='peter@gmail.com'
                    value={members}
                    onChange={(e) => setMembers(e.target.value)}
                ></InputBox>
                <button onClick={sendRequest} className='font-semibold bg-blue-400 text-gray-100 dark:text-gray-900 rounded-lg py-2 px-6 hover:bg-blue-500 dark:hover:bg-gray-200'>Add</button>
            </div>


            <div className="mt-16 px-6 z-10 w-1/2 rounded-lg border-2 border-gray-900">
                <h1 className='font-bold text-black dark:text-white p-2'>Members</h1>
                {board?.members?.length ? (
                    board.members.map((member) => (
                        <div key={member.id} className="mb-2 flex gap-2">
                            <Dot className='text-black dark:text-white'/>
                            <h1 className="text-gray-900 dark:text-gray-100 font-semibold">
                                {member.firstName} {member.lastName}
                            </h1>
                            <p className='text-gray-900 dark:text-gray-100'>({member.email})</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-900 dark:text-gray-200">No members found.</p>
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
            <label className='text-black dark:text-white font-semibold'>{label}</label>
            <input type={type} placeholder={placeholder} value={value} onChange={onChange} className='bg-gray-500 dark:bg-gray-100 text-white dark:text-black p-2 rounded-lg' />
        </div>
    )
}

