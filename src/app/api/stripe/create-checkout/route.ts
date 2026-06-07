import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { quoteId } = await req.json();

  const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
  if (!quote || !quote.price || !quote.depositAmount) {
    return NextResponse.json({ error: "Quote not found or not priced" }, { status: 404 });
  }

  if (quote.depositPaid) {
    return NextResponse.json({ error: "Deposit already paid" }, { status: 400 });
  }

  // Create or retrieve Stripe customer
  let customerId = quote.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: quote.email,
      name: quote.name,
      phone: quote.phone,
      metadata: { quoteId: quote.id },
    });
    customerId = customer.id;
    await prisma.quote.update({
      where: { id: quoteId },
      data: { stripeCustomerId: customerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Hauling Deposit — Covered Wagon Hauling LLC",
            description: `50% deposit · ${quote.scheduledDate} at ${quote.scheduledTime} · ${quote.pickupAddress} → ${quote.dropoffAddress}`,
          },
          unit_amount: Math.round(quote.depositAmount * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    payment_intent_data: {
      setup_future_usage: "off_session",
      metadata: { quoteId: quote.id, type: "deposit" },
    },
    success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pay/${quote.paymentToken}`,
    metadata: { quoteId: quote.id },
  });

  return NextResponse.json({ url: session.url });
}
