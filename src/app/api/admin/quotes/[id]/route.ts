import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const quote = await prisma.quote.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json(quote);
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const quote = await prisma.quote.findUnique({ where: { id: params.id } });
  if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(quote);
}
