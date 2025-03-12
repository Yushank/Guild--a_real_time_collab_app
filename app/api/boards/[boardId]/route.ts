// TO FETCH BOARD/ID (EVERYTHING INCLUDED CARDS LISTS)

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import client from "@/db"


export async function GET(req: NextRequest){
    const session = await getServerSession(authOptions);
    const userId = session.user.id ? parseInt(session.user.id) : undefined;

    if(!userId){
        return NextResponse.json({
            msg: "unauthorised"
        }, {status: 401})
    }

    try{
        const url = new URL(req.url);
        const boardId = parseInt(url.pathname.split('/').pop() || '', 10);

        const board = await client.board.findFirst({
            where:{
                id: boardId,
                members: {
                    some: {
                        id: userId
                    }
                }
            },
            include: {
                members: true,
                list: {
                    include: {cards: true}
                }
            }
        });

        if (!board){
            return NextResponse.json({
                msg: "Board not found or access denied"
            }, {status: 403})
        }

        return NextResponse.json({
            board: board
        })
    }
    catch(error){
        return NextResponse.json({
            msg: `error fetching the board: ${error}`
        })
    }
}