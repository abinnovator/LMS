import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("Stripe-Signature") as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return new Response("Webhook Error", { status: 400 });
  }

  try {
    const session = event.data.object as Stripe.Checkout.Session;
    if (
      event.type === "checkout.session.completed" &&
      session.payment_status === "paid"
    ) {
      const courseId = session.metadata?.courseId;
      const enrollmentId = session.metadata?.enrollmentId;
      const customerId = session.customer as string;

      if (!courseId || !enrollmentId) {
        console.error("Missing metadata:", { courseId, enrollmentId });
        return new Response("Missing metadata", { status: 400 });
      }

      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId },
      });
      if (!user) {
        console.error("User not found for stripeCustomerId:", customerId);
        return new Response("User not found", { status: 400 });
      }

      await prisma.enrollment.update({
        where: { id: enrollmentId },
        data: {
          userId: user.id,
          courseId: courseId,
          amount: session.amount_total as number,
          status: "Active",
        },
      });
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }

  return new Response(null, { status: 200 });
}
