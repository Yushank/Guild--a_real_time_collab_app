import { signupInput } from "@/schemas/userSchema";
import { NextRequest, NextResponse } from "next/server";
import client from "@/db"
import bcrypt from 'bcrypt'


export async function POST(req: NextRequest){
    const body = await req.json();

    try{
        const parsePayload = signupInput.safeParse(body);

        if(!parsePayload){
            return NextResponse.json({
                message: "Invalid Inputs"
            })
        }

        const isUserExist = await client.user.findFirst({
            where: {
                email: body.email,
            }
        })

        if(isUserExist){
            return NextResponse.json({
                message: "User already exist"
            })
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);
        const user = await client.user.create({
            data: {
                email: body.email,
                firstName: body.firstName,
                lastName: body.lastName,
                password: hashedPassword
            }
        })

        console.log("user created:", user)

        return NextResponse.json({
            message: "Signup successfull",
            username: body.email
        })
    }
    catch(error){
        return NextResponse.json({
            message: `Error while signing up : ${error}`
        })
    }
}