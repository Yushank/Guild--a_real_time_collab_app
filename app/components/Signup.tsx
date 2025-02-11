"use client"

import { signupInput } from "@/schemas/userSchema";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";



export function Signup(){
    const router = useRouter();
    const [postInputs, setPostInputs] = useState<signupInput>({
        email: "",
        firstName: "",
        lastName: "",
        password: ""
    });

    async function sendRequest(){
        try{
            const response = await axios.post("/api/user/signup",
                postInputs
            );

            if(response){
                await signIn("credentials", {
                    username: postInputs.email,
                    password: postInputs.password,
                    redirect: false
                });
                router.push("/home")
            }else{
                console.error("Signup failed")
            }
            
        }
        catch(error){
            alert("error while signing up");
            console.log(error)
        }
    }

    return (
        <div>
            <div>Signup</div>
            <div>
                <LabelledInput
                label="Email"
                type="text"
                placeholder="peter@gmail.com"
                onChange={(e) => setPostInputs({
                    ...postInputs,
                    email: e.target.value
                })}
                ></LabelledInput>
                <LabelledInput
                label="First Name"
                type="text"
                placeholder="Peter"
                onChange={(e) => setPostInputs({
                    ...postInputs,
                    firstName: e.target.value
                })}
                ></LabelledInput>
                <LabelledInput
                label="Last Name"
                type="text"
                placeholder="Parker"
                onChange={(e) => setPostInputs({
                    ...postInputs,
                    lastName: e.target.value
                })}
                ></LabelledInput>
                <LabelledInput
                label="Password"
                type="password"
                placeholder="password"
                onChange={(e) => setPostInputs({
                    ...postInputs,
                    password: e.target.value
                })}
                ></LabelledInput>
            </div>

            <button
            onClick={sendRequest}
            type="button"
            >Sign up</button>
        </div>
    )
}


interface LabelledInputType {
    label: string,
    type: string,
    placeholder: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

function LabelledInput({label, type, placeholder, onChange} : LabelledInputType){
    return (
        <div>
            <label>{label}</label>
            <input type={type} placeholder={placeholder} onChange={onChange}/>
        </div>
    )
}