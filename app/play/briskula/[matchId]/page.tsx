import { notFound } from "next/navigation";
import { store } from "@/lib/store";
import { BriskulaTable } from "@/components/game/briskula-table";
import type { MatchState } from "@/lib/briskula/state";

export default async function BriskulaMatch({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const m = store.getMatch(matchId);
  if (!m) notFound();
  return <BriskulaTable matchId={matchId} initialState={m.state as MatchState} />;
}
