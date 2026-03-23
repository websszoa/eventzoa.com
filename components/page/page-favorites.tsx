"use client";

import { useEffect, useState } from "react";
import { Bookmark, Heart, Share2, MessageSquareMore, type LucideIcon } from "lucide-react";
import { useAuth } from "@/contexts/context-auth";
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/lib/types";
import PageLogin from "@/components/page/page-login";
import PageNoData from "@/components/page/page-no-data";
import EventListCard from "@/components/event/event-list-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const supabase = createClient();

type EventTable = "event_favorites" | "event_likes" | "event_shares" | "event_comments";

function useEventIds(table: EventTable, userId: string | undefined) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsFetching(false);
      return;
    }

    const fetchData = async () => {
      setIsFetching(true);

      const { data: rows, error } = await supabase
        .from(table)
        .select("event_id, created_at")
        .order("created_at", { ascending: false });

      if (error || !rows?.length) {
        setEvents([]);
        setIsFetching(false);
        return;
      }

      // 중복 제거 (댓글은 같은 이벤트에 여러 개 가능)
      const uniqueIds = [...new Map(rows.map((r) => [r.event_id, r])).values()].map(
        (r) => r.event_id
      );

      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .in("id", uniqueIds);

      const map = new Map((eventsData ?? []).map((e: Event) => [e.id, e]));
      setEvents(uniqueIds.map((id) => map.get(id)).filter(Boolean) as Event[]);
      setIsFetching(false);
    };

    fetchData();
  }, [userId, table]);

  return { events, isFetching };
}

function TabCount({ count, loading }: { count: number; loading: boolean }) {
  if (loading) return null;
  return <span className="text-xs text-muted-foreground">({count})</span>;
}

function TabPanel({
  loading,
  events,
  emptyIcon,
  emptyTitle,
  emptyDesc,
}: {
  loading: boolean;
  events: Event[];
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDesc: string;
}) {
  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground font-anyvid">
        불러오는 중입니다.
      </div>
    );
  }
  if (events.length === 0) {
    return <PageNoData icon={emptyIcon} title={emptyTitle} description={emptyDesc} />;
  }
  return <EventListCard events={events} />;
}

export default function PageFavorites() {
  const { user, isLoading } = useAuth();
  const { events: favorites, isFetching: fetchingFav } = useEventIds("event_favorites", user?.id);
  const { events: likes, isFetching: fetchingLike } = useEventIds("event_likes", user?.id);
  const { events: shares, isFetching: fetchingShare } = useEventIds("event_shares", user?.id);
  const { events: comments, isFetching: fetchingComment } = useEventIds("event_comments", user?.id);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 py-16 px-6 text-center">
        <p className="text-sm text-muted-foreground font-anyvid">불러오는 중입니다.</p>
      </div>
    );
  }

  if (!user) {
    return <PageLogin />;
  }

  return (
    <Tabs defaultValue="favorites" className="space-y-4">
      <div className="flex justify-center">
      <TabsList>
        <TabsTrigger value="favorites" className="gap-1.5 font-anyvid">
          <Bookmark className="h-3.5 w-3.5" />
          즐겨찾기
          <TabCount count={favorites.length} loading={fetchingFav} />
        </TabsTrigger>
        <TabsTrigger value="likes" className="gap-1.5 font-anyvid">
          <Heart className="h-3.5 w-3.5" />
          좋아요
          <TabCount count={likes.length} loading={fetchingLike} />
        </TabsTrigger>
        <TabsTrigger value="shares" className="gap-1.5 font-anyvid">
          <Share2 className="h-3.5 w-3.5" />
          공유하기
          <TabCount count={shares.length} loading={fetchingShare} />
        </TabsTrigger>
        <TabsTrigger value="comments" className="gap-1.5 font-anyvid">
          <MessageSquareMore className="h-3.5 w-3.5" />
          댓글
          <TabCount count={comments.length} loading={fetchingComment} />
        </TabsTrigger>
      </TabsList>
      </div>

      <TabsContent value="favorites">
        <TabPanel
          loading={fetchingFav}
          events={favorites}
          emptyIcon={Bookmark}
          emptyTitle="아직 저장된 즐겨찾기가 없습니다."
          emptyDesc="관심 있는 이벤트를 추가해보세요!"
        />
      </TabsContent>

      <TabsContent value="likes">
        <TabPanel
          loading={fetchingLike}
          events={likes}
          emptyIcon={Heart}
          emptyTitle="아직 좋아요한 이벤트가 없습니다."
          emptyDesc="마음에 드는 이벤트에 좋아요를 눌러보세요!"
        />
      </TabsContent>

      <TabsContent value="shares">
        <TabPanel
          loading={fetchingShare}
          events={shares}
          emptyIcon={Share2}
          emptyTitle="아직 공유한 이벤트가 없습니다."
          emptyDesc="이벤트를 친구에게 공유해보세요!"
        />
      </TabsContent>

      <TabsContent value="comments">
        <TabPanel
          loading={fetchingComment}
          events={comments}
          emptyIcon={MessageSquareMore}
          emptyTitle="아직 댓글을 작성한 이벤트가 없습니다."
          emptyDesc="이벤트에 리뷰를 남겨보세요!"
        />
      </TabsContent>
    </Tabs>
  );
}
