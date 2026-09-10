export type ContentStatus = "draft" | "published" | "archived";

export interface WhatsAppConfig {
  phone_number: string;
  button_label: string;
  default_message: string;
  is_enabled: boolean;
  position: "bottom-right" | "bottom-left";
  animation_intensity: "subtle" | "normal" | "none";
  show_on_mobile: boolean;
  show_on_desktop: boolean;
}

export interface BusinessSettings {
  id?: string;
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
  opening_hours: {
    days: string;
    hours: string;
  }[];
  social_links: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    tripadvisor?: string;
  };
  currency: string;
  last_published_at?: string;
  last_modified_at?: string;
  has_unpublished_changes?: boolean;
  updated_at?: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  preset_key: "premium-ocean" | "luxury-black" | "red-sea-adventure" | "minimal-white" | "custom";
  colors: {
    background: string;
    surface: string;
    surface_elevated: string;
    primary: string;
    primary_glow: string;
    secondary: string;
    accent: string;
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
    border_radius: "none" | "sm" | "md" | "lg" | "xl" | "full";
    button_style: "rounded" | "pill" | "sharp" | "glass";
    card_style: "glass" | "solid" | "bordered" | "minimal";
    nav_style: "floating-glass" | "solid-bar" | "minimal-transparent";
    hero_style: "cinematic-full" | "split" | "centered-luxury";
    section_spacing: "compact" | "normal" | "spacious";
    glass_intensity: "none" | "subtle" | "medium" | "heavy";
    dark_mode: boolean;
  };
  is_active: boolean;
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
  slug: string;
  description: string;
  short_description: string;
  featured_image: string;
  gallery_images: string[];
  duration: string;
  depth_max?: string;
  experience_level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  price: number | null;
  price_note?: string;
  included_items: string[];
  requirements: string[];
  is_featured: boolean;
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
  slug: string;
  certification_agency: "PADI" | "SSI" | "SDI" | "NAUI" | "TDI";
  level: "Beginner" | "Continuing Education" | "Rescue & Safety" | "Professional" | "Specialty";
  description: string;
  short_description: string;
  featured_image: string;
  duration: string;
  minimum_age?: number;
  prerequisites?: string;
  max_depth?: string;
  price: number | null;
  price_note?: string;
  learning_outcomes: string[];
  certification_card_included: boolean;
  gear_included: boolean;
  is_featured: boolean;
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
  slug: string;
  destination: string;
  boat_name?: string;
  short_description?: string;
  description: string;
  featured_image: string;
  gallery_images: string[];
  duration: string;
  departure_time?: string;
  return_time?: string;
  price: number | null;
  dives_included: number;
  meals_included: string[];
  itinerary: {
    time: string;
    activity: string;
  }[];
  is_featured: boolean;
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
  category: "Reef" | "Wrecks" | "Marine Life" | "Divers" | "Expeditions" | "Aerial";
  location?: string;
  status: ContentStatus;
  display_order: number;
  last_published_at?: string;
  last_modified_at?: string;
  has_unpublished_changes?: boolean;
  created_at?: string;
}

export interface Review {
  id: string;
  author_name: string;
  author_avatar?: string;
  diver_certification?: string;
  rating: number; // 1-5
  review_text: string;
  trip_or_course?: string;
  date: string;
  source: "Google" | "TripAdvisor" | "Direct Guest" | "Verified Guest";
  is_verified: boolean;
  is_featured: boolean;
  status: ContentStatus;
  last_published_at?: string;
  last_modified_at?: string;
  has_unpublished_changes?: boolean;
  created_at?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Courses & Certification" | "Equipment & Safety" | "Trips & Booking" | "Medical & Prerequisites";
  status: ContentStatus;
  display_order: number;
  last_published_at?: string;
  last_modified_at?: string;
  has_unpublished_changes?: boolean;
  created_at?: string;
}

export type InquiryStatus = "New" | "Contacted" | "Confirmed" | "Cancelled" | "Completed";

export interface BookingInquiry {
  id: string;
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
  updated_at?: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  file_size?: number;
  file_type?: string;
  alt_text?: string;
  caption?: string;
  storage_path?: string;
  bucket_name?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_email: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "Super Admin" | "Content Manager";
  avatar_url?: string;
  last_login?: string;
}
