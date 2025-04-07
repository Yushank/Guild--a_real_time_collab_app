// TO POST LISTS (THIS ADD LIST TO BOARDS)

import { NextRequest, NextResponse } from "next/server";
import client from '@/db'
import { io } from "@/lib/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";



export async function POST(req: NextRequest) {
    const { name, boardId } = await req.json();

    try {
        const listCount = await client.list.count({
            where: { boardId }
        });

        const list = await client.list.create({
            data: {
                title: name,
                boardId: boardId,
                order: listCount
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

export async function GET(req: NextRequest, { params }: { params: Promise<{ boardId: string }> }) {
    try {
        const boardId = parseInt((await params).boardId)
        console.log("params:", params)
        console.log("board id:", boardId)

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
                order: "asc"
            }
        });
        console.log("fetched lists:", lists)

        return NextResponse.json(lists);
    } catch (error) {
        console.error("Error fetching lists:", error);
        return NextResponse.json({ msg: `Failed to fetch lists: ${error}` }, { status: 500 });
    }
}


export async function PUT(req: NextRequest, { params }: { params: Promise<{ boardId: string }> }) {
    const body = await req.json();
    console.log("Full request body:", body);

    // UPDATE LIST ORDER ROUTE FUNCTION
    if (body.type === "updateListOrder") {
        try {

            const { orderedListIds } = body;
            console.log("ordered list id received:", orderedListIds);
            console.log("params:", params)

            await prisma?.$transaction(
                orderedListIds.map((listId: number, index: number) =>
                    prisma?.list.update({
                        where: {
                            id: listId
                        },
                        data: {
                            order: index
                        }
                    })
                )
            );

            return NextResponse.json({
                msg: "List reordered successfully"
            });
        }
        catch (error) {
            console.error("Error reordering list", error);
            return NextResponse.json({
                msg: "failed to reorder list"
            }, { status: 500 })
        }
    }

    // UPDATE LIST TITLE ROUTE FUNCTION
    if(body.type === "updateListTitle"){
        try{
            const {id, title} = body;
            console.log("updating list id received:", id);
            console.log("updating list title received:", title);

            const list = await client.list.update({
                where: {
                    id: id
                }, 
                data: {
                    title: title
                }
            });

            console.log("updated list:", list);
            io.emit("updatedListTitle", list);
            io.emit("testEvent", { msg: "This is a test emit from PUT route" });

            return NextResponse.json({
                msg: "List title updated successfully"
            })
        }
        catch(error){
            console.error("Error updating list title", error);
            return NextResponse.json({
                msg: "failed to update list title"
            }, {status: 500})
        }
    }   
}


export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id ? parseInt(session.user.id) : undefined;

    if (!userId) {
        return NextResponse.json({
            msg: "unauthorised"
        }, { status: 401 })
    }

    try {
        const { id: listId } = await req.json();
        console.log("List id recieved in delte list route:", listId)

        await client.list.delete({
            where: {
                id: listId
            }
        })

        console.log("List deleted successfully")

        return NextResponse.json({
            msg: "List deleted"
        })
    }
    catch (error) {
        return NextResponse.json({
            msg: `Failed to delete list: ${error}`
        })
    }
}
