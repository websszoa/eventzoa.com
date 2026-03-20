-- ============================================
-- 이벤트 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  year INT NOT NULL CHECK (year >= 2000),            -- 연도
  month INT NOT NULL CHECK (month BETWEEN 1 AND 12), -- 월
  country TEXT NOT NULL,                             -- 국가(한국, 일본, 프랑스....)
  region TEXT NOT NULL,                              -- 지역(서울, 도쿄, 파리....)

  name TEXT NOT NULL,                                -- 이벤트명
  slug TEXT UNIQUE NOT NULL,                         -- 슬러그
  description TEXT NOT NULL,                         -- 설명

  event_start_at TIMESTAMPTZ,                        -- 이벤트 시작 일시
  event_end_at TIMESTAMPTZ,                          -- 이벤트 종료 일시
  event_scale INT,                                   -- 이벤트 규모
  event_type TEXT,                                   -- 이벤트 타입
  event_site TEXT,                                   -- 이벤트 웹사이트
  event_program Text,                                -- 이벤트 프로그램 정보

  registration_status TEXT CHECK (registration_status IN ('접수대기', '접수중', '접수마감', '추가접수')),
  registration_start_at TIMESTAMPTZ,                 -- 접수 시작 일시
  registration_end_at TIMESTAMPTZ,                   -- 접수 종료 일시
  registration_add_start_at TIMESTAMPTZ,             -- 추가 접수 시작 일시
  registration_add_end_at TIMESTAMPTZ,               -- 추가 접수 종료 일시
  registration_price JSONB,                          -- 접수 가격 정보(거리별 가격)

  images JSONB,                                      -- 이미지 정보(대표이미지, 썸네일)
  location JSONB,                                    -- 위치 정보(국가, 도시, 장소, 위도, 경도)
  hosts JSONB,                                       -- 주최자 정보(전화번호, 이메일, 스폰서, 주최자, 협력업체, 기념품)
  sns JSONB,                                         -- sns 정보(인스타그램, 카카오톡, 유튜브, 블러그)

  comment_count INT DEFAULT 0 NOT NULL,              -- 댓글 수
  view_count INT DEFAULT 0 NOT NULL,                 -- 조회 수
  like_count INT DEFAULT 0 NOT NULL,                 -- 좋아요 수
  favorite_count INT DEFAULT 0 NOT NULL,             -- 즐겨찾기 수
  share_count INT DEFAULT 0 NOT NULL,                -- 공유 수
  alert_entry_count INT DEFAULT 0 NOT NULL,          -- 접수 알람 설정 수
  alert_event_count INT DEFAULT 0 NOT NULL,          -- 이벤트 알람 설정 수
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,     -- 생성일시
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL      -- 수정일시
);

-- ============================================
-- 이벤트 테이블 인덱스 (필터/목록 조회용)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_events_registration_status ON public.events(registration_status);
CREATE INDEX IF NOT EXISTS idx_events_event_start_at ON public.events(event_start_at);
CREATE INDEX IF NOT EXISTS idx_events_year_month ON public.events(year, month);
CREATE INDEX IF NOT EXISTS idx_events_region ON public.events(region);
CREATE INDEX IF NOT EXISTS idx_events_country ON public.events(country);
CREATE INDEX IF NOT EXISTS idx_events_registration_dates ON public.events(registration_start_at, registration_end_at);

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 기존 정책 초기화
DROP POLICY IF EXISTS "public read events" ON public.events;

-- 누구나 이벤트 목록/상세 조회 가능 (비로그인 포함)
CREATE POLICY "public read events"
ON public.events
FOR SELECT
TO anon, authenticated
USING (true);

-- ============================================
-- 테이블 권한 정리
-- ============================================
GRANT SELECT ON public.events TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.events FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO service_role;
