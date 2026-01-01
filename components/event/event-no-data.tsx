import { Baby } from "lucide-react";

export default function EventNoData() {
  return (
    <div className="border p-4 rounded text-center py-16 text-muted-foreground font-nanumNeo">
      <Baby className="mx-auto mb-3 w-24 h-24" />
      <p>데이터가 없습니다.</p>
      <p className="text-sm mt-1 underline underline-offset-4">
        다른 검색어로 다시 시도해보세요!
      </p>
    </div>
  );
}
