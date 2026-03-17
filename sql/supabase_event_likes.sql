-- ============================================
-- 좋아요 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.event_likes (
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, event_id)
);

-- ============================================
-- 좋아요 인덱스
-- ============================================
CREATE INDEX IF NOT EXISTS idx_event_likes_user_id ON public.event_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_event_likes_event_id ON public.event_likes(event_id);

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================
ALTER TABLE public.event_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read own likes" ON public.event_likes;
DROP POLICY IF EXISTS "insert own like" ON public.event_likes;
DROP POLICY IF EXISTS "delete own like" ON public.event_likes;

-- 본인 좋아요만 조회
CREATE POLICY "read own likes"
ON public.event_likes
FOR SELECT
TO authenticated
USING (user_id = (select auth.uid()));

-- 본인 좋아요만 추가
CREATE POLICY "insert own like"
ON public.event_likes
FOR INSERT
TO authenticated
WITH CHECK (user_id = (select auth.uid()));

-- 본인 좋아요만 삭제
CREATE POLICY "delete own like"
ON public.event_likes
FOR DELETE
TO authenticated
USING (user_id = (select auth.uid()));

-- ============================================
-- 테이블 권한 정리
-- ============================================
GRANT SELECT, INSERT, DELETE ON public.event_likes TO authenticated;
REVOKE UPDATE ON public.event_likes FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_likes TO service_role;


-- ============================================
-- 트리거: 좋아요 추가 → like_count +1
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_event_likes_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.events
  SET like_count = like_count + 1
  WHERE id = NEW.event_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_event_likes_after_insert ON public.event_likes;
CREATE TRIGGER trg_event_likes_after_insert
AFTER INSERT ON public.event_likes
FOR EACH ROW EXECUTE FUNCTION public.fn_trg_event_likes_insert();


-- ============================================
-- 트리거: 좋아요 삭제 → like_count -1
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_event_likes_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.events
  SET like_count = GREATEST(like_count - 1, 0)
  WHERE id = OLD.event_id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_event_likes_after_delete ON public.event_likes;
CREATE TRIGGER trg_event_likes_after_delete
AFTER DELETE ON public.event_likes
FOR EACH ROW EXECUTE FUNCTION public.fn_trg_event_likes_delete();


-- ============================================
-- RPC: 좋아요 토글 (추가 → true / 취소 → false)
-- ============================================
CREATE OR REPLACE FUNCTION public.toggle_like(p_event_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.event_likes
    WHERE user_id = (select auth.uid())
      AND event_id = p_event_id
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM public.event_likes
    WHERE user_id = (select auth.uid())
      AND event_id = p_event_id;
    RETURN FALSE;
  ELSE
    INSERT INTO public.event_likes (user_id, event_id)
    VALUES ((select auth.uid()), p_event_id);
    RETURN TRUE;
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.toggle_like(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.toggle_like(UUID) TO authenticated;
