import { store, type GameId } from "@/lib/store";
import { getCurrentGuest } from "@/lib/guest";
import { EventsView } from "@/components/map/events-view";

export const dynamic = "force-dynamic";

const VALID: GameId[] = [
  "briskula",
  "treseta",
  "mora",
  "pljockanje",
  "balote",
  "picigin",
  "alka",
];

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ game?: string }>;
}) {
  const sp = await searchParams;
  const initialFilter = (VALID as string[]).includes(sp.game ?? "")
    ? (sp.game as GameId)
    : "all";
  const user = await getCurrentGuest();
  const events = store.listEvents();
  return (
    <EventsView
      initialEvents={events}
      userId={user?.id ?? null}
      initialFilter={initialFilter}
    />
  );
}
