-- CulturePassport — Auth credentials table for custom backend
-- Replaces Supabase auth.users for DEV/UAT environments

CREATE TABLE public.auth_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_auth_credentials_profile ON public.auth_credentials(profile_id);
