import { NextRequest, NextResponse } from "next/server";
import { requireGuest } from "@/lib/guest";
import { store } from "@/lib/store";
import { createMatch } from "@/lib/briskula/state";

export async function POST(_req: NextRequest) {
  let user;
  try {
    user = await requireGuest();
  } catch {
    return NextResponse.json({ error: "no_guest" }, { status: 401 });
  }
  const id = store.newId();
  const state = createMatch(`${id}-${Date.now()}`);
  store.saveMatch({ id, createdAt: new Date().toISOString(), playerId: user.id, state });
  return NextResponse.json({ id, state });
}
