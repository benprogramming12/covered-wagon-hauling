import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendAdminNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, email, phone,
      pickupAddress, dropoffAddress,
      scheduledDate, scheduledTime,
      cargoDescription, cargoSize, notes,
      paymentPreference,
    } = body;

    if (!name || !email || !phone || !pickupAddress || !dropoffAddress || !scheduledDate || !scheduledTime || !cargoDescription || !cargoSize) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const quote = await prisma.quote.create({
      data: {
        name, email, phone,
        pickupAddress, dropoffAddress,
        scheduledDate, scheduledTime,
        cargoDescription, cargoSize,
        notes: notes || null,
        paymentPreference: paymentPreference || "deposit",
      },
    });

    await sendAdminNotification(quote).catch(() => {});

    return NextResponse.json({ success: true, id: quote.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
