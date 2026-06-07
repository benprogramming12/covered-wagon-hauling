import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { quoteId } = await req.json();
  const quote = await prisma.quote.findUnique({ where: { id: quoteId } });

  if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!quote.depositPaid) return NextResponse.json({ error: "Deposit not yet paid" }, { status: 400 });
  if (quote.balancePaid) return NextResponse.json({ error: "Balance already collected" }, { status: 400 });
  if (!quote.stripeCustomerId || !quote.balanceAmount) {
    return NextResponse.json({ error: "Missing payment info" }, { status: 400 });
  }

  // Get saved payment method from customer
  const paymentMethods = await stripe.paymentMethods.list({
    customer: quote.stripeCustomerId,
    type: "card",
  });

  if (!paymentMethods.data.length) {
    return NextResponse.json({ error: "No saved payment method found" }, { status: 400 });
  }

  const paymentMethodId = paymentMethods.data[0].id;
  const balanceCents = Math.round(quote.balanceAmount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: balanceCents,
    currency: "usd",
    customer: quote.stripeCustomerId,
    payment_method: paymentMethodId,
    off_session: true,
    confirm: true,
    description: `Balance payment — Covered Wagon Hauling — Job ${quote.id}`,
    metadata: { quoteId: quote.id, type: "balance" },
  });

  await prisma.quote.update({
    where: { id: quoteId },
    data: {
      balancePaymentIntentId: paymentIntent.id,
      balancePaid: true,
      status: "completed",
    },
  });

  return NextResponse.json({ success: true });
}
