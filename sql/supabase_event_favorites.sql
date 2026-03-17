-- ============================================
-- 즐겨찾기 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.event_favorites (
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, event_id)
);

-- ============================================
-- 즐겨찾기 인덱스
-- ============================================
CREATE INDEX IF NOT EXISTS idx_event_favorites_user_id ON public.event_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_event_favorites_event_id ON public.event_favorites(event_id);

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================
ALTER TABLE public.event_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read own favorites" ON public.event_favorites;
DROP POLICY IF EXISTS "insert own favorite" ON public.event_favorites;
DROP POLICY IF EXISTS "delete own favorite" ON public.event_favorites;

-- 본인 즐겨찾기만 조회
CREATE POLICY "read own favorites"
ON public.event_favorites
FOR SELECT
TO authenticated
USING (user_id = (select auth.uid()));

-- 본인 즐겨찾기만 추가
CREATE POLICY "insert own favorite"
ON public.event_favorites
FOR INSERT
TO authenticated
WITH CHECK (user_id = (select auth.uid()));

-- 본인 즐겨찾기만 삭제
CREATE POLICY "delete own favorite"
ON public.event_favorites
FOR DELETE
TO authenticated
USING (user_id = (select auth.uid()));

-- ============================================
-- 테이블 권한 정리
-- ============================================
GRANT SELECT, INSERT, DELETE ON public.event_favorites TO authenticated;
REVOKE UPDATE ON public.event_favorites FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_favorites TO service_role;


-- ============================================
-- 트리거: 즐겨찾기 추가 → favorite_count +1
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_event_favorites_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.events
  SET favorite_count = favorite_count + 1
  WHERE id = NEW.event_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_event_favorites_after_insert ON public.event_favorites;
CREATE TRIGGER trg_event_favorites_after_insert
AFTER INSERT ON public.event_favorites
FOR EACH ROW EXECUTE FUNCTION public.fn_trg_event_favorites_insert();


-- ============================================
-- 트리거: 즐겨찾기 삭제 → favorite_count -1
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_event_favorites_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.events
  SET favorite_count = GREATEST(favorite_count - 1, 0)
  WHERE id = OLD.event_id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_event_favorites_after_delete ON public.event_favorites;
CREATE TRIGGER trg_event_favorites_after_delete
AFTER DELETE ON public.event_favorites
FOR EACH ROW EXECUTE FUNCTION public.fn_trg_event_favorites_delete();


-- ============================================
-- RPC: 즐겨찾기 토글 (추가 → true / 취소 → false)
-- ============================================
CREATE OR REPLACE FUNCTION public.toggle_favorite(p_event_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.event_favorites
    WHERE user_id = (select auth.uid())
      AND event_id = p_event_id
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM public.event_favorites
    WHERE user_id = (select auth.uid())
      AND event_id = p_event_id;
    RETURN FALSE;
  ELSE
    INSERT INTO public.event_favorites (user_id, event_id)
    VALUES ((select auth.uid()), p_event_id);
    RETURN TRUE;
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.toggle_favorite(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.toggle_favorite(UUID) TO authenticated;
