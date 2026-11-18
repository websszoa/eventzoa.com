// 축제 데이터가 바뀐 날짜를 slug별로 기록한다. (sitemap.xml의 lastModified에 사용)
// 각 축제 데이터의 해시를 이전 기록과 비교해, 내용이 바뀐 축제만 오늘 날짜로 갱신한다.
// 실행: npm run lastmod  (npm run build 전에도 자동 실행된다)
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const eventsPath = path.join(root, "data/events/events_2026.json");
const manifestPath = path.join(root, "data/events/lastmod.json");

const today = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Seoul",
}).format(new Date());

const events = JSON.parse(readFileSync(eventsPath, "utf8"));
const previous = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, "utf8"))
  : {};

const entriesBySlug = new Map();
for (const event of events) {
  entriesBySlug.set(event.slug, [
    ...(entriesBySlug.get(event.slug) ?? []),
    event,
  ]);
}

const next = {};
let changed = 0;

for (const [slug, entries] of [...entriesBySlug].sort(([a], [b]) =>
  a.localeCompare(b),
)) {
  const hash = createHash("sha1")
    .update(JSON.stringify(entries))
    .digest("hex")
    .slice(0, 12);
  const before = previous[slug];

  if (before?.hash === hash) {
    next[slug] = before;
  } else {
    next[slug] = { hash, updatedAt: today };
    changed += 1;
  }
}

writeFileSync(manifestPath, `${JSON.stringify(next, null, 2)}\n`);
console.log(
  `[lastmod] ${Object.keys(next).length}개 축제 중 ${changed}개 갱신 (${today})`,
);
