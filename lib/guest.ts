import { cookies } from "next/headers";
import { getIronSession, type IronSession, type SessionOptions } from "iron-session";
import type { Kvart } from "@/lib/store";

// All identity lives in the cookie itself — portable across serverless
// instances (the in-memory store cannot guarantee the same instance
// handles two consecutive requests in production).
export type GuestSession = {
  uid?: string;
  displayName?: string;
  kvart?: Kvart | null;
  createdAt?: string;
};

export type GuestUser = {
  id: string;
  displayName: string;
  kvart: Kvart | null;
  isGuest: true;
  createdAt: string;
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

export async function getCurrentGuest(): Promise<GuestUser | null> {
  const session = await getSession();
  if (!session.uid || !session.displayName) return null;
  return {
    id: session.uid,
    displayName: session.displayName,
    kvart: session.kvart ?? null,
    isGuest: true,
    createdAt: session.createdAt ?? new Date().toISOString(),
  };
}

export async function requireGuest(): Promise<GuestUser> {
  const user = await getCurrentGuest();
  if (!user) throw new Error("no_guest");
  return user;
}
