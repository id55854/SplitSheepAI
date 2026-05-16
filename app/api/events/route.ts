import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireGuest } from "@/lib/guest";
import { store, type GameId } from "@/lib/store";

const GameIds = ["briskula", "treseta", "mora", "pljockanje", "balote", "picigin"] as const;

const Body = z.object({
  gameId: z.enum(GameIds),
  title: z.string().min(2).max(80),
  description: z.string().min(2).max(400),
  startsAt: z.string().min(10),
  lat: z.number().min(43.4).max(43.7),
  lng: z.number().min(16.3).max(16.6),
  locationName: z.string().min(2).max(80),
  capacity: z.number().int().min(2).max(64),
  language: z.enum(["hr", "en", "ck"]),
});

export async function GET() {
  return NextResponse.json({ events: store.listEvents() });
}

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireGuest();
  } catch {
    return NextResponse.json({ error: "no_guest" }, { status: 401 });
  }
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "bad_input", issues: parsed.error.format() },
      { status: 400 }
    );
  }
  const ev = store.createEvent({
    ...parsed.data,
    gameId: parsed.data.gameId as GameId,
    hostId: user.id,
    hostName: user.displayName,
  });
  return NextResponse.json({ event: ev });
}
