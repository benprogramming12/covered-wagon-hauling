import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { quoteId, price } = await req.json();

  if (!quoteId || !price || price <= 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
  if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Generate a unique random token if one doesn't exist yet
  const token = quote.paymentToken ?? randomBytes(16).toString("hex");

  await prisma.quote.update({
    where: { id: quoteId },
    data: {
      price,
      depositAmount: price * 0.5,
      balanceAmount: price * 0.5,
      paymentToken: token,
      status: "quoted",
    },
  });

  const paymentUrl = `${process.env.NEXTAUTH_URL}/pay/${token}`;
  return NextResponse.json({ url: paymentUrl, token });
}
