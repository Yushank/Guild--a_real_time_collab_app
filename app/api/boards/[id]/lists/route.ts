// TO POST LISTS (THIS ADD LIST TO BOARDS)

import { NextRequest, NextResponse } from "next/server";
import client from '@/db'



export async function POST(req: NextRequest){
    const {name, boardId} = await req.json();

    try{
        const list = await client.list.create({
            data: {
                name: name,
                boardId: boardId
            }
        });

        return NextResponse.json({
            list
        });
    }
    catch(error){
        return NextResponse.json({
            msg: `Failed to create list: ${error}`
        })
    }
}