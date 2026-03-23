-- ============================================
-- 공유 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.event_shares (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.event_shares
  DROP CONSTRAINT IF EXISTS event_shares_pkey;

ALTER TABLE public.event_shares
  ADD CONSTRAINT event_shares_pkey PRIMARY KEY (user_id, event_id);

-- ============================================
-- 공유 인덱스
-- ============================================
CREATE INDEX IF NOT EXISTS idx_event_shares_user_id ON public.event_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_event_shares_event_id ON public.event_shares(event_id);


-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================
ALTER TABLE public.event_shares ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read own shares" ON public.event_shares;
DROP POLICY IF EXISTS "insert own share" ON public.event_shares;

-- 본인 공유 기록만 조회
CREATE POLICY "read own shares"
ON public.event_shares
FOR SELECT
TO authenticated
USING (user_id = (select auth.uid()));


-- ============================================
-- 테이블 권한 (INSERT는 RPC가 처리)
-- ============================================
GRANT SELECT ON public.event_shares TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.event_shares FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_shares TO service_role;


-- ============================================
-- 트리거: 공유 추가 → share_count +1
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_event_shares_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.events
  SET share_count = share_count + 1
  WHERE id = NEW.event_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_event_shares_after_insert ON public.event_shares;
CREATE TRIGGER trg_event_shares_after_insert
AFTER INSERT ON public.event_shares
FOR EACH ROW EXECUTE FUNCTION public.fn_trg_event_shares_insert();


-- ============================================
-- RPC: 공유 추가
-- ============================================
CREATE OR REPLACE FUNCTION public.add_share(p_event_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_exists boolean;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION '로그인이 필요합니다.';
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.event_shares
    WHERE user_id = auth.uid()
      AND event_id = p_event_id
  ) INTO v_exists;

  IF v_exists THEN
    RETURN FALSE;
  END IF;

  INSERT INTO public.event_shares (user_id, event_id)
  VALUES (auth.uid(), p_event_id);

  RETURN TRUE;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.add_share(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.add_share(UUID) TO authenticated;
