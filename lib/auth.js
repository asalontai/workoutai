import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "./db"
import { compare } from "bcrypt";

export const authOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXT_AUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/sign-in",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        CredentialsProvider({
            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials.email || !credentials.password) {
                    return null;
                }

                const exisitingUser = await db.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!exisitingUser) {
                    return null;
                }

                if (exisitingUser.password) {
                    const passwordMatch = await compare(credentials.password, exisitingUser.password);

                    if (!passwordMatch) {
                        return null;
                    } 
                } else {
                    return null
                }


                return {
                    id: `${exisitingUser.id}`,
                    username: exisitingUser.username,
                    email: exisitingUser.email
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.email = token.email;
                session.user.username = token.username;
            }
            console.log(session);
            return session;
        },
    }
}