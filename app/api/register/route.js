import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, username, password } = body;

        const exisitingUserByEmail = await db.user.findUnique({
            where: { email: email }
        });

        if (exisitingUserByEmail) {
            return NextResponse.json({ user: null, message: "User with this email already exists"}, { status: 409 })
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                isCredential: true
            }
        });

        const { password: newUserPassword, ...rest } = newUser;

        return NextResponse.json({ user: newUser, message: "User created successfylly." }, { status: 201 })
    } catch(err) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
    }
}