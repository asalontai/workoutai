import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/token";
import { NextResponse } from "next/server";

export async function POST(req) {
        console.log("Receiving request...");
        const body = await req.json();
        console.log("Request body:", body);
    
        const { email } = body;
    
        const existingUser = await db.user.findUnique({
            where: { email: email }
        });
    
        if (!existingUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        };

        console.log("Before password reset token")
    
        const passwordResetToken = await generatePasswordResetToken(email);

        console.log("After password reset token")
    
        await sendPasswordResetEmail(
            passwordResetToken.email,
            passwordResetToken.token
        );
    
        return NextResponse.json({ message: "Password reset email sent successfully" }, { status: 201 });
}