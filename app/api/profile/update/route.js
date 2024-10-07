import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
    const session = await getServerSession(authOptions)

    console.log("Session", session.user.email)

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json()
    const { name, username, image } = body;

    console.log("Update Request Body:", body);

    try {
        const updatedUser = await db.user.update({
            where: { email: session.user.email },
            data: {
                name: name,
                username: username,
                image: image,
            },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ message: "Error updating profile" }, { status: 500 });
    }
}