"use client"

import { signupInput } from "@/schemas/userSchema";
import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";



export function Auth({ type }: { type: "signup" | "signin" }) {
    const router = useRouter();
    const [postInputs, setPostInputs] = useState<signupInput>({
        email: "",
        firstName: "",
        lastName: "",
        password: ""
    });

    async function sendRequestSignup() {
        try {
            const response = await axios.post("/api/user/signup",
                postInputs
            );

            if (response) {
                await signIn("credentials", {
                    username: postInputs.email,
                    password: postInputs.password,
                    redirect: false
                });
                router.push("/")
            } else {
                console.error("Signup failed")
            }

        }
        catch (error) {
            alert("error while signing up");
            console.log(error)
        }
    }

    async function sendRequestSignin() {
        try {
            const res = await signIn("credentials", {
                username: postInputs.email,
                password: postInputs.password,
                redirect: false,
            })
            console.log("Sign-in response:", res);

            // Check if authentication failed
            if (res?.error) {
                alert("Not registered or Invalid input");
                return;
            }

            // Only redirect if authentication is successful
            router.push("/boards");
        }
        catch (error) {
            alert("error while singing in");
            console.log(error)
        }
    }

    return (
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                    <div className="px-10">
                        <div className="text-3xl font-extrabold text-center">
                            {type === "signup" ? "Create and account" : "Sign in"}
                        </div>
                        <div className="text-center text-slate-400">
                            {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                            <Link className="pl-2 underline" href={type === "signin" ? "/signup" : "/signin"}>
                                {type === "signin" ? "Sign up" : "Sign in"} </Link>
                        </div>
                    </div>

                    <div className="pt-4">
                        <LabelledInput
                            label="Email"
                            type="text"
                            placeholder="peter@gmail.com"
                            onChange={(e) => setPostInputs({
                                ...postInputs,
                                email: e.target.value
                            })}
                        ></LabelledInput>

                        {type === "signup" ? (<LabelledInput
                            label="First Name"
                            type="text"
                            placeholder="Peter"
                            onChange={(e) => setPostInputs({
                                ...postInputs,
                                firstName: e.target.value
                            })}
                        ></LabelledInput>) : null}
                        {type === "signup" ? (<LabelledInput
                            label="Last Name"
                            type="text"
                            placeholder="Parker"
                            onChange={(e) => setPostInputs({
                                ...postInputs,
                                lastName: e.target.value
                            })}
                        ></LabelledInput>) : null}
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
                        onClick={type === "signup" ? sendRequestSignup : sendRequestSignin}
                        type="button"
                        className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                    >{type === "signup" ? "Sign up" : "Sign in"}</button>
                </div>
            </div>
        </div>
    )
}


interface LabelledInputType {
    label: string,
    type: string,
    placeholder: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

function LabelledInput({ label, type, placeholder, onChange }: LabelledInputType) {
    return (
        <div>
            <label>{label}</label>
            <input type={type} placeholder={placeholder} onChange={onChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
        </div>
    )
}