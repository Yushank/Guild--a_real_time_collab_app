"use client"

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";



export default function(){
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div >
            <div>
                SignIn
            </div>
            {/* INPUTS */}
            <div>
                <LabelledInput
                label="Username"
                type="text"
                placeholder="peter@gmail.com"
                onChange={(e) => setUsername(e.target.value)}
                ></LabelledInput>
                <LabelledInput
                label="Password"
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                ></LabelledInput>

                <button
                type="button"
                onClick={async()=>{
                    
                    const res = await signIn("credentials", {
                        username,
                        password,
                        redirect: false,
                    })
                    console.log(res);
                    router.push("/home")
                }}
                >sign in</button>
            </div>
        </div>
    )
}


interface LabelledInputType {
    label: string,
    type: string,
    placeholder: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
}


function LabelledInput ({label, type, placeholder, onChange}: LabelledInputType){
    return (
        <div>
            <label>{label}</label>;
            <input type={type} placeholder={placeholder} onChange={onChange} />
        </div>
    )
}