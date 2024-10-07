import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const webhookHandler = async (req) => {
    try {
        const buf = await req.text();
        const sig = req.headers.get("stripe-signature");

        let event

        try {
            event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error";

            if (!(err instanceof Error)) console.log(err);
            console.log(`Error message: ${errorMessage}`);

            return NextResponse.json(
                {
                error: {
                    message: `Webhook Error: ${errorMessage}`,
                },
                },
                { status: 400 }
            );
        }

        const subscripton = event.data.object

        switch (event.type) {
            case "customer.subscription.updated":
            case "customer.subscription.created":
                await db.user.update({
                    where: {
                        stripeCustomerId: subscripton.customer
                    },

                    data: {
                        isActive: true
                    }
                })
                break;
            case "customer.subscription.deleted":
                await db.user.update({
                    where: {
                        stripeCustomerId: subscripton.customer
                    },

                    data: {
                        isActive: false
                    }
                })
                break;
            default:
                console.log(`Unhandeled event type: ${event.type}`)
                break;
        }

        return NextResponse.json({ received: true })
    } catch {
        return NextResponse.json(
            {
                error: {
                    message: "Method Not Allowed",
                },
            },
            { status: 405 }
        ).headers.set("Allow", "POST")
    }
}

export { webhookHandler as POST }