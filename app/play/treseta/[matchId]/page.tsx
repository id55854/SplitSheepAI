import { notFound } from "next/navigation";
import { store } from "@/lib/store";
import { TresetaTable } from "@/components/game/treseta-table";
import type { MatchState } from "@/lib/treseta/state";

export default async function TresetaMatch({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const m = store.getMatch(matchId);
  if (!m) notFound();
  return <TresetaTable matchId={matchId} initialState={m.state as MatchState} />;
}
