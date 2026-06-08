import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const blocks = await prisma.recurringBlock.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(blocks);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { label, daysOfWeek, pattern, startDate, endDate } = await req.json();
  if (!label || !daysOfWeek || !startDate) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const block = await prisma.recurringBlock.create({
    data: { label, daysOfWeek, pattern, startDate, endDate: endDate || null },
  });

  return NextResponse.json(block);
}
