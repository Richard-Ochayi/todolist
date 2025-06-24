"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "sonner";


export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if(!token) {
            setMessage("Invalid or missing token.");
            return;
        }

        if (!password.trim()) {
            setMessage("Please enter a new password");
            return;
        }

        setLoading(true);
        setMessage("");

        const res = await fetch("/api/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password }),
        });

        const data = await res.json();
        console.log("Reset password response:", data);

        if (res.ok) {
            toast.success("Password reset successfully. You can now log in.");
            redirect("/login")
        } else {
            setMessage(data.error || "Something went wrong");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <form className="bg-white shadow-md rounded-md px-8 pt-6 pb-8 w-full max-w-sm" onSubmit={(e) => { e.preventDefault(); handleReset(); }}>
                <h1 className="text-2xl font-bold mb-5 text-center">Reset Your Password</h1>
                <label htmlFor="password" className="block text-gray-700 mb-2">
                    Enter your new password 
                </label>
                {!token ? (
                    <p>Invalid or missing reset token.</p>
                ) : (
                    <div>
                        <Input
                            type="password"
                            placeholder="New Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                            {loading ? "Resetting..." : "Reset Password"}
                        </Button>
                        {message && <p>{message}</p>}
                    </div>
                )}

            </form>
        </div>
    )
}