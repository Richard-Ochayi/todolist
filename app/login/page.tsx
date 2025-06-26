"use client"
import LoginForm from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import React, { FormEvent } from "react";

export default function Login() {
    return (
        <div className="h-screen flex justify-center items-center bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#0d1b2a]">
            <LoginForm />
        </div>

    )
}