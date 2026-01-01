import "dotenv/config";
import { supabase } from "@/lib/supabase-client";
import fs from "fs";
import path from "path";

// JSON 파일 로드
const filePath = path.resolve(__dirname, "./data-marathon.json");
const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

async function importEvents() {
  const items = jsonData.item;

  for (const event of items) {
    // ⬇️ year / month 추출
    const start = event.event?.start ?? "";
    const [yearStr, monthStr] = start.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);

    // ⬇️ region 자동 계산 (highlights의 첫 요소 기준)
    const region = event.highlights?.[0] || "기타";

    // ⬇️ 테이블에 맞게 데이터 매핑
    const row = {
      year,
      month,
      region,
      name: event.name,
      slug: event.slug,
      description: event.description,
      highlights: event.highlights,
      images: event.images,
      event: event.event,
      registration: event.registration,
      programs: event.programs,
      location: event.location,
      hosts: event.hosts,
      sns: event.sns,
    };

    console.log(`➡️ Importing: ${event.name} (${event.slug})`);

    // ⬇️ 데이터 삽입 (slug 기준 upsert)
    const { error } = await supabase
      .from("events")
      .upsert(row, { onConflict: "slug" });

    if (error) {
      console.error(`❌ Error inserting ${event.slug}:`, error.message);
    } else {
      console.log(`✅ Inserted: ${event.slug}`);
    }
  }

  console.log("\n🎉 모든 이벤트 import 완료!");
}

importEvents();
