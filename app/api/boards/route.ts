import { NextRequest, NextResponse } from "next/server";
import client from "@/db"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";



export async function POST(req: NextRequest) {
    const { name, members, list } = await req.json();

    try {
        const existingUsers = await client.user.findMany({
            where: {
                id: {in: members}
            }
        });

        if(existingUsers.length !== members.length){
            return NextResponse.json({
                msg: "One or more users do not exist"
            }, {status: 400})
        }
        
        const board = await client.board.create({
            data: {
                name: name,
                members: {
                    connect: members.map((memberId: Number) => ({ id: memberId }))
                },
                list: {
                    create: list.map((list: any) => ({
                        name: list.name,
                        cards: {
                            create: list.cards.map((card: any) => ({
                                title: card.title
                            }))
                        }
                    }))
                }
            },
            include: {
                members: true,
                list: { include: { cards: true } }
            }
        });

        return NextResponse.json({
            board: board
        });
    }
    catch(error){
        return NextResponse.json({
            msg: `Failed to create board: ${error}`
        })
    }
}


export async function GET(){
    const session = await getServerSession(authOptions);

    const userId = session.user.id ? parseInt(session.user.id): undefined;
    
    try{
        const boards = await client.board.findMany({
            where: {
                members: {
                    some: {
                        id: userId
                    }
                }
            },
            include: {
                members: true,
                list: { include: {cards: true}}
            }
        });

        return NextResponse.json(
            boards
        );

    }
    catch(error){
        return NextResponse.json({
            msg: `error fetching boards: ${error}`
        })
    }
}