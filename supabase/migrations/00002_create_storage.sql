-- CulturePassport — Storage Buckets & Policies
-- Phase 8: Supabase Storage Configuration

-- ============================================================
-- 1. Create Storage Buckets
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'mission-deliverables',
    'mission-deliverables',
    false,
    10485760, -- 10 MB
    ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ]
  ),
  (
    'avatars',
    'avatars',
    true,
    2097152, -- 2 MB
    ARRAY[
      'image/jpeg',
      'image/png',
      'image/webp'
    ]
  );

-- ============================================================
-- 2. mission-deliverables policies (private bucket)
-- ============================================================

-- Employees can upload files to their own folder: {user_id}/...
CREATE POLICY "mission_deliverables_insert_own"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'mission-deliverables'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can view their own uploaded files
CREATE POLICY "mission_deliverables_select_own"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'mission-deliverables'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins and managers can view all deliverable files
CREATE POLICY "mission_deliverables_select_admin_manager"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'mission-deliverables'
    AND public.get_my_role() IN ('admin', 'manager')
  );

-- Users can update (re-upload) their own files
CREATE POLICY "mission_deliverables_update_own"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'mission-deliverables'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins can delete any deliverable file
CREATE POLICY "mission_deliverables_delete_admin"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'mission-deliverables'
    AND public.get_my_role() = 'admin'
  );

-- Users can delete their own files
CREATE POLICY "mission_deliverables_delete_own"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'mission-deliverables'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- 3. avatars policies (public bucket)
-- ============================================================

-- Anyone can view avatars (public bucket)
CREATE POLICY "avatars_select_public"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'avatars');

-- Authenticated users can upload avatar to their own folder: {user_id}/...
CREATE POLICY "avatars_insert_own"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can update their own avatar
CREATE POLICY "avatars_update_own"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own avatar
CREATE POLICY "avatars_delete_own"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
