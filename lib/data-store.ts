import {
  BusinessSettings,
  ThemeConfig,
  HomepageSection,
  Activity,
  Course,
  Trip,
  GalleryItem,
  Review,
  FAQ,
  BookingInquiry,
  MediaAsset,
  AuditLog,
  AdminUser,
} from "./types";
import { THEME_PRESETS } from "./theme-presets";
import {
  AUTHORITATIVE_BUSINESS_NAME,
  DEFAULT_BUSINESS_SETTINGS,
  DEFAULT_HOMEPAGE_SECTIONS,
  DEFAULT_ACTIVITIES,
  DEFAULT_COURSES,
  DEFAULT_TRIPS,
  DEFAULT_GALLERY,
  DEFAULT_REVIEWS,
  DEFAULT_FAQS,
} from "./business-config";
import { supabase, isSupabaseConfigured } from "./supabase";

export {
  DEFAULT_BUSINESS_SETTINGS,
  DEFAULT_HOMEPAGE_SECTIONS,
  DEFAULT_ACTIVITIES,
  DEFAULT_COURSES,
  DEFAULT_TRIPS,
  DEFAULT_GALLERY,
  DEFAULT_REVIEWS,
  DEFAULT_FAQS,
};

export const DEFAULT_INQUIRIES: BookingInquiry[] = [
  {
    id: "inq-1",
    customer_name: "Julian Sterling",
    customer_email: "julian.sterling@example.com",
    customer_phone: "+44 7700 900821",
    interest_type: "Trip",
    item_title: "Ras Mohammed Marine Reserve Day Safari",
    preferred_date: "2026-09-18",
    participants_count: 2,
    diver_level: "Advanced Open Water (60 dives)",
    special_requests: "Nitrox 32% requested for both divers. Also bringing underwater mirrorless housing.",
    status: "New",
    admin_notes: "Followed up via WhatsApp. Awaiting flight confirmation.",
    created_at: "2026-09-09T14:20:00Z",
  },
  {
    id: "inq-2",
    customer_name: "Sophia Martinez",
    customer_email: "sophia.m@example.com",
    customer_phone: "+34 600 123 456",
    interest_type: "Course",
    item_title: "PADI Open Water Diver Certification",
    preferred_date: "2026-09-22",
    participants_count: 1,
    diver_level: "Beginner (First time)",
    special_requests: "Would prefer morning pool sessions due to work schedule.",
    status: "Contacted",
    admin_notes: "Sent eLearning link and medical questionnaire.",
    created_at: "2026-09-08T09:15:00Z",
  },
];

export const DEFAULT_MEDIA: MediaAsset[] = [
  {
    id: "med-1",
    name: "hero-underwater-coral.jpg",
    url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop",
    file_size: 1420000,
    file_type: "image/jpeg",
    alt_text: "Crystal clear ocean coral reef",
    caption: "Hero backdrop photography",
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "med-2",
    name: "sea-turtle-glide.jpg",
    url: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1600&auto=format&fit=crop",
    file_size: 1180000,
    file_type: "image/jpeg",
    alt_text: "Sea turtle swimming in clear waters",
    caption: "Marine life showcase",
    created_at: "2026-09-01T08:15:00Z",
  },
  {
    id: "med-3",
    name: "deep-ocean-wall.jpg",
    url: "https://images.unsplash.com/photo-1560275619-4662e36fa65c?q=80&w=1600&auto=format&fit=crop",
    file_size: 1650000,
    file_type: "image/jpeg",
    alt_text: "Eagle ray flying over deep coral wall",
    caption: "Expeditions imagery",
    created_at: "2026-09-01T08:30:00Z",
  },
];

export const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-1",
    user_email: "system@internal",
    action: "SYSTEM_INITIALIZED",
    entity_type: "PLATFORM",
    details: "Production environment initialized with luxury design tokens.",
    created_at: "2026-09-01T08:00:00Z",
  },
];

const STORAGE_KEYS = {
  SETTINGS: "diving_vision_settings",
  THEME: "diving_vision_theme",
  SECTIONS: "diving_vision_sections",
  ACTIVITIES: "diving_vision_activities",
  COURSES: "diving_vision_courses",
  TRIPS: "diving_vision_trips",
  GALLERY: "diving_vision_gallery",
  REVIEWS: "diving_vision_reviews",
  FAQS: "diving_vision_faqs",
  INQUIRIES: "diving_vision_inquiries",
  MEDIA: "diving_vision_media",
  AUDIT_LOGS: "diving_vision_audit_logs",
  ADMIN_USER: "diving_vision_admin_user",
};

export class DataStore {
  private static isClient = typeof window !== "undefined";

  private static getItem<T>(key: string, defaultValue: T): T {
    if (!this.isClient) return defaultValue;
    try {
      let stored = localStorage.getItem(key);
      if (!stored && key.startsWith("diving_vision_")) {
        const legacyKey = key.replace("diving_vision_", "aura_oceanics_");
        stored = localStorage.getItem(legacyKey);
      }
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn(`Error reading ${key} from storage:`, e);
    }
    return defaultValue;
  }

  private static setItem<T>(key: string, value: T): void {
    if (!this.isClient) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent("store-sync", { detail: { key, value } }));
    } catch (e) {
      console.warn(`Error writing ${key} to storage:`, e);
    }
  }

  // UPLOAD FILE HELPER TO SERVER / SUPABASE STORAGE
  static async uploadFile(file: File, altText?: string, caption?: string): Promise<MediaAsset> {
    const formData = new FormData();
    formData.append("file", file);
    if (altText) formData.append("alt_text", altText);
    if (caption) formData.append("caption", caption);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "File upload failed");
    }

    const data = await response.json();
    const mediaItem: MediaAsset = data.media;

    // Save to media library collection
    const currentMedia = this.getMedia();
    this.setItem(STORAGE_KEYS.MEDIA, [mediaItem, ...currentMedia]);
    this.addAuditLog("MEDIA_UPLOADED", "STORAGE", `Uploaded ${mediaItem.name} to cloud storage`);

    return mediaItem;
  }

  // DRAFT & PUBLISHING LIFECYCLE
  static getPublishingStatus(): {
    hasUnpublishedChanges: boolean;
    lastPublishedAt: string;
    lastModifiedAt: string;
    pendingEntities: string[];
  } {
    const settings = this.getSettings();
    const activities = this.getActivities(true);
    const courses = this.getCourses(true);
    const trips = this.getTrips(true);
    const gallery = this.getGallery(true);
    const sections = this.getSections();

    const pending: string[] = [];
    if (settings.has_unpublished_changes) pending.push("Site Branding");
    if (activities.some((a) => a.has_unpublished_changes)) pending.push("Activities");
    if (courses.some((c) => c.has_unpublished_changes)) pending.push("Courses");
    if (trips.some((t) => t.has_unpublished_changes)) pending.push("Trips");
    if (gallery.some((g) => g.has_unpublished_changes)) pending.push("Gallery");
    if (sections.some((s) => s.has_unpublished_changes)) pending.push("Sections");

    return {
      hasUnpublishedChanges: pending.length > 0 || Boolean(settings.has_unpublished_changes),
      lastPublishedAt: settings.last_published_at || new Date().toISOString(),
      lastModifiedAt: settings.last_modified_at || new Date().toISOString(),
      pendingEntities: pending,
    };
  }

  static async publishAllChanges(): Promise<{ success: boolean; publishedAt: string }> {
    const publishedAt = new Date().toISOString();

    // 1. Commit Settings
    const settings = this.getSettings();
    this.setItem(STORAGE_KEYS.SETTINGS, {
      ...settings,
      last_published_at: publishedAt,
      has_unpublished_changes: false,
    });

    // 2. Commit Activities
    const activities = this.getActivities(true).map((a) => ({
      ...a,
      last_published_at: publishedAt,
      has_unpublished_changes: false,
    }));
    this.setItem(STORAGE_KEYS.ACTIVITIES, activities);

    // 3. Commit Courses
    const courses = this.getCourses(true).map((c) => ({
      ...c,
      last_published_at: publishedAt,
      has_unpublished_changes: false,
    }));
    this.setItem(STORAGE_KEYS.COURSES, courses);

    // 4. Commit Trips
    const trips = this.getTrips(true).map((t) => ({
      ...t,
      last_published_at: publishedAt,
      has_unpublished_changes: false,
    }));
    this.setItem(STORAGE_KEYS.TRIPS, trips);

    // 5. Commit Gallery
    const gallery = this.getGallery(true).map((g) => ({
      ...g,
      last_published_at: publishedAt,
      has_unpublished_changes: false,
    }));
    this.setItem(STORAGE_KEYS.GALLERY, gallery);

    // 6. Commit Sections
    const sections = this.getSections().map((s) => ({
      ...s,
      last_published_at: publishedAt,
      has_unpublished_changes: false,
    }));
    this.setItem(STORAGE_KEYS.SECTIONS, sections);

    // 7. Call Server-Side Cache Revalidation
    try {
      await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true, published_at: publishedAt }),
      });
    } catch (e) {
      console.warn("Revalidation API notification skipped in offline mode");
    }

    this.addAuditLog("PUBLIC_PUBLISH", "SYSTEM", "Published all draft updates to public live website");
    return { success: true, publishedAt };
  }

  // SETTINGS
  static getSettings(): BusinessSettings {
    return this.getItem(STORAGE_KEYS.SETTINGS, DEFAULT_BUSINESS_SETTINGS);
  }

  static updateSettings(settings: Partial<BusinessSettings>): BusinessSettings {
    const current = this.getSettings();
    const updated = {
      ...current,
      ...settings,
      last_modified_at: new Date().toISOString(),
      has_unpublished_changes: true,
      updated_at: new Date().toISOString(),
    };
    this.setItem(STORAGE_KEYS.SETTINGS, updated);
    this.addAuditLog("SETTINGS_UPDATED", "SITE_SETTINGS", "Saved draft business branding changes");
    return updated;
  }

  // THEME
  static getTheme(): ThemeConfig {
    return this.getItem(STORAGE_KEYS.THEME, THEME_PRESETS["premium-ocean"] || Object.values(THEME_PRESETS)[0]);
  }

  static setTheme(presetKey: string): ThemeConfig {
    const selected = THEME_PRESETS[presetKey] || THEME_PRESETS["premium-ocean"] || Object.values(THEME_PRESETS)[0];
    const withTimestamps = {
      ...selected,
      last_modified_at: new Date().toISOString(),
      has_unpublished_changes: true,
    };
    this.setItem(STORAGE_KEYS.THEME, withTimestamps);
    this.addAuditLog("THEME_CHANGED", "APPEARANCE", `Switched theme preset to ${selected.name}`);
    return withTimestamps;
  }

  static updateTheme(config: Partial<ThemeConfig>): ThemeConfig {
    const current = this.getTheme();
    const updated = {
      ...current,
      ...config,
      last_modified_at: new Date().toISOString(),
      has_unpublished_changes: true,
    };
    this.setItem(STORAGE_KEYS.THEME, updated);
    this.addAuditLog("THEME_CUSTOMIZED", "APPEARANCE", "Updated theme colors & typography styling");
    return updated;
  }

  static updateCustomTheme(config: Partial<ThemeConfig>): ThemeConfig {
    return this.updateTheme(config);
  }

  // SECTIONS
  static getSections(): HomepageSection[] {
    return this.getItem(STORAGE_KEYS.SECTIONS, DEFAULT_HOMEPAGE_SECTIONS);
  }

  static updateSection(id: string, updates: Partial<HomepageSection>): HomepageSection[] {
    const sections = this.getSections();
    const updated = sections.map((s) =>
      s.id === id
        ? {
            ...s,
            ...updates,
            last_modified_at: new Date().toISOString(),
            has_unpublished_changes: true,
          }
        : s
    );
    this.setItem(STORAGE_KEYS.SECTIONS, updated);
    this.addAuditLog("SECTION_UPDATED", "PAGE_BUILDER", `Updated section ${id}`);
    return updated;
  }

  static reorderSections(newOrder: HomepageSection[] | string[]): HomepageSection[] {
    const currentSections = this.getSections();
    let ordered: HomepageSection[] = [];

    if (newOrder.length > 0 && typeof newOrder[0] === "string") {
      const idList = newOrder as string[];
      ordered = idList
        .map((id, index) => {
          const sec = currentSections.find((s) => s.id === id);
          if (sec) {
            return {
              ...sec,
              display_order: index + 1,
              last_modified_at: new Date().toISOString(),
              has_unpublished_changes: true,
            };
          }
          return null;
        })
        .filter(Boolean) as HomepageSection[];
    } else {
      ordered = (newOrder as HomepageSection[]).map((s, index) => ({
        ...s,
        display_order: index + 1,
        last_modified_at: new Date().toISOString(),
        has_unpublished_changes: true,
      }));
    }

    this.setItem(STORAGE_KEYS.SECTIONS, ordered);
    this.addAuditLog("SECTIONS_REORDERED", "PAGE_BUILDER", "Reordered homepage sections hierarchy");
    return ordered;
  }

  // ACTIVITIES
  static getActivities(includeDrafts = false): Activity[] {
    const all = this.getItem(STORAGE_KEYS.ACTIVITIES, DEFAULT_ACTIVITIES);
    if (includeDrafts) return all;
    return all.filter((a) => a.status === "published");
  }

  static getActivityBySlug(slug: string): Activity | undefined {
    const all = this.getItem(STORAGE_KEYS.ACTIVITIES, DEFAULT_ACTIVITIES);
    return all.find((a) => a.slug === slug);
  }

  static addActivity(activity: Omit<Activity, "id">): Activity {
    const all = this.getActivities(true);
    const newActivity: Activity = {
      ...activity,
      id: `act-${Date.now()}`,
      has_unpublished_changes: true,
      last_modified_at: new Date().toISOString(),
    };
    const updated = [...all, newActivity];
    this.setItem(STORAGE_KEYS.ACTIVITIES, updated);
    this.addAuditLog("ACTIVITY_CREATED", "ACTIVITIES", `Created activity: ${newActivity.title}`);
    return newActivity;
  }

  static updateActivity(id: string, updates: Partial<Activity>): Activity[] {
    const all = this.getActivities(true);
    const updated = all.map((a) =>
      a.id === id
        ? {
            ...a,
            ...updates,
            has_unpublished_changes: true,
            last_modified_at: new Date().toISOString(),
          }
        : a
    );
    this.setItem(STORAGE_KEYS.ACTIVITIES, updated);
    this.addAuditLog("ACTIVITY_UPDATED", "ACTIVITIES", `Updated activity ${id}`);
    return updated;
  }

  static deleteActivity(id: string): Activity[] {
    const all = this.getActivities(true);
    const updated = all.filter((a) => a.id !== id);
    this.setItem(STORAGE_KEYS.ACTIVITIES, updated);
    this.addAuditLog("ACTIVITY_DELETED", "ACTIVITIES", `Deleted activity ${id}`);
    return updated;
  }

  static saveActivity(activity: Partial<Activity> & { id?: string }): Activity[] {
    if (activity.id) {
      return this.updateActivity(activity.id, activity);
    } else {
      this.addActivity(activity as Omit<Activity, "id">);
      return this.getActivities(true);
    }
  }

  // COURSES
  static getCourses(includeDrafts = false): Course[] {
    const all = this.getItem(STORAGE_KEYS.COURSES, DEFAULT_COURSES);
    if (includeDrafts) return all;
    return all.filter((c) => c.status === "published");
  }

  static getCourseBySlug(slug: string): Course | undefined {
    const all = this.getItem(STORAGE_KEYS.COURSES, DEFAULT_COURSES);
    return all.find((c) => c.slug === slug);
  }

  static addCourse(course: Omit<Course, "id">): Course {
    const all = this.getCourses(true);
    const newCourse: Course = {
      ...course,
      id: `crs-${Date.now()}`,
      has_unpublished_changes: true,
      last_modified_at: new Date().toISOString(),
    };
    const updated = [...all, newCourse];
    this.setItem(STORAGE_KEYS.COURSES, updated);
    this.addAuditLog("COURSE_CREATED", "COURSES", `Created course: ${newCourse.title}`);
    return newCourse;
  }

  static updateCourse(id: string, updates: Partial<Course>): Course[] {
    const all = this.getCourses(true);
    const updated = all.map((c) =>
      c.id === id
        ? {
            ...c,
            ...updates,
            has_unpublished_changes: true,
            last_modified_at: new Date().toISOString(),
          }
        : c
    );
    this.setItem(STORAGE_KEYS.COURSES, updated);
    this.addAuditLog("COURSE_UPDATED", "COURSES", `Updated course ${id}`);
    return updated;
  }

  static deleteCourse(id: string): Course[] {
    const all = this.getCourses(true);
    const updated = all.filter((c) => c.id !== id);
    this.setItem(STORAGE_KEYS.COURSES, updated);
    this.addAuditLog("COURSE_DELETED", "COURSES", `Deleted course ${id}`);
    return updated;
  }

  static saveCourse(course: Partial<Course> & { id?: string }): Course[] {
    if (course.id) {
      return this.updateCourse(course.id, course);
    } else {
      this.addCourse(course as Omit<Course, "id">);
      return this.getCourses(true);
    }
  }

  // TRIPS
  static getTrips(includeDrafts = false): Trip[] {
    const all = this.getItem(STORAGE_KEYS.TRIPS, DEFAULT_TRIPS);
    if (includeDrafts) return all;
    return all.filter((t) => t.status === "published");
  }

  static getTripBySlug(slug: string): Trip | undefined {
    const all = this.getItem(STORAGE_KEYS.TRIPS, DEFAULT_TRIPS);
    return all.find((t) => t.slug === slug);
  }

  static addTrip(trip: Omit<Trip, "id">): Trip {
    const all = this.getTrips(true);
    const newTrip: Trip = {
      ...trip,
      id: `trp-${Date.now()}`,
      has_unpublished_changes: true,
      last_modified_at: new Date().toISOString(),
    };
    const updated = [...all, newTrip];
    this.setItem(STORAGE_KEYS.TRIPS, updated);
    this.addAuditLog("TRIP_CREATED", "TRIPS", `Created trip: ${newTrip.title}`);
    return newTrip;
  }

  static updateTrip(id: string, updates: Partial<Trip>): Trip[] {
    const all = this.getTrips(true);
    const updated = all.map((t) =>
      t.id === id
        ? {
            ...t,
            ...updates,
            has_unpublished_changes: true,
            last_modified_at: new Date().toISOString(),
          }
        : t
    );
    this.setItem(STORAGE_KEYS.TRIPS, updated);
    this.addAuditLog("TRIP_UPDATED", "TRIPS", `Updated trip ${id}`);
    return updated;
  }

  static deleteTrip(id: string): Trip[] {
    const all = this.getTrips(true);
    const updated = all.filter((t) => t.id !== id);
    this.setItem(STORAGE_KEYS.TRIPS, updated);
    this.addAuditLog("TRIP_DELETED", "TRIPS", `Deleted trip ${id}`);
    return updated;
  }

  static saveTrip(trip: Partial<Trip> & { id?: string }): Trip[] {
    if (trip.id) {
      return this.updateTrip(trip.id, trip);
    } else {
      this.addTrip(trip as Omit<Trip, "id">);
      return this.getTrips(true);
    }
  }

  // GALLERY
  static getGallery(includeDrafts = false): GalleryItem[] {
    const all = this.getItem(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
    if (includeDrafts) return all;
    return all.filter((g) => g.status === "published");
  }

  static addGalleryItem(item: Omit<GalleryItem, "id">): GalleryItem {
    const all = this.getGallery(true);
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
      has_unpublished_changes: true,
      last_modified_at: new Date().toISOString(),
    };
    const updated = [...all, newItem];
    this.setItem(STORAGE_KEYS.GALLERY, updated);
    this.addAuditLog("GALLERY_ITEM_ADDED", "GALLERY", `Added photo: ${newItem.title}`);
    return newItem;
  }

  static updateGalleryItem(id: string, updates: Partial<GalleryItem>): GalleryItem[] {
    const all = this.getGallery(true);
    const updated = all.map((g) =>
      g.id === id
        ? {
            ...g,
            ...updates,
            has_unpublished_changes: true,
            last_modified_at: new Date().toISOString(),
          }
        : g
    );
    this.setItem(STORAGE_KEYS.GALLERY, updated);
    this.addAuditLog("GALLERY_ITEM_UPDATED", "GALLERY", `Updated gallery photo ${id}`);
    return updated;
  }

  static deleteGalleryItem(id: string): GalleryItem[] {
    const all = this.getGallery(true);
    const updated = all.filter((g) => g.id !== id);
    this.setItem(STORAGE_KEYS.GALLERY, updated);
    this.addAuditLog("GALLERY_ITEM_DELETED", "GALLERY", `Deleted photo ${id}`);
    return updated;
  }

  static saveGalleryItem(item: Partial<GalleryItem> & { id?: string }): GalleryItem[] {
    if (item.id) {
      return this.updateGalleryItem(item.id, item);
    } else {
      this.addGalleryItem(item as Omit<GalleryItem, "id">);
      return this.getGallery(true);
    }
  }

  // REVIEWS
  static getReviews(includeDrafts = false): Review[] {
    const all = this.getItem(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    if (includeDrafts) return all;
    return all.filter((r) => r.status === "published");
  }

  static addReview(review: Omit<Review, "id">): Review {
    const all = this.getReviews(true);
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      has_unpublished_changes: true,
      last_modified_at: new Date().toISOString(),
    };
    const updated = [...all, newReview];
    this.setItem(STORAGE_KEYS.REVIEWS, updated);
    this.addAuditLog("REVIEW_ADDED", "REVIEWS", `Added guest review from ${newReview.author_name}`);
    return newReview;
  }

  static updateReview(id: string, updates: Partial<Review>): Review[] {
    const all = this.getReviews(true);
    const updated = all.map((r) =>
      r.id === id
        ? {
            ...r,
            ...updates,
            has_unpublished_changes: true,
            last_modified_at: new Date().toISOString(),
          }
        : r
    );
    this.setItem(STORAGE_KEYS.REVIEWS, updated);
    this.addAuditLog("REVIEW_UPDATED", "REVIEWS", `Updated review ${id}`);
    return updated;
  }

  static deleteReview(id: string): Review[] {
    const all = this.getReviews(true);
    const updated = all.filter((r) => r.id !== id);
    this.setItem(STORAGE_KEYS.REVIEWS, updated);
    this.addAuditLog("REVIEW_DELETED", "REVIEWS", `Deleted review ${id}`);
    return updated;
  }

  static saveReview(review: Partial<Review> & { id?: string }): Review[] {
    if (review.id) {
      return this.updateReview(review.id, review);
    } else {
      this.addReview(review as Omit<Review, "id">);
      return this.getReviews(true);
    }
  }

  // FAQS
  static getFaqs(includeDrafts = false): FAQ[] {
    const all = this.getItem(STORAGE_KEYS.FAQS, DEFAULT_FAQS);
    if (includeDrafts) return all;
    return all.filter((f) => f.status === "published");
  }

  static addFaq(faq: Omit<FAQ, "id">): FAQ {
    const all = this.getFaqs(true);
    const newFaq: FAQ = {
      ...faq,
      id: `faq-${Date.now()}`,
      has_unpublished_changes: true,
      last_modified_at: new Date().toISOString(),
    };
    const updated = [...all, newFaq];
    this.setItem(STORAGE_KEYS.FAQS, updated);
    this.addAuditLog("FAQ_ADDED", "FAQS", `Created FAQ item: ${newFaq.question}`);
    return newFaq;
  }

  static updateFaq(id: string, updates: Partial<FAQ>): FAQ[] {
    const all = this.getFaqs(true);
    const updated = all.map((f) =>
      f.id === id
        ? {
            ...f,
            ...updates,
            has_unpublished_changes: true,
            last_modified_at: new Date().toISOString(),
          }
        : f
    );
    this.setItem(STORAGE_KEYS.FAQS, updated);
    this.addAuditLog("FAQ_UPDATED", "FAQS", `Updated FAQ item ${id}`);
    return updated;
  }

  static deleteFaq(id: string): FAQ[] {
    const all = this.getFaqs(true);
    const updated = all.filter((f) => f.id !== id);
    this.setItem(STORAGE_KEYS.FAQS, updated);
    this.addAuditLog("FAQ_DELETED", "FAQS", `Deleted FAQ item ${id}`);
    return updated;
  }

  static saveFaq(faq: Partial<FAQ> & { id?: string }): FAQ[] {
    if (faq.id) {
      return this.updateFaq(faq.id, faq);
    } else {
      this.addFaq(faq as Omit<FAQ, "id">);
      return this.getFaqs(true);
    }
  }

  // INQUIRIES
  static getInquiries(): BookingInquiry[] {
    return this.getItem(STORAGE_KEYS.INQUIRIES, DEFAULT_INQUIRIES);
  }

  static addInquiry(inquiry: Omit<BookingInquiry, "id" | "created_at">): BookingInquiry {
    const all = this.getInquiries();
    const newInquiry: BookingInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [newInquiry, ...all];
    this.setItem(STORAGE_KEYS.INQUIRIES, updated);
    this.addAuditLog("NEW_INQUIRY", "BOOKINGS", `Received inquiry from ${newInquiry.customer_name}`);
    return newInquiry;
  }

  static updateInquiryStatus(id: string, status: BookingInquiry["status"], adminNotes?: string): BookingInquiry[] {
    const all = this.getInquiries();
    const updated = all.map((inq) =>
      inq.id === id
        ? {
            ...inq,
            status,
            admin_notes: adminNotes !== undefined ? adminNotes : inq.admin_notes,
          }
        : inq
    );
    this.setItem(STORAGE_KEYS.INQUIRIES, updated);
    this.addAuditLog("INQUIRY_STATUS_CHANGED", "BOOKINGS", `Updated inquiry ${id} status to ${status}`);
    return updated;
  }

  static deleteInquiry(id: string): BookingInquiry[] {
    const all = this.getInquiries();
    const updated = all.filter((inq) => inq.id !== id);
    this.setItem(STORAGE_KEYS.INQUIRIES, updated);
    this.addAuditLog("INQUIRY_DELETED", "BOOKINGS", `Removed inquiry ${id}`);
    return updated;
  }

  // MEDIA
  static getMedia(): MediaAsset[] {
    return this.getItem(STORAGE_KEYS.MEDIA, DEFAULT_MEDIA);
  }

  static addMedia(media: Omit<MediaAsset, "id" | "created_at">): MediaAsset {
    const all = this.getMedia();
    const newItem: MediaAsset = {
      ...media,
      id: `med-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [newItem, ...all];
    this.setItem(STORAGE_KEYS.MEDIA, updated);
    this.addAuditLog("MEDIA_UPLOADED", "MEDIA", `Uploaded media asset ${media.name}`);
    return newItem;
  }

  static deleteMedia(id: string): MediaAsset[] {
    const all = this.getMedia().filter((m) => m.id !== id);
    this.setItem(STORAGE_KEYS.MEDIA, all);
    this.addAuditLog("MEDIA_DELETED", "MEDIA", `Removed media asset ${id}`);
    return all;
  }

  // AUDIT LOGS
  static getAuditLogs(): AuditLog[] {
    return this.getItem(STORAGE_KEYS.AUDIT_LOGS, DEFAULT_AUDIT_LOGS);
  }

  static addAuditLog(action: string, entity_type: string, details: string, entity_id?: string): void {
    const currentLogs = this.getItem(STORAGE_KEYS.AUDIT_LOGS, DEFAULT_AUDIT_LOGS);
    const user = this.getAdminUser();
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_email: user ? user.email : "system@divingvisioncenter.com",
      action,
      entity_type,
      entity_id,
      details,
      created_at: new Date().toISOString(),
    };
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...currentLogs.slice(0, 99)]);
  }

  // ADMIN AUTH (Super Admin & Content Manager)
  static getAdminUser(): AdminUser | null {
    return this.getItem(STORAGE_KEYS.ADMIN_USER, {
      id: "usr-superadmin-1",
      email: "admin@divingvisioncenter.com",
      name: "Master Administrator",
      role: "Super Admin",
      avatar_url: "",
      last_login: new Date().toISOString(),
    });
  }

  static setAdminUser(user: AdminUser | null): void {
    this.setItem(STORAGE_KEYS.ADMIN_USER, user);
  }

  static resetToDefaults(): void {
    if (!this.isClient) return;
    localStorage.clear();
    window.location.reload();
  }
}
