// TO POST LISTS (THIS ADD LIST TO BOARDS)

import { NextRequest, NextResponse } from "next/server";
import client from '@/db'
import { io } from "@/lib/server";
import { useRouter } from "next/router";



export async function POST(req: NextRequest) {
    const { name, boardId } = await req.json();

    try {
        const list = await client.list.create({
            data: {
                title: name,
                boardId: boardId
            }
        });

        console.log("Emitting websocket event: list", list)
        io.emit("list", list);

        return NextResponse.json({
            list
        });
    }
    catch (error) {
        return NextResponse.json({
            msg: `Failed to create list: ${error}`
        })
    }
}

export async function GET(req: NextRequest, {params}: {params: Promise<{boardId: string}>}) {
    try {
        const boardId = parseInt((await params).boardId)
        console.log("params:", params)
        console.log("board id:",boardId)

        if (!boardId) {
            return NextResponse.json({
                msg: "Board id is required"
            }, { status: 400 })
        }

        const lists = await client.list.findMany({
            where: {
                boardId: boardId
            },
            orderBy: {
                createdAt: "asc"
            }
        });
        console.log("fetched lists:",lists)

        return NextResponse.json(lists);
    } catch (error) {
        console.error("Error fetching lists:", error);
        return NextResponse.json({ msg: `Failed to fetch lists: ${error}` }, { status: 500 });
    }
}