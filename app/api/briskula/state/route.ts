import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });
  const m = store.getMatch(id);
  if (!m) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ id, state: m.state });
}
