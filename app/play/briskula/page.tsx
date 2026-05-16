import { redirect } from "next/navigation";
import { getCurrentGuest } from "@/lib/guest";
import { store } from "@/lib/store";
import { createMatch } from "@/lib/briskula/state";

export default async function StartBriskula() {
  const user = await getCurrentGuest();
  if (!user) {
    // GuestGate handles the modal — just bounce to /play meanwhile.
    redirect("/play");
  }
  const id = store.newId();
  const state = createMatch(`${id}-${Date.now()}`);
  store.saveMatch({
    id,
    createdAt: new Date().toISOString(),
    playerId: user!.id,
    state,
  });
  redirect(`/play/briskula/${id}`);
}
