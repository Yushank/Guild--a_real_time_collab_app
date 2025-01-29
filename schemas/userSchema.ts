import { z } from "zod"


export const signupInput = z.object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string().min(6)
}) 

export type signupInput = z.infer<typeof signupInput>;