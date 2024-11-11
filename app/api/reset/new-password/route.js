import { db } from "@/lib/db";
import { getPasswordResetTokenByToken } from "@/lib/token-reset";
import { compare, hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {

        const body = await req.json();
    
        const { token, password } = body;
    
        if (!token) {
            return NextResponse.json(
                { error: { code: "missing-token", message: "Token does not exist" } },
                { status: 400 }
            )
        }
    
        const existingToken = await getPasswordResetTokenByToken(token);
    
        if (!existingToken) {
            return NextResponse.json(
                { error: { code: "invalid-token", message: "Token is invalid" } },
                { status: 400 }
            )
        }
    
        const hasExpired = new Date(existingToken.expires) < new Date();
    
        if (hasExpired) {
            return NextResponse.json(
                { error: { code: "expired-token", message: "Token has expired" } },
                { status: 400 }
            )
        }
    
        const existingUser = await db.user.findUnique({
            where: { email: existingToken.email }
        });
    
        if (!existingUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        };
    
        const hashedPassword = await hash(password, 10);

        const isSamePassword = await compare(password, existingUser.password);

        if (isSamePassword) {
            return NextResponse.json({ code: "same-password", message: "New password cannot be the same as the current password" }, { status: 400 });
        }
    
        await db.user.update({
            where: { email: existingUser.email },
            data: { password: hashedPassword },
        });
    
        await db.passwordResetToken.delete({
            where: { id: existingToken.id },
        });
    
        return NextResponse.json({ success: { message: "Password updated!" } }, { status: 200 });
}