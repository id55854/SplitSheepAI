import { cookies } from "next/headers";
import { getIronSession, type IronSession, type SessionOptions } from "iron-session";
import { store } from "@/lib/store";

export type GuestSession = {
  uid?: string;
};

const password =
  process.env.SESSION_SECRET ||
  "dev_only_session_secret_change_me_to_a_long_random_value_xxxxx";

export const sessionOptions: SessionOptions = {
  password,
  cookieName: "riva_uid",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getSession(): Promise<IronSession<GuestSession>> {
  return getIronSession<GuestSession>(await cookies(), sessionOptions);
}

export async function getCurrentGuest() {
  const session = await getSession();
  if (!session.uid) return null;
  return store.getUser(session.uid) ?? null;
}

export async function requireGuest() {
  const user = await getCurrentGuest();
  if (!user) throw new Error("no_guest");
  return user;
}
