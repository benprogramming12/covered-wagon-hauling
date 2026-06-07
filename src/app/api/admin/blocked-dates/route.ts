import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const dates = await prisma.blockedDate.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json(dates);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date, reason } = await req.json();
  if (!date) return NextResponse.json({ error: "Date required" }, { status: 400 });

  const blocked = await prisma.blockedDate.upsert({
    where: { date },
    update: { reason },
    create: { date, reason },
  });
  return NextResponse.json(blocked);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date } = await req.json();
  await prisma.blockedDate.deleteMany({ where: { date } });
  return NextResponse.json({ success: true });
}
