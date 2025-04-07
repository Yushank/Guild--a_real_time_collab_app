import CredentialsProvider from "next-auth/providers/credentials";
import client from "@/db"
// import { JWT } from "next-auth/jwt";
import bcrypt from 'bcrypt'
// import { User } from "@/app/types";
import { NextAuthOptions } from "next-auth";


export const authOptions : NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "peter@gmail.com" },
                password: { label: "Password", type: "password", placeholder: "password" }
            },
            async authorize(credentials): Promise<{ id: string } | null> {
                if(!credentials) return null
                
                const user = await client.user.findFirst({
                    where: {
                        email: credentials.username
                    }
                })

                if(!user){
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (isPasswordValid) {
                    return { id: String(user.id) }; 
                }

                return null
            }
        })
    ],
    

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.uid = user.id;
            }
            return token;
        },

        session: async ({ session, token }) => {
            if (session.user) {
                session.user.id = token.uid as string;
            }
            return session;
        }
    },

    pages: {
        signIn: '/signin'
    }
}


//the callback functions here works similar to what middleware does in react apps for authentification
//if we call session in any part to verfiy if the user is logged in to access certain routes
//then these callbacks are called at that time and they verify with jwt to see if the jwt.id = user.id
//and then id is passed to session which will be used in other routes