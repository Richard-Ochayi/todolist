"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";


export default function VerifyOtpPage() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code: otp }), 
        });

        const data = await res.json();

        if (data.success) {
            toast.success("OTP verified! You can now log in.");
            router.push("/login");
        } else {
            toast.error(data.error || "OTP verification failed.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#0d1b2a]">
            <form onSubmit={handleVerify} className="p-6 bg-white rounded-md max-w-sm mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-semibold text-center">Verify Your Email</h2>
      <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
      <Button type="submit" disabled={loading} className="w-full bg-[#334155] text-white hover:bg-[#1e293b]">
        {loading ? "Verifying..." : "Verify"}
      </Button>
    </form>
        </div>
    )
}