import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new NextResponse("Webhook signature verification failed", {
        status: 400,
      });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Call your backend API to update subscription status
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions/activate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
            },
            body: JSON.stringify({
              organizationId: session.client_reference_id,
              subscriptionId: session.subscription,
              customerId: session.customer,
            }),
          }
        );
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        // Call your backend API to update subscription status
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions/update`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
            },
            body: JSON.stringify({
              subscriptionId: subscription.id,
              status: subscription.status,
              currentPeriodEnd: subscription.current_period_end,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            }),
          }
        );
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        // Call your backend API to handle subscription cancellation
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions/cancel`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
            },
            body: JSON.stringify({
              subscriptionId: subscription.id,
            }),
          }
        );
        break;
      }
    }

    return new NextResponse("Webhook processed successfully", { status: 200 });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
