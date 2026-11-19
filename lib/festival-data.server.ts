import events from "@/data/events/events_2026.json";

export type FestivalData = (typeof events)[number];

function getDataCompleteness(value: unknown): number {
  if (typeof value === "string") return value.trim() ? 1 : 0;
  if (typeof value === "number" || typeof value === "boolean") return 1;
  if (Array.isArray(value)) {
    return value.reduce((total, item) => total + getDataCompleteness(item), 0);
  }
  if (value && typeof value === "object") {
    return Object.values(value).reduce<number>(
      (total, item) => total + getDataCompleteness(item),
      0,
    );
  }
  return 0;
}

const festivalsBySlug = new Map<string, FestivalData>();

for (const event of events) {
  const selected = festivalsBySlug.get(event.slug);

  if (!selected || getDataCompleteness(event) > getDataCompleteness(selected)) {
    festivalsBySlug.set(event.slug, event);
  }
}

export const uniqueFestivals = Array.from(festivalsBySlug.values());
export const festivalSlugs = Array.from(festivalsBySlug.keys());

export function getFestivalBySlug(slug: string) {
  return festivalsBySlug.get(slug);
}

// 상세페이지 하단 '함께 보면 좋은 축제'. 같은 지역 > 같은 종류 > 아직 끝나지 않은 축제 순으로 고른다.
export function getRelatedFestivals(festival: FestivalData, limit = 4) {
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
  }).format(new Date());

  return uniqueFestivals
    .filter((candidate) => candidate.slug !== festival.slug)
    .map((candidate) => {
      const ended = Boolean(
        candidate.event.endDate && candidate.event.endDate < today,
      );
      const score =
        (candidate.location.region === festival.location.region ? 4 : 0) +
        (candidate.info.type === festival.info.type ? 2 : 0) +
        (ended ? 0 : 3);

      return { candidate, score, ended };
    })
    .filter(({ score }) => score >= 4)
    .sort(
      (a, b) =>
        b.score - a.score ||
        // 끝나지 않은 축제는 가까운 일정 순, 끝난 축제는 최근 순
        (a.ended
          ? (b.candidate.event.endDate ?? "").localeCompare(
              a.candidate.event.endDate ?? "",
            )
          : (a.candidate.event.startDate ?? "9999").localeCompare(
              b.candidate.event.startDate ?? "9999",
            )),
    )
    .slice(0, limit)
    .map(({ candidate, ended }) => ({ festival: candidate, ended }));
}
