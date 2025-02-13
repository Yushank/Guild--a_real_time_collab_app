import React, { useState } from 'react'
import PlusIcon2 from '../icons/PlusIcon2'
import axios from 'axios';

function CreateBoard() {
    const [isAdding, setIsAdding] = useState(false);
    const [boardTitle, setBoardTitle] = useState("");

    const submitHandler = async () => {
        try{
            const response = await axios.post('/api/boards',{
                name: boardTitle
            });
            console.log(response);

            setIsAdding(false);
            setBoardTitle("");
        }
        catch(error){
            alert('Error while creating board')
            console.log(error);
        }
    }

    return (
        <div className="w-48 h-24 bg-gray-300 rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-200 flex items-center justify-center cursor-pointer">
            {!isAdding ? (
                <button className="font-medium flex gap-2"
                onClick={()=> setIsAdding(true)}><PlusIcon2 />Create Board</button>
            ): (
                <div>
                    <input 
                    type='text'
                    value={boardTitle}
                    onChange={(e)=> setBoardTitle(e.target.value)}/>
                    <button onClick={submitHandler}>Add</button>
                </div>
            )}
            
        </div>
    )
}


export default CreateBoard