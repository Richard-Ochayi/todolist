import prisma from "@/lib/db";
import { HashPassword } from "@/lib/utils";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: "Missing token or password" }, { status: 400 });
        }

        const record = await prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!record || record.expiresAt < new Date()) {
            console.log("Token is invalid or expired")
            return NextResponse.json({ error: "Token is invalid or expired" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: record.userId },
            data: { passwordHash: hashedPassword },
        });

        const updateUser = await prisma.user.findUnique({ where: { id:record.userId } });
        console.log("Updated user passwordHash:", updateUser?.passwordHash);


        await prisma.passwordResetToken.delete({
            where: { token },
        });
        console.log("Password reset complete, token deleted");
        
        return NextResponse.json({ succes: true });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}