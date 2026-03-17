-- ============================================
-- 알림설정 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.event_alerts (
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  alert_type  TEXT NOT NULL CHECK (alert_type IN ('entry', 'event')), -- 접수일정 | 대회일정
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, event_id, alert_type)
);

-- ============================================
-- 알림설정 인덱스
-- ============================================
CREATE INDEX IF NOT EXISTS idx_event_alerts_user_id ON public.event_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_event_alerts_event_id ON public.event_alerts(event_id);

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================
ALTER TABLE public.event_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read own alerts" ON public.event_alerts;
DROP POLICY IF EXISTS "insert own alert" ON public.event_alerts;
DROP POLICY IF EXISTS "delete own alert" ON public.event_alerts;

-- 본인 알림설정만 조회
CREATE POLICY "read own alerts"
ON public.event_alerts
FOR SELECT
TO authenticated
USING (user_id = (select auth.uid()));

-- ============================================
-- 테이블 권한 (INSERT는 RPC가 처리)
-- ============================================
GRANT SELECT ON public.event_alerts TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.event_alerts FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_alerts TO service_role;


-- ============================================
-- 트리거: 알림설정 추가 → 카운트 +1
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_event_alerts_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.alert_type = 'entry' THEN
    UPDATE public.events
    SET alert_entry_count = alert_entry_count + 1
    WHERE id = NEW.event_id;
  ELSE
    UPDATE public.events
    SET alert_event_count = alert_event_count + 1
    WHERE id = NEW.event_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_event_alerts_after_insert ON public.event_alerts;
CREATE TRIGGER trg_event_alerts_after_insert
AFTER INSERT ON public.event_alerts
FOR EACH ROW EXECUTE FUNCTION public.fn_trg_event_alerts_insert();


-- ============================================
-- RPC: 알림설정 추가
-- alert_type: 'entry'(접수일정) | 'event'(대회일정)
-- ============================================
CREATE OR REPLACE FUNCTION public.add_alert(p_event_id UUID, p_alert_type TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION '로그인이 필요합니다.';
  END IF;

  INSERT INTO public.event_alerts (user_id, event_id, alert_type)
  VALUES (auth.uid(), p_event_id, p_alert_type)
  ON CONFLICT DO NOTHING;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.add_alert(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.add_alert(UUID, TEXT) TO authenticated;
