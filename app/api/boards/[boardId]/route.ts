// TO FETCH BOARD/ID (EVERYTHING INCLUDED CARDS LISTS)

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import client from "@/db"


export async function GET(req: NextRequest){
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({
            msg: "Unauthorized - No valid session user"
        }, { status: 401 })
    }
    
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


export async function POST(req: NextRequest){
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({
            msg: "Unauthorized - No valid session user"
        }, { status: 401 })
    }

    const userId = session.user.id ? parseInt(session.user.id) : undefined;

    if(!userId){
        return NextResponse.json({
            msg: "Unauthorized - No valid session user"
        }, { status: 401 })
    }

    try{
        const url = new URL(req.url);
        const boardId = parseInt(url.pathname.split('/').pop() || '', 10);

        const {email} = await req.json();

        const user = await client.user.findUnique({
            where: {
                email: email
            }
        });

        if(!user){
            return NextResponse.json({
                msg: 'user not found'
            }, {status: 404})
        }

        const board = await client.board.update({
            where: {
                id: boardId
            },
            data: {
                members: {
                    connect: {
                        id: user.id
                    }
                }
            },
            include: {
                members: true  //include members to send complete data for members update via socket emit
            }
        });

        io?.emit("boardMembers", board);
        console.log("Emitted from post route for members:", board)

        return NextResponse.json(board);
    }
    catch(error){
        return NextResponse.json({
            msg: `Error updating members: ${error}`
        })
    }
}