import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { metadata?: { quoteId?: string }; payment_intent?: string };
    const quoteId = session.metadata?.quoteId;
    if (quoteId) {
      await prisma.quote.update({
        where: { id: quoteId },
        data: {
          depositPaid: true,
          depositPaymentIntentId: session.payment_intent as string,
          status: "deposit_paid",
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
