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

  if (
    !selected ||
    getDataCompleteness(event) > getDataCompleteness(selected)
  ) {
    festivalsBySlug.set(event.slug, event);
  }
}

export const uniqueFestivals = Array.from(festivalsBySlug.values());
export const festivalSlugs = Array.from(festivalsBySlug.keys());

export function getFestivalBySlug(slug: string) {
  return festivalsBySlug.get(slug);
}
