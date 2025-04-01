// TO POST AND FETCH BOARDS

import { NextRequest, NextResponse } from "next/server";
import client from "@/db"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { io } from "@/lib/server";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({
            msg: "Unauthorized - No valid session user"
        }, { status: 401 })
    }

    const userId = parseInt(session.user.id, 10)
    console.log("User ID:", userId);

    if (!userId) {
        return NextResponse.json({
            msg: "Unauthorised"
        }, { status: 401 })
    }

    const { name, members = [] } = await req.json();

    try {
        const existingUsers = await client.user.findMany({
            where: {
                id: { in: members }
            }
        }); //matches the users and members and get the number

        if (existingUsers.length !== members.length) {
            return NextResponse.json({
                msg: "One or more users do not exist"
            }, { status: 400 })
        }  //then match that number with the number of members provided, if not matched return

        const board = await client.board.create({
            data: {
                name: name,
                members: {
                    connect: [...members.map((memberId: number) => ({ id: memberId })), { id: userId }]
                }
            },
            include: {
                members: true,
            }
        });

        io.emit("board", board);  //broadcast board

        return NextResponse.json({
            board
        });
    }
    catch (error) {
        return NextResponse.json({
            msg: `Failed to create board: ${error}`
        })
    }
}


export async function GET() {
    const session = await getServerSession(authOptions);

    const userId = session.user.id ? parseInt(session.user.id) : undefined;

    try {
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
                list: { include: { cards: true } }
            }
        });

        return NextResponse.json(
            boards
        );

    }
    catch (error) {
        return NextResponse.json({
            msg: `error fetching boards: ${error}`
        })
    }
}