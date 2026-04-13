const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// .env.local 파일에서 환경변수 로드
const envPath = path.join(__dirname, "../.env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(".env.local에서 SUPABASE 환경변수를 찾을 수 없습니다.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function insertEvents() {
  const filePath = path.join(__dirname, "insert.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const events = JSON.parse(raw);

  console.log(`총 ${events.length}개 데이터를 삽입합니다...`);

  const { data, error } = await supabase
    .from("events")
    .upsert(events, { onConflict: "slug", ignoreDuplicates: true })
    .select();

  if (error) {
    console.error("삽입 실패:", error.message);
    console.error("상세:", error.details);
    process.exit(1);
  }

  console.log(`삽입 완료: ${data.length}개`);
  data.forEach((row) => {
    console.log(`  - [${row.id}] ${row.name} (${row.slug})`);
  });
}

insertEvents().catch((err) => {
  console.error("예기치 않은 오류:", err);
  process.exit(1);
});
