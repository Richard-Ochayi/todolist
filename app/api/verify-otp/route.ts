import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
        }

        const otpRecord = await prisma.otp.findUnique({
            where: { email },
        });

        if (
            !otpRecord ||
            otpRecord.code !== code ||
            otpRecord.expiresAt < new Date()
        ) {
            return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
        }

        await prisma.user.create({
            data: {
                email,
                passwordHash: otpRecord.passwordHash,
            },
        });

        await prisma.otp.delete({
            where: { email },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}