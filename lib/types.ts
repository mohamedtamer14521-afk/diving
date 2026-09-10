export type ContentStatus = "draft" | "published" | "archived";

export interface BusinessSettings {
  business_name: string;
  tagline: string;
  description: string;
  logo_url: string;
  favicon_url: string;
  phone: string;
  whatsapp_number: string;
  whatsapp_default_message: string;
  whatsapp_config?: WhatsAppConfig;
  email: string;
  address: string;
  city: string;
  country: string;
  google_maps_url: string;
  currency: string;
  opening_hours: { days: string; hours: string }[];
  social_links: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    tripadvisor?: string;
  };
  last_published_at?: string;
  last_modified_at?: string;
  has_unpublished_changes?: boolean;
}

export interface WhatsAppConfig {
  phone_number: string;
  button_label: string;
  default_message: string;
  is_enabled: boolean;
  position: "bottom-right" | "bottom-left";
  animation_intensity: "none" | "subtle" | "normal";
  show_on_mobile: boolean;
  show_on_desktop: boolean;
}

export interface ThemeConfig {
  id: string;
  name: string;
  preset_key: string;
  colors: {
    primary: string;
    accent: string;
    ocean_deep?: string;
    background?: string;
    surface: string;
    surface_elevated?: string;
    primary_glow?: string;
    secondary?: string;
    text_primary: string;
    text_muted: string;
    border_subtle: string;
  };
  typography: {
    heading_font: string;
    body_font: string;
    letter_spacing: string;
  };
  styling: {
    border_radius: "none" | "sm" | "md" | "lg" | "xl" | "full" | string;
    button_style: "rounded" | "pill" | "sharp" | "glass" | string;
    card_style: "glass" | "solid" | "bordered" | "minimal" | string;
    nav_style: "floating-glass" | "solid-bar" | "minimal-transparent" | string;
    hero_style: "cinematic-full" | "split" | "centered-luxury" | string;
    section_spacing: "compact" | "normal" | "spacious" | string;
    glass_intensity: "none" | "subtle" | "medium" | "heavy" | string;
    dark_mode: boolean;
  };
  is_active?: boolean;
  last_published_at?: string;
  last_modified_at?: string;
  has_unpublished_changes?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface HomepageSection {
  id: string;
  section_key: string;
  name: string;
  title: string;
  subtitle: string;
  badge?: string;
  description?: string;
  is_enabled: boolean;
  display_order: number;
  layout_variant?: string;
  settings?: Record<string, any>;
  last_published_at?: string;
  last_modified_at?: string;
  has_unpublished_changes?: boolean;
  updated_at?: string;
}

export interface Activity {
  id: string;
  title: string;
  slug?: string;
  category?: string;
  description: string;
  short_description?: string;
  featured_image?: string;
  image_url?: string;
  gallery_images?: string[];
  duration: string;
  difficulty?: string;
  depth_max?: string;
  experience_level?: string;
  price: number | null;
  currency?: string;
  price_note?: string;
  highlights?: string[];
  included_items?: string[];
  requirements?: string[];
  is_featured?: boolean;
  status: ContentStatus;
  display_order: number;
  last_published_at?: string;
  last_modified_at?: string;
  has_unpublished_changes?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Course {
  id: string;
  title: string;
  slug?: string;
  certification_agency?: string;
  level: string;
  description?: string;
  overview?: string;
  short_description?: string;
  featured_image?: string;
  image_url?: string;
  duration?: string;
  duration_days?: number;
  minimum_age?: number;
  prerequisites?: string;
  max_depth?: string;
  price: number | null;
  currency?: string;
  price_note?: string;
  modules?: string[];
  includes?: string[];
  learning_outcomes?: string[];
  certification_card_included?: boolean;
  gear_included?: boolean;
  is_featured?: boolean;
  status: ContentStatus;
  display_order: number;
  last_published_at?: string;
  last_modified_at?: string;
  has_unpublished_changes?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Trip {
  id: string;
  title: string;
  slug?: string;
  destination: string;
  boat_name?: string;
  short_description?: string;
  description: string;
  featured_image?: string;
  image_url?: string;
  gallery_images?: string[];
  duration: string;
  departure_time?: string;
  return_time?: string;
  price: number | null;
  currency?: string;
  group_size_max?: number;
  highlights?: string[];
  schedule_details?: string;
  dives_included?: number;
  meals_included?: string[];
  itinerary?: {
    time: string;
    activity: string;
  }[];
  is_featured?: boolean;
  status: ContentStatus;
  display_order: number;
  last_published_at?: string;
  last_modified_at?: string;
  has_unpublished_changes?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption?: string;
  image_url: string;
  storage_path?: string;
  category: string;
  location?: string;
  status: ContentStatus;
  display_order: number;
  last_published_at?: string;
  last_modified_at?: string;
  has_unpublished_changes?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  author_name: string;
  author_title?: string;
  author_avatar?: string;
  author_country?: string;
  diver_certification?: string;
  rating: number;
  date?: string;
  comment?: string;
  review_text?: string;
  dive_experience_title?: string;
  trip_or_course?: string;
  source?: string;
  is_verified?: boolean;
  is_featured?: boolean;
  status?: ContentStatus;
  last_published_at?: string;
  last_modified_at?: string;
  has_unpublished_changes?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  display_order?: number;
  status?: ContentStatus;
  last_published_at?: string;
  last_modified_at?: string;
  has_unpublished_changes?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type InquiryStatus = "New" | "Contacted" | "Confirmed" | "Completed" | "Cancelled";

export interface BookingInquiry {
  id: string;
  reference_code?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  interest_type: "Activity" | "Course" | "Trip" | "Custom Private Charter" | "General Inquiry";
  item_title?: string;
  preferred_date?: string;
  participants_count: number;
  diver_level?: string;
  special_requests?: string;
  status: InquiryStatus;
  admin_notes?: string;
  created_at: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  file_size: number;
  file_type: string;
  alt_text?: string;
  caption?: string;
  storage_path?: string;
  bucket_name?: string;
  storage_target?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_email: string;
  action: string;
  entity_type: string;
  details: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "Super Admin" | "Content Manager";
  avatar_url?: string;
  last_login: string;
}
