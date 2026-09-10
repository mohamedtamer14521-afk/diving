-- ==============================================================================
-- 002: STORAGE BUCKET CONFIGURATION & PUBLISHING PIPELINE
-- ==============================================================================

-- 1. Create Media Storage Bucket in Supabase Storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  26214400, -- 25 MB max size
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 26214400,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml', 'video/mp4', 'video/webm'];

-- 2. Storage Policies
CREATE POLICY "Public Read Access for Media Bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Authenticated Users Can Upload to Media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

CREATE POLICY "Authenticated Users Can Update Media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media');

CREATE POLICY "Authenticated Users Can Delete Media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');

-- 3. Add Publishing Lifecycle & Timestamp Columns to Relational Tables
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS last_published_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS last_modified_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS has_unpublished_changes BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS whatsapp_config JSONB DEFAULT '{
  "phone_number": "201008924410",
  "button_label": "Chat With Us",
  "default_message": "Hello Aura Oceanics, I would like to inquire about diving experiences.",
  "is_enabled": true,
  "position": "bottom-right",
  "animation_intensity": "subtle",
  "show_on_mobile": true,
  "show_on_desktop": true
}'::jsonb;

ALTER TABLE public.themes
ADD COLUMN IF NOT EXISTS last_published_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS last_modified_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS has_unpublished_changes BOOLEAN DEFAULT FALSE;

ALTER TABLE public.homepage_sections
ADD COLUMN IF NOT EXISTS last_published_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS last_modified_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS has_unpublished_changes BOOLEAN DEFAULT FALSE;

ALTER TABLE public.activities
ADD COLUMN IF NOT EXISTS last_published_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS last_modified_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS has_unpublished_changes BOOLEAN DEFAULT FALSE;

ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS last_published_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS last_modified_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS has_unpublished_changes BOOLEAN DEFAULT FALSE;

ALTER TABLE public.trips
ADD COLUMN IF NOT EXISTS last_published_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS last_modified_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS has_unpublished_changes BOOLEAN DEFAULT FALSE;

ALTER TABLE public.gallery
ADD COLUMN IF NOT EXISTS last_published_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS last_modified_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS has_unpublished_changes BOOLEAN DEFAULT FALSE;

ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS last_published_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS last_modified_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS has_unpublished_changes BOOLEAN DEFAULT FALSE;

ALTER TABLE public.faqs
ADD COLUMN IF NOT EXISTS last_published_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS last_modified_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS has_unpublished_changes BOOLEAN DEFAULT FALSE;

ALTER TABLE public.media
ADD COLUMN IF NOT EXISTS storage_path TEXT,
ADD COLUMN IF NOT EXISTS bucket_name TEXT DEFAULT 'media';

-- 4. Enable Supabase Realtime Broadcasting
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'site_settings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE 
      public.site_settings,
      public.themes,
      public.homepage_sections,
      public.activities,
      public.courses,
      public.trips,
      public.gallery,
      public.reviews,
      public.faqs,
      public.media;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL; -- Ignore if already configured
END $$;
