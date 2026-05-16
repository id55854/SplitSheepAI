import { redirect } from "next/navigation";
import { getCurrentGuest } from "@/lib/guest";
import { store } from "@/lib/store";
import { createMatch } from "@/lib/treseta/state";

export default async function StartTreseta() {
  const user = await getCurrentGuest();
  if (!user) redirect("/play");
  const id = "tre_" + store.newId();
  const state = createMatch(`${id}-${Date.now()}`);
  store.saveMatch({
    id,
    createdAt: new Date().toISOString(),
    playerId: user!.id,
    state,
  });
  redirect(`/play/treseta/${id}`);
}
