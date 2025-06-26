import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { Resend } from "resend";


const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400});
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" },{ status: 400});
        }

        const otp = generateOTP();

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.otp.upsert({
            where: { email },
            update: {
                code: otp,
                passwordHash: hashedPassword,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            },
            create: {
                email,
                code: otp,
                passwordHash: hashedPassword,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            },
        });

        await resend.emails.send({
            from: "noreply@richardtodoapp.online",
            to: email,
            subject: "Your OTP Code",
            html: `<p> Your OTP Code is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
        });

        return NextResponse.json({ message: "OTP sent" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}