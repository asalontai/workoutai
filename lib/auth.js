import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "./db"
import { compare } from "bcrypt";
import Stripe from "stripe";

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
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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

                if (exisitingUser.isCredential === false || exisitingUser.isCredential === null) {
                    return null
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
                    name: exisitingUser.name,
                    email: exisitingUser.email
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.name = user.name
                token.email = user.email;
                token.id = user.id;
                token.stripeCustomerId = user.stripeCustomerId;
                token.isActive = user.isActive;
                token.isCredential = user.isCredential
            }
            const dbUser = await db.user.findUnique({ where: { id: token.id } });
            if (dbUser) {
                token.name = dbUser.name
                token.email = dbUser.email;
                token.id = dbUser.id;
                token.stripeCustomerId = dbUser.stripeCustomerId;
                token.isActive = dbUser.isActive;
                token.isCredential = dbUser.isCredential
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.name = token.name
                session.user.email = token.email;
                session.user.id = token.id;
                session.user.stripeCustomerId = token.stripeCustomerId;
                session.user.isActive = token.isActive;
                session.user.isCredential = token.isCredential;
            }
            console.log(session);
            return session;
        },
        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
    },
    events: {
        createUser: async ({ user }) => {
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
                apiVersion: "2024-06-20"
            });

            await stripe.customers.create({
                email: user.email,
            })
            .then(async (customer) => {
                return db.user.update({
                    where: { id: user.id },
                    data: {
                        stripeCustomerId: customer.id,
                    }
                })
            })
        }
    }
}