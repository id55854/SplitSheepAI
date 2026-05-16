import { NextRequest, NextResponse } from "next/server";
import { requireGuest } from "@/lib/guest";
import { store } from "@/lib/store";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let user;
  try {
    user = await requireGuest();
  } catch {
    return NextResponse.json({ error: "no_guest" }, { status: 401 });
  }
  const { id } = await params;
  const ev = store.toggleRsvp(id, user.id);
  if (!ev) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ event: ev });
}
