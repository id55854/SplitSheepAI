import { store } from "@/lib/store";
import { getCurrentGuest } from "@/lib/guest";
import { EventsView } from "@/components/map/events-view";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const user = await getCurrentGuest();
  const events = store.listEvents();
  return <EventsView initialEvents={events} userId={user?.id ?? null} />;
}
