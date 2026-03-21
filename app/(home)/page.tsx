import EventMain from "@/components/event/event-main";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("event_start_at", { ascending: false })
    .limit(500);

  if (error) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 text-muted-foreground">
        <p className="text-sm">이벤트 데이터를 불러오지 못했습니다.</p>
        <p className="text-xs">잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }

  return <EventMain events={events ?? []} />;
}
