-- CulturePassport — Custom Backend Schema
-- Adapted from Supabase migration: no RLS, no auth.users FK, standalone profiles

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_departments_company ON public.departments(company_id);

CREATE TABLE public.positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  department_id uuid NOT NULL REFERENCES public.departments(id) ON DELETE RESTRICT,
  level int,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_positions_department ON public.positions(department_id);

-- profiles is standalone (no auth.users FK in custom backend)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('admin', 'manager', 'employee')),
  company_id uuid REFERENCES public.companies(id),
  department_id uuid REFERENCES public.departments(id),
  position_id uuid REFERENCES public.positions(id),
  avatar_url text,
  probation_start date,
  probation_end date,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_department ON public.profiles(department_id);
CREATE INDEX idx_profiles_company ON public.profiles(company_id);

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  color_code text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  estimated_duration text,
  is_deleted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_missions_category ON public.missions(category_id);
CREATE INDEX idx_missions_not_deleted ON public.missions(is_deleted) WHERE is_deleted = false;

CREATE TABLE public.user_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id uuid NOT NULL REFERENCES public.missions(id),
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  status text NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started','in_progress','submitted','approved','rejected','cancelled')),
  submitted_content text,
  submitted_file_url text,
  feedback_score int CHECK (feedback_score BETWEEN 1 AND 10),
  feedback_text text,
  started_at timestamptz,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (mission_id, user_id)
);
CREATE INDEX idx_user_missions_user ON public.user_missions(user_id);
CREATE INDEX idx_user_missions_status ON public.user_missions(status);
CREATE INDEX idx_user_missions_mission ON public.user_missions(mission_id);

CREATE TABLE public.exam_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  passing_score int NOT NULL CHECK (passing_score BETWEEN 0 AND 100),
  questions jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.exam_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_template_id uuid NOT NULL REFERENCES public.exam_templates(id),
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  score int NOT NULL,
  total int NOT NULL,
  passed boolean NOT NULL,
  answers jsonb,
  taken_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_exam_scores_user ON public.exam_scores(user_id);

CREATE TABLE public.roadmap_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  target_day int NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.announcement_dismissals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  dismissed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (announcement_id, user_id)
);
CREATE INDEX idx_dismissals_user ON public.announcement_dismissals(user_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER missions_updated_at
  BEFORE UPDATE ON public.missions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
