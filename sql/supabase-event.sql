-- ============================================
-- 마라톤 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,                      -- 고유 ID
  year INT NOT NULL,                             -- 연도
  month INT NOT NULL,                            -- 월
  region TEXT NOT NULL,                          -- 지역

  name TEXT NOT NULL,                            -- 마라톤명
  slug TEXT UNIQUE NOT NULL,                     -- 슬러그
  type TEXT NOT NULL,                            -- 타입
  description TEXT,                              -- 설명
  highlights TEXT[],                             -- 주요 포인트 

  images JSONB,                                  -- 이미지 
  event JSONB,                                   -- 대회 일정 및 정보
  registration JSONB,                            -- 접수 정보
  programs JSONB,                                -- 프로그램 정보
  location JSONB,                                -- 위치 정보
  hosts JSONB,                                   -- 주최자 정보
  sns JSONB,                                     -- sns 정보

  comment_count INT DEFAULT 0 NOT NULL,          -- 댓글 수
  view_count INT DEFAULT 0 NOT NULL,             -- 조회 수
  favorite_count INT DEFAULT 0 NOT NULL,         -- 즐겨찾기 수
  like_count INT DEFAULT 0 NOT NULL,             -- 좋아요 수
  share_count INT DEFAULT 0 NOT NULL,            -- 공유 수

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL, -- 생성일시
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL  -- 수정일시
);

-- ============================================
-- 인덱스 생성 (성능 최적화)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_year_month ON events(year, month);
CREATE INDEX IF NOT EXISTS idx_events_region ON events(region);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_highlights ON events USING GIN(highlights);
CREATE INDEX IF NOT EXISTS idx_events_event ON events USING GIN(event);
CREATE INDEX IF NOT EXISTS idx_events_location ON events USING GIN(location);

-- ============================================
-- updated_at 자동 업데이트 함수 및 트리거
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) 활성화
-- ============================================
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS 정책 설정
-- ============================================
-- 1) 모두 읽기 가능
CREATE POLICY "이벤트 공개 읽기"
  ON events
  FOR SELECT
  TO public
  USING (true);

-- 2) 인증 사용자 삽입 가능
CREATE POLICY "인증된 사용자만 이벤트 삽입 가능"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 3) 인증 사용자 수정 가능
CREATE POLICY "인증된 사용자만 이벤트 수정 가능"
  ON events
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4) 인증 사용자 삭제 가능
CREATE POLICY "인증된 사용자만 이벤트 삭제 가능"
  ON events
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 테이블 및 컬럼 주석 추가
-- ============================================
COMMENT ON TABLE events IS '이벤트/축제/행사 정보를 저장하는 테이블';

COMMENT ON COLUMN events.id IS '이벤트 고유 ID';
COMMENT ON COLUMN events.year IS '이벤트 개최 연도';
COMMENT ON COLUMN events.month IS '이벤트 개최 월';
COMMENT ON COLUMN events.region IS '이벤트 개최 지역';

COMMENT ON COLUMN events.name IS '이벤트명';
COMMENT ON COLUMN events.slug IS 'URL에서 사용되는 고유 식별자 (예: 2025-busan-fireworks-festival)';
COMMENT ON COLUMN events.type IS '이벤트 타입/카테고리 (예: 지역축제, 문화행사, 전시, 공연 등)';
COMMENT ON COLUMN events.description IS '이벤트 설명';
COMMENT ON COLUMN events.highlights IS '이벤트 주요 포인트/태그 배열 (예: ["부산", "불꽃축제"])';

COMMENT ON COLUMN events.images IS '이미지 정보 JSON (예: {"main":"...jpg","sub":[]})';
COMMENT ON COLUMN events.event IS '이벤트 일정 정보 JSON (예: {"start":"2025-11-15","end":"2025-11-15","time":"19:00~20:00","price":"사전예매, 무료관람"})';
COMMENT ON COLUMN events.registration IS '예매/예약/접수 정보 JSON (예: {"start":"2025-09-01 14:00","end":"선착순 마감","site":"url","price":{"R석":100000}})';
COMMENT ON COLUMN events.programs IS '프로그램 정보 JSON/배열 (예: ["11/27 공연", "11/28 체험"])';
COMMENT ON COLUMN events.location IS '위치 정보 JSON (예: {"text":"광안리해수욕장","latitude":35.15373,"longitude":129.118838})';
COMMENT ON COLUMN events.hosts IS '주최/주관/후원 정보 JSON (예: {"organizer":"부산광역시","operator":"...","sponsor":[],"home":"url","tel":"...","email":""})';
COMMENT ON COLUMN events.sns IS 'SNS 정보 JSON (예: {"instagram":"...","kakao":"","youtube":"...","blog":"..."})';

COMMENT ON COLUMN events.comment_count IS '댓글 수';
COMMENT ON COLUMN events.view_count IS '조회 수';
COMMENT ON COLUMN events.favorite_count IS '즐겨찾기 수';
COMMENT ON COLUMN events.share_count IS '공유 수';

COMMENT ON COLUMN events.created_at IS '생성일시';
COMMENT ON COLUMN events.updated_at IS '수정일시 (자동 업데이트)';