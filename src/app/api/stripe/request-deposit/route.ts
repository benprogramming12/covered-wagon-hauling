import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { sendDepositRequest } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { quoteId, price } = await req.json();

  if (!quoteId || !price || price <= 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
  if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

  const depositAmount = Math.round((price * 0.5) * 100); // cents
  const balanceAmount = price - price * 0.5;

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
  }

  // Create Stripe Checkout Session for deposit with card saved for future use
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Hauling Deposit — Covered Wagon Hauling LLC",
            description: `50% deposit for job on ${quote.scheduledDate} at ${quote.scheduledTime}`,
          },
          unit_amount: depositAmount,
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
    cancel_url: `${process.env.NEXTAUTH_URL}/quote`,
    metadata: { quoteId: quote.id },
  });

  await prisma.quote.update({
    where: { id: quoteId },
    data: {
      price,
      depositAmount: price * 0.5,
      balanceAmount,
      stripeCustomerId: customerId,
      status: "quoted",
    },
  });

  await sendDepositRequest(
    quote.email,
    quote.name,
    checkoutSession.url!,
    price * 0.5,
    quote.scheduledDate
  ).catch(() => {});

  return NextResponse.json({ url: checkoutSession.url });
}
