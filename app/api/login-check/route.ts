import { Resend } from "resend";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) return NextResponse.json({ status: "exists" });

    if (token) {
        const record = await prisma.verificationToken.findUnique({ where: { token } });

        if (!record || record.identifier !== email || record.expires < new Date()) {
            return NextResponse.json({ status: "error", message: "Token invalid or expired" });
        }

        await prisma.verificationToken.delete({ where: { token } });

        return NextResponse.json({ status: "verified" });
    }

    const generatedToken = crypto.randomBytes(16).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.verificationToken.deleteMany({ where: { identifier: email } });

    await prisma.verificationToken.create({
        data: { token: generatedToken, identifier: email, expires },
    });

    const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/login?token=${generatedToken}`;

    await resend.emails.send({
        from: "Todo App <noreply@resend.dev>",
        to: email,
        subject: "Verify your email",
        html: `<p>Click <a href="${loginUrl}">here</a> to verify your email and login.</p>`,
    });

    return NextResponse.json({ status: "Verification_Sent" });
}
