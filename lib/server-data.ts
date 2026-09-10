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
import { getServerContent } from "./server-store";

/**
 * Authoritative Server-Side Data Fetchers for Next.js SSR / ISR.
 * Dynamically queries persistent server store and Supabase.
 */

export async function getPublishedBusinessSettings(): Promise<BusinessSettings> {
  const serverContent = getServerContent();

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .single();

      if (!error && data) {
        return {
          ...serverContent.settings,
          business_name: data.business_name || serverContent.settings.business_name || AUTHORITATIVE_BUSINESS_NAME,
          tagline: data.tagline || serverContent.settings.tagline,
          description: data.description || serverContent.settings.description,
          logo_url: data.logo_url || serverContent.settings.logo_url,
          favicon_url: data.favicon_url || serverContent.settings.favicon_url,
          phone: data.phone || serverContent.settings.phone,
          whatsapp_number: data.whatsapp_number || serverContent.settings.whatsapp_number,
          whatsapp_default_message:
            data.whatsapp_default_message || serverContent.settings.whatsapp_default_message,
          whatsapp_config: data.whatsapp_config || serverContent.settings.whatsapp_config,
          email: data.email || serverContent.settings.email,
          address: data.address || serverContent.settings.address,
          city: data.city || serverContent.settings.city,
          country: data.country || serverContent.settings.country,
          google_maps_url: data.google_maps_url || serverContent.settings.google_maps_url,
          currency: data.currency || serverContent.settings.currency,
          opening_hours: data.opening_hours || serverContent.settings.opening_hours,
          social_links: data.social_links || serverContent.settings.social_links,
          last_published_at: data.last_published_at || serverContent.settings.last_published_at,
          last_modified_at: data.last_modified_at || serverContent.settings.last_modified_at,
          has_unpublished_changes: false,
        };
      }
    } catch (e) {
      console.warn("Could not load business settings from Supabase, using server content:", e);
    }
  }

  return serverContent.settings || DEFAULT_BUSINESS_SETTINGS;
}

export async function getPublishedSections(): Promise<HomepageSection[]> {
  const serverContent = getServerContent();

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
      console.warn("Could not load sections from Supabase:", e);
    }
  }

  return serverContent.sections || DEFAULT_HOMEPAGE_SECTIONS;
}

export async function getPublishedActivities(): Promise<Activity[]> {
  const serverContent = getServerContent();

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
      console.warn("Could not load activities from Supabase:", e);
    }
  }

  return (serverContent.activities || DEFAULT_ACTIVITIES).filter((a) => a.status === "published");
}

export async function getPublishedCourses(): Promise<Course[]> {
  const serverContent = getServerContent();

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
      console.warn("Could not load courses from Supabase:", e);
    }
  }

  return (serverContent.courses || DEFAULT_COURSES).filter((c) => c.status === "published");
}

export async function getPublishedTrips(): Promise<Trip[]> {
  const serverContent = getServerContent();

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
      console.warn("Could not load trips from Supabase:", e);
    }
  }

  return (serverContent.trips || DEFAULT_TRIPS).filter((t) => t.status === "published");
}

export async function getPublishedGallery(): Promise<GalleryItem[]> {
  const serverContent = getServerContent();

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
      console.warn("Could not load gallery from Supabase:", e);
    }
  }

  return (serverContent.gallery || DEFAULT_GALLERY).filter((g) => g.status === "published");
}

export async function getPublishedReviews(): Promise<Review[]> {
  const serverContent = getServerContent();

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
      console.warn("Could not load reviews from Supabase:", e);
    }
  }

  return (serverContent.reviews || DEFAULT_REVIEWS).filter((r) => r.status === "published");
}

export async function getPublishedFaqs(): Promise<FAQ[]> {
  const serverContent = getServerContent();

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
      console.warn("Could not load faqs from Supabase:", e);
    }
  }

  return (serverContent.faqs || DEFAULT_FAQS).filter((f) => f.status === "published");
}

export async function getPublishedTheme(): Promise<ThemeConfig> {
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
