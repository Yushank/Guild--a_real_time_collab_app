// TO POST CARDS (THIS ADD CARDS TO LIST)

import { NextRequest, NextResponse } from "next/server";
import client from '@/db'


export async function POST(req: NextRequest){
    const {content, listId} = await req.json();

    try{
        const card = await client.cards.create({
            data: {
                content: content,
                listId: listId
            }
        });

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