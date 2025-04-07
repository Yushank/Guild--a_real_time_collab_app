import { NextRequest, NextResponse } from "next/server";
import client from '@/db'
import { Cards, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CardUpdate } from "@/app/types";


export async function PUT(req: NextRequest) {
    const body = await req.json();

    //UPDATE CARD ORDER ROUTE FUNCTION
    if (body.type === "updateCardOrder") {
        try {
            const { cards }: { cards: { id: number; order: number; listId: number }[] } = body;
            console.log("recieved udpated order cards:", cards);

            const listGroups = new Map<number, CardUpdate[]>();

            cards.forEach(card => {
                if (!listGroups.has(card.listId)) {
                    listGroups.set(card.listId, []);
                }
                listGroups.get(card.listId)!.push(card);
            });

            const updateQueries: Prisma.Prisma__CardsClient<Cards>[] = [];

            for (const [listId, listCards] of listGroups) {
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
        catch (error) {
            console.error("Error updating card order:", error)
            return NextResponse.json({
                msg: `Failed to udpate card order: ${error}`
            }, { status: 500 })
        }
    }

    //UPDATE CARD CONTENT ROUTE FUNCTION
    if(body.type === "updateCardContent"){
        try{
            const {id, content} = body;
            console.log("updating card id received:", id);
            console.log("updating card content received:", content);

            const card = await client.cards.update({
                where:{
                    id: id
                },
                data: {
                    content: content
                }
            });

            console.log("updated card:", card);
            io?.emit("updatedCardContent", card);

            return NextResponse.json({
                msg: "Card content updated successfully"
            })
        }
        catch(error){
            console.error("Error updating card content", error);
            return NextResponse.json({
                msg: "failed to update card content"
            }, {status: 500})
        }
    }
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id ? parseInt(session.user.id) : undefined;

    if (!userId) {
        return NextResponse.json({
            msg: 'unauthorised'
        })
    }

    try {
        const { id } = await req.json();

        await client.cards.delete({
            where: {
                id: id
            }
        });

        console.log("card deleted");
        return NextResponse.json({
            msg: "Card deleted successfully"
        })
    } catch (error) {
        console.error("error deleting card:", error)
        return NextResponse.json({
            msg: 'Failed to delete card'
        }, { status: 500 })
    }
}