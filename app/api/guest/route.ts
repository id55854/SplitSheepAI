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
  const user = store.createGuest(displayName, (kvart as Kvart | null) ?? null);
  const session = await getSession();
  session.uid = user.id;
  await session.save();
  return NextResponse.json({ ok: true, user });
}
