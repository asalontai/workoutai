import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20"
});

const formatAmountForStripe = (amount) => {
    return Math.round(amount * 100)
}

export async function POST(req) {
    const session = await getServerSession(authOptions);

    if (!session.user) {
        return NextResponse.json(
            {
                error: {
                    code: "no-access",
                    message: "You are not signed in.",
                },
            },
            { status: 401 }
        )
    }

    const checkoutSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: session.user.stripeCustomerId,
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Pro Subscription',
                    },
                    unit_amount: formatAmountForStripe(5),
                    recurring: {
                        interval: "month",
                        interval_count: 1,
                    }
                },
                quantity: 1,
            },
        ],
        success_url: `${req.headers.get('origin')}/dashboard/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get('origin')}/dashboard/result?session_id={CHECKOUT_SESSION_ID}`,
        subscription_data: {
            metadata: {
                payingUserId: session.user.id,
            },
        },
    });

    if (!checkoutSession.url) {
        return NextResponse.json(
            {
                error: {
                    code: "stripe-error",
                    message: "Could not create checkout session",
                },
            },
            { status: 500 }
        )
    }

    return NextResponse.json({ session: checkoutSession }, { status: 200 });
}

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams
    const session_id = searchParams.get("session_id")

    try {
        const checkoutSession = await stripe.checkout.sessions.retrieve(session_id)
        console.log('Retrieved session:', checkoutSession);
        return NextResponse.json(checkoutSession)
    } catch(error) {
        console.error("Error retrieving checkout session:", error)
        return NextResponse.json({ error: { message: error.message }}, { status: 500})
    }
}