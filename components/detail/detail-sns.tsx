import { ExternalLink, Globe, AtSign, BookOpen, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event } from "@/lib/types";

export default function DetailSns({ event }: { event: Event }) {
  const { sns, event_site } = event;

  const links = [
    { label: "공식 사이트", href: event_site, icon: <Globe className="h-4 w-4" />, variant: "outline" as const },
    { label: "카카오", href: sns?.kakao, icon: <AtSign className="h-4 w-4" />, variant: "outline" as const },
    { label: "인스타그램", href: sns?.instagram, icon: <AtSign className="h-4 w-4" />, variant: "outline" as const },
    { label: "블로그", href: sns?.blog, icon: <BookOpen className="h-4 w-4" />, variant: "outline" as const },
    { label: "유튜브", href: sns?.youtube, icon: <Youtube className="h-4 w-4" />, variant: "outline" as const },
  ].filter((l) => l.href?.trim());

  return (
    <div className="detail__sns h-full border border-gray-200 rounded-2xl p-5">
      <h3 className="flex items-center gap-2 font-paperlogy font-semibold text-lg mb-4">
        <ExternalLink className="w-5 h-5 text-brand shrink-0" />
        관련 링크
      </h3>

      {links.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {links.map(({ label, href, icon }) => (
            <Button key={label} variant="outline" size="sm" asChild className="gap-1.5 font-anyvid">
              <a href={href!} target="_blank" rel="noopener noreferrer">
                {icon}
                {label}
                <ExternalLink className="h-3 w-3 opacity-50" />
              </a>
            </Button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground font-anyvid">등록된 링크가 없습니다.</p>
      )}
    </div>
  );
}
