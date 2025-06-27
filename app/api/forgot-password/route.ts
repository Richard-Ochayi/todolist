import { Resend } from "resend";
import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ success: true });
        }


        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpires = new Date(Date.now() + 1000 * 60 * 60);

        await prisma.passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt: tokenExpires,
            }
        })

        const  resetUrl = `https://richardtodoapp.site/reset-password?token=${token}`;

        await resend.emails.send({ 
            from: "Todolist App <onboarding@resend.dev>",
            to: [email],
            subject: "Reset your password",
            html: `<p>Click the link below to reset your password:</p>
            <a href="${resetUrl}">${resetUrl}</a>`,
        });

        return NextResponse.json({ succes: true });
    } catch (error) {
        console.error("Reset error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}