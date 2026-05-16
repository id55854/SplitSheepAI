import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/guest";
import { store, type Kvart } from "@/lib/store";

const Body = z.object({
  displayName: z.string().min(1).max(32),
  kvart: z
    .enum(["Veli Varoš", "Lučac", "Manuš", "Bačvice", "Varoš", "drugdi"])
    .nullable()
    .optional(),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "bad_input" }, { status: 400 });
  }
  const { displayName, kvart } = parsed.data;
  const session = await getSession();
  // Mint a stable uid the cookie carries from now on.
  if (!session.uid) session.uid = store.newId();
  session.displayName = displayName;
  session.kvart = (kvart as Kvart | null) ?? null;
  session.createdAt = session.createdAt ?? new Date().toISOString();
  await session.save();
  // Best-effort: also seed an in-memory User entry on whichever instance
  // handled this request so legacy lookups work. The cookie remains the
  // source of truth.
  store.createGuestWithId(session.uid, displayName, (kvart as Kvart | null) ?? null);
  return NextResponse.json({
    ok: true,
    user: {
      id: session.uid,
      displayName,
      kvart: kvart ?? null,
      isGuest: true,
      createdAt: session.createdAt,
    },
  });
}
