-- ==============================================================================
-- DIVING VISION PLATFORM - SUPABASE PRODUCTION DATABASE SCHEMA
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ADMIN ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'Content Manager' CHECK (role IN ('Super Admin', 'Content Manager')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. SITE SETTINGS (White-label metadata & contact details)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT NOT NULL DEFAULT 'Aura Oceanics Diving Sanctuary',
  tagline TEXT NOT NULL DEFAULT 'Pure Ocean Expeditions & Mastery',
  description TEXT NOT NULL DEFAULT 'Bespoke scuba diving expeditions, elite PADI certifications, and luxury marine safaris in pristine waters.',
  logo_url TEXT,
  favicon_url TEXT,
  phone TEXT NOT NULL DEFAULT '+20 100 000 0000',
  whatsapp_number TEXT NOT NULL DEFAULT '201000000000',
  whatsapp_default_message TEXT NOT NULL DEFAULT 'Hello! I would like to inquire about diving experiences.',
  email TEXT NOT NULL DEFAULT 'contact@auraoceanics.com',
  address TEXT NOT NULL DEFAULT 'Marina Promenade, Coral Bay',
  city TEXT NOT NULL DEFAULT 'Red Sea',
  country TEXT NOT NULL DEFAULT 'Egypt',
  google_maps_url TEXT,
  currency TEXT NOT NULL DEFAULT 'EUR',
  opening_hours JSONB NOT NULL DEFAULT '[{"days":"Monday - Sunday","hours":"08:00 - 19:00"}]'::jsonb,
  social_links JSONB NOT NULL DEFAULT '{"instagram":"https://instagram.com","facebook":"https://facebook.com","tiktok":"https://tiktok.com"}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. THEMES
CREATE TABLE IF NOT EXISTS public.themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  preset_key TEXT NOT NULL,
  colors JSONB NOT NULL,
  typography JSONB NOT NULL,
  styling JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. HOMEPAGE SECTIONS
CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  badge TEXT,
  description TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,
  layout_variant TEXT DEFAULT 'standard',
  settings JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ACTIVITIES
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  featured_image TEXT NOT NULL,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  duration TEXT NOT NULL,
  depth_max TEXT,
  experience_level TEXT NOT NULL CHECK (experience_level IN ('Beginner', 'Intermediate', 'Advanced', 'All Levels')),
  price NUMERIC(10, 2),
  price_note TEXT,
  included_items JSONB DEFAULT '[]'::jsonb,
  requirements JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. COURSES
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  certification_agency TEXT NOT NULL DEFAULT 'PADI',
  level TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  featured_image TEXT NOT NULL,
  duration TEXT NOT NULL,
  minimum_age INT,
  prerequisites TEXT,
  max_depth TEXT,
  price NUMERIC(10, 2),
  price_note TEXT,
  learning_outcomes JSONB DEFAULT '[]'::jsonb,
  certification_card_included BOOLEAN NOT NULL DEFAULT TRUE,
  gear_included BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. TRIPS & EXPEDITIONS
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  destination TEXT NOT NULL,
  boat_name TEXT,
  description TEXT NOT NULL,
  featured_image TEXT NOT NULL,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  duration TEXT NOT NULL,
  departure_time TEXT,
  return_time TEXT,
  price NUMERIC(10, 2),
  dives_included INT NOT NULL DEFAULT 2,
  meals_included JSONB DEFAULT '[]'::jsonb,
  itinerary JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. GALLERY
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  caption TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Reef', 'Wrecks', 'Marine Life', 'Divers', 'Expeditions', 'Aerial')),
  location TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. REVIEWS & TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  diver_certification TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  trip_or_course TEXT,
  date TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'Verified Guest',
  is_verified BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. FAQS
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. INQUIRIES & BOOKINGS
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  interest_type TEXT NOT NULL,
  item_title TEXT,
  preferred_date TEXT,
  participants_count INT NOT NULL DEFAULT 1,
  diver_level TEXT,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Confirmed', 'Cancelled', 'Completed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. MEDIA LIBRARY
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  alt_text TEXT,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public can read site settings, active themes, enabled sections, published content
CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read active themes" ON public.themes FOR SELECT USING (true);
CREATE POLICY "Public can read homepage sections" ON public.homepage_sections FOR SELECT USING (is_enabled = true);
CREATE POLICY "Public can read published activities" ON public.activities FOR SELECT USING (status = 'published');
CREATE POLICY "Public can read published courses" ON public.courses FOR SELECT USING (status = 'published');
CREATE POLICY "Public can read published trips" ON public.trips FOR SELECT USING (status = 'published');
CREATE POLICY "Public can read published gallery" ON public.gallery FOR SELECT USING (status = 'published');
CREATE POLICY "Public can read published reviews" ON public.reviews FOR SELECT USING (status = 'published');
CREATE POLICY "Public can read published faqs" ON public.faqs FOR SELECT USING (status = 'published');
CREATE POLICY "Public can read media" ON public.media FOR SELECT USING (true);

-- Public can insert new inquiries
CREATE POLICY "Public can create inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

-- Authenticated Admin can perform all operations
CREATE POLICY "Admin full access on settings" ON public.site_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on themes" ON public.themes FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on sections" ON public.homepage_sections FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on activities" ON public.activities FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on courses" ON public.courses FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on trips" ON public.trips FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on gallery" ON public.gallery FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on reviews" ON public.reviews FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on faqs" ON public.faqs FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on inquiries" ON public.inquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on media" ON public.media FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access on audit_logs" ON public.audit_logs FOR ALL TO authenticated USING (true);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_activities_status ON public.activities(status, display_order);
CREATE INDEX IF NOT EXISTS idx_courses_status ON public.courses(status, display_order);
CREATE INDEX IF NOT EXISTS idx_trips_status ON public.trips(status, display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_status ON public.gallery(status, display_order);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status, is_featured);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);
