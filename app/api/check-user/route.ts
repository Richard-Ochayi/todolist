import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required "}, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ exists: false });
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        return NextResponse.json({ exists: passwordMatch});
    } catch (error) {
        return NextResponse.json({ error: "Server error "}, { status: 500 });
    }
}