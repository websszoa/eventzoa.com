import { Calendar, ChevronRight, ChevronDown } from "lucide-react";
import { Badge } from "../ui/badge";
import { notices } from "@/lib/notice";

export default function PageNotice() {
  return (
    <div className="space-y-3">
      {notices.map((notice) => (
        <div
          key={notice.id}
          className="font-nanumNeo cursor-pointer rounded-lg border border-gray-200 px-4 py-4 sm:py-6 sm:px-6 hover:shadow-md transition-all duration-200 hover:border-brand/50"
        >
          <details className="group">
            <summary className="list-none [&::-webkit-details-marker]:hidden [&::marker]:hidden">
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    notice.category === "중요" ? "destructive" : "default"
                  }
                  className="text-xs shrink-0"
                >
                  {notice.category}
                </Badge>
                <h3 className="text-sm text-gray-700 sm:text-base transition-colors flex-1">
                  {notice.title}
                </h3>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand transition-all shrink-0 group-open:hidden" />
                <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-brand transition-all shrink-0 hidden group-open:block" />
              </div>
            </summary>

            <div className="pt-4 mt-4 sm:pt-6 sm:mt-6 border-t text-muted-foreground">
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {notice.content}
              </p>
              <div className="flex items-center gap-1 text-xs mt-4">
                <Calendar className="w-3.5 h-3.5" />
                <span>{notice.date}</span>
              </div>
            </div>
          </details>
        </div>
      ))}

      {notices.length === 0 && (
        <div className="rounded-xl border py-12 px-6 text-center">
          <p className="text-muted-foreground font-nanumNeo text-sm">
            등록된 공지사항이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
