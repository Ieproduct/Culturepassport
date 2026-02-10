-- Fix: infinite recursion in profiles RLS policies
-- Root cause: manager policies contain subqueries that SELECT from profiles,
-- triggering recursive policy evaluation (PostgreSQL error 42P17).
--
-- Solution: move subqueries into SECURITY DEFINER functions that bypass RLS.

-- ============================================================
-- STEP 1: Create SECURITY DEFINER helper functions
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_my_department_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT department_id FROM public.profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.get_department_user_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT id FROM public.profiles
  WHERE department_id = (SELECT department_id FROM public.profiles WHERE id = auth.uid())
$$;

-- ============================================================
-- STEP 2: Drop all policies with recursive subqueries
-- ============================================================

DROP POLICY IF EXISTS "profiles_select_manager" ON public.profiles;
DROP POLICY IF EXISTS "user_missions_select_manager" ON public.user_missions;
DROP POLICY IF EXISTS "user_missions_update_manager" ON public.user_missions;
DROP POLICY IF EXISTS "exam_scores_select_manager" ON public.exam_scores;

-- ============================================================
-- STEP 3: Recreate policies using helper functions
-- ============================================================

CREATE POLICY "profiles_select_manager" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    public.get_my_role() = 'manager'
    AND department_id = public.get_my_department_id()
  );

CREATE POLICY "user_missions_select_manager" ON public.user_missions
  FOR SELECT TO authenticated
  USING (
    public.get_my_role() = 'manager'
    AND user_id IN (SELECT public.get_department_user_ids())
  );

CREATE POLICY "user_missions_update_manager" ON public.user_missions
  FOR UPDATE TO authenticated
  USING (
    public.get_my_role() = 'manager'
    AND user_id IN (SELECT public.get_department_user_ids())
  );

CREATE POLICY "exam_scores_select_manager" ON public.exam_scores
  FOR SELECT TO authenticated
  USING (
    public.get_my_role() = 'manager'
    AND user_id IN (SELECT public.get_department_user_ids())
  );

-- ============================================================
-- STEP 4: Fix handle_new_user trigger (ON CONFLICT safety)
-- Prevents duplicate key when Edge Function also creates profile
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
