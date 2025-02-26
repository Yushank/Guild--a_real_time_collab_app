import { NextRequest, NextResponse } from "next/server";
import client from '@/db'
import { Id } from "@/app/types";
import { Cards, Prisma } from "@prisma/client";


export async function PUT(req: NextRequest){
    try{
        const {cards} : {cards: {id: number; order: number; listId: number}[]} = await req.json();
        console.log("recieved udpated order cards:", cards);

        const listGroups = new Map<number, any[]>();

        cards.forEach(card => {
            if(!listGroups.has(card.listId)){
                listGroups.set(card.listId, []);
            }
            listGroups.get(card.listId)!.push(card);
        });


        // const udpateQueries = cards.map((card)=>
        //     client.cards.update({
        //         where: {
        //             id: card.id
        //         },
        //         data: {
        //             order: card.order,
        //             listId: card.listId
        //         }
        //     })
        // );

        const updateQueries: Prisma.Prisma__CardsClient<Cards>[] = [];

        for (const [listId, listCards] of listGroups){
            const sorted = listCards.sort((a, b) => a.order - b.order);

            sorted.forEach((card, index) => {
                updateQueries.push(client.cards.update({
                    where: {
                        id: card.id
                    },
                    data: {
                        order: index,
                        listId: listId
                    }
                }))
            })
        }

        await client.$transaction(updateQueries); //run all the udpate at once

        return NextResponse.json({
            msg: "Card order updated successfully"
        })
    }
    catch(error){
        console.error("Error updating card order:", error)
        return NextResponse.json({
            msg: `Failed to udpate card order: ${error}`
        }, {status: 500})
    }
}