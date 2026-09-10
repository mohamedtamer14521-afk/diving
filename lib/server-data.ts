import {
  DEFAULT_BUSINESS_SETTINGS,
  DEFAULT_HOMEPAGE_SECTIONS,
  DEFAULT_ACTIVITIES,
  DEFAULT_COURSES,
  DEFAULT_TRIPS,
  DEFAULT_GALLERY,
  DEFAULT_REVIEWS,
  DEFAULT_FAQS,
  AUTHORITATIVE_BUSINESS_NAME,
} from "./business-config";
import {
  BusinessSettings,
  HomepageSection,
  Activity,
  Course,
  Trip,
  GalleryItem,
  Review,
  FAQ,
  ThemeConfig,
} from "./types";
import { THEME_PRESETS } from "./theme-presets";
import { supabase, isSupabaseConfigured } from "./supabase";

/**
 * Authoritative Server-Side Data Fetchers for Next.js SSR / ISR.
 * These functions execute only on the server, querying Supabase when configured,
 * and falling back deterministically to DEFAULT business data.
 */

export async function getPublishedBusinessSettings(): Promise<BusinessSettings> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("business_settings")
        .select("*")
        .eq("id", "singleton")
        .single();

      if (!error && data) {
        return {
          business_name: data.business_name || AUTHORITATIVE_BUSINESS_NAME,
          tagline: data.tagline || DEFAULT_BUSINESS_SETTINGS.tagline,
          description: data.description || DEFAULT_BUSINESS_SETTINGS.description,
          logo_url: data.logo_url || "",
          favicon_url: data.favicon_url || "",
          phone: data.phone || DEFAULT_BUSINESS_SETTINGS.phone,
          whatsapp_number: data.whatsapp_number || DEFAULT_BUSINESS_SETTINGS.whatsapp_number,
          whatsapp_default_message:
            data.whatsapp_default_message || DEFAULT_BUSINESS_SETTINGS.whatsapp_default_message,
          whatsapp_config: data.whatsapp_config || DEFAULT_BUSINESS_SETTINGS.whatsapp_config,
          email: data.email || DEFAULT_BUSINESS_SETTINGS.email,
          address: data.address || DEFAULT_BUSINESS_SETTINGS.address,
          city: data.city || DEFAULT_BUSINESS_SETTINGS.city,
          country: data.country || DEFAULT_BUSINESS_SETTINGS.country,
          google_maps_url: data.google_maps_url || DEFAULT_BUSINESS_SETTINGS.google_maps_url,
          currency: data.currency || DEFAULT_BUSINESS_SETTINGS.currency,
          opening_hours: data.opening_hours || DEFAULT_BUSINESS_SETTINGS.opening_hours,
          social_links: data.social_links || DEFAULT_BUSINESS_SETTINGS.social_links,
          last_published_at: data.last_published_at || DEFAULT_BUSINESS_SETTINGS.last_published_at,
          last_modified_at: data.last_modified_at || DEFAULT_BUSINESS_SETTINGS.last_modified_at,
          has_unpublished_changes: false,
        };
      }
    } catch (e) {
      console.warn("Could not load business settings from Supabase, using defaults:", e);
    }
  }

  return DEFAULT_BUSINESS_SETTINGS;
}

export async function getPublishedSections(): Promise<HomepageSection[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("homepage_sections")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as HomepageSection[];
      }
    } catch (e) {
      console.warn("Could not load homepage sections from Supabase, using defaults:", e);
    }
  }

  return DEFAULT_HOMEPAGE_SECTIONS;
}

export async function getPublishedActivities(): Promise<Activity[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("status", "published")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Activity[];
      }
    } catch (e) {
      console.warn("Could not load activities from Supabase, using defaults:", e);
    }
  }

  return DEFAULT_ACTIVITIES.filter((a) => a.status === "published");
}

export async function getPublishedCourses(): Promise<Course[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("status", "published")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Course[];
      }
    } catch (e) {
      console.warn("Could not load courses from Supabase, using defaults:", e);
    }
  }

  return DEFAULT_COURSES.filter((c) => c.status === "published");
}

export async function getPublishedTrips(): Promise<Trip[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("status", "published")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Trip[];
      }
    } catch (e) {
      console.warn("Could not load trips from Supabase, using defaults:", e);
    }
  }

  return DEFAULT_TRIPS.filter((t) => t.status === "published");
}

export async function getPublishedGallery(): Promise<GalleryItem[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .eq("status", "published")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as GalleryItem[];
      }
    } catch (e) {
      console.warn("Could not load gallery from Supabase, using defaults:", e);
    }
  }

  return DEFAULT_GALLERY.filter((g) => g.status === "published");
}

export async function getPublishedReviews(): Promise<Review[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("status", "published")
        .order("date", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Review[];
      }
    } catch (e) {
      console.warn("Could not load reviews from Supabase, using defaults:", e);
    }
  }

  return DEFAULT_REVIEWS.filter((r) => r.status === "published");
}

export async function getPublishedFaqs(): Promise<FAQ[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("status", "published")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as FAQ[];
      }
    } catch (e) {
      console.warn("Could not load faqs from Supabase, using defaults:", e);
    }
  }

  return DEFAULT_FAQS.filter((f) => f.status === "published");
}

export async function getPublishedTheme(): Promise<ThemeConfig> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("theme_config")
        .select("*")
        .eq("id", "singleton")
        .single();

      if (!error && data) {
        return data as ThemeConfig;
      }
    } catch (e) {
      console.warn("Could not load theme config from Supabase, using defaults:", e);
    }
  }

  return THEME_PRESETS["premium-ocean"] || Object.values(THEME_PRESETS)[0];
}

export async function getPublishedHomepageData() {
  const [
    businessSettings,
    sections,
    activities,
    courses,
    trips,
    gallery,
    reviews,
    faqs,
    theme,
  ] = await Promise.all([
    getPublishedBusinessSettings(),
    getPublishedSections(),
    getPublishedActivities(),
    getPublishedCourses(),
    getPublishedTrips(),
    getPublishedGallery(),
    getPublishedReviews(),
    getPublishedFaqs(),
    getPublishedTheme(),
  ]);

  return {
    businessSettings,
    sections,
    activities,
    courses,
    trips,
    gallery,
    reviews,
    faqs,
    theme,
  };
}
