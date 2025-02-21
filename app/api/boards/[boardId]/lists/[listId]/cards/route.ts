// TO POST CARDS (THIS ADD CARDS TO LIST)

import { NextRequest, NextResponse } from "next/server";
import client from '@/db'
import { io } from "@/lib/server";


export async function POST(req: NextRequest){
    const {content, listId} = await req.json();
    console.log("Recieved data", {content, listId})

    try{
        const card = await client.cards.create({
            data: {
                content: content,
                listId: listId
            }
        });

        console.log("Emitting websocket event: card", card)
        io.emit("card", card);

        return NextResponse.json({
            card
        });
    }
    catch(error){
        return NextResponse.json({
            msg: `Failed to create card: ${error}`
        })
    }
}

export async function GET(req: NextRequest, {params}: {params: {listId: string}}){
    try{

        if(!params.listId){
            return NextResponse.json({
                msg: "board id and list id is required"
            }, {status: 400})
        }

        const listId = parseInt((await params).listId)
        const cards = await client.cards.findMany({
            where:{
                listId: listId
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        return NextResponse.json(cards);
    }catch(error){
        console.error("Error fetching cards:", error);
        return NextResponse.json({
            msg: `Failed to fetch cards: ${error}`
        }, {status: 500})
    }
}