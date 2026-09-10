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
    item_title: "Ras Mohammed National Park Boat Safari",
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
    name: "ras-mohammed-shark-reef.jpg",
    url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop",
    file_size: 1420000,
    file_type: "image/jpeg",
    alt_text: "Shark & Yolanda Reef in Ras Mohammed",
    caption: "Ras Mohammed Marine Reserve",
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "med-2",
    name: "thistlegorm-wreck.jpg",
    url: "https://images.unsplash.com/photo-1560275619-4662e36fa65c?q=80&w=1600&auto=format&fit=crop",
    file_size: 1650000,
    file_type: "image/jpeg",
    alt_text: "SS Thistlegorm WW2 shipwreck",
    caption: "WW2 Shipwreck Exploration",
    created_at: "2026-09-01T08:15:00Z",
  },
  {
    id: "med-3",
    name: "tiran-sea-turtle.jpg",
    url: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1600&auto=format&fit=crop",
    file_size: 1180000,
    file_type: "image/jpeg",
    alt_text: "Hawksbill sea turtle in Straits of Tiran",
    caption: "Jackson Reef marine encounter",
    created_at: "2026-09-01T08:30:00Z",
  },
];

export const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-1",
    user_email: "admin@divingvisioncenter.com",
    action: "SYSTEM_INITIALIZED",
    entity_type: "PLATFORM",
    details: "Diving Vision Center production platform initialized.",
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

/**
 * Helper to sync changes to server API in background
 */
async function syncToServer(entity: string, payload: any) {
  try {
    if (typeof window !== "undefined") {
      await fetch(`/api/data/${entity}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
  } catch (e) {
    console.warn(`Background sync notice for ${entity}:`, e);
  }
}

export class DataStore {
  private static isClient = typeof window !== "undefined";

  private static getItem<T>(key: string, defaultValue: T): T {
    if (!this.isClient) return defaultValue;
    try {
      let stored = localStorage.getItem(key);
      if (!stored) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.warn(`Error reading ${key} from storage:`, e);
      return defaultValue;
    }
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

  // UPLOAD FILE HELPER WITH FAIL-SAFE RESILIENCE
  static async uploadFile(file: File, altText?: string, caption?: string): Promise<MediaAsset> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (altText) formData.append("alt_text", altText);
      if (caption) formData.append("caption", caption);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.media) {
          const mediaItem: MediaAsset = data.media;
          const currentMedia = this.getMedia();
          this.setItem(STORAGE_KEYS.MEDIA, [mediaItem, ...currentMedia]);
          syncToServer("media", [mediaItem, ...currentMedia]);
          this.addAuditLog("MEDIA_UPLOADED", "STORAGE", `Uploaded ${mediaItem.name} to media library`);
          return mediaItem;
        }
      }
    } catch (e) {
      console.warn("Upload network notice, activating client-side fallback:", e);
    }

    // Client-side Fallback
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const fallbackMedia: MediaAsset = {
          id: `med-${Date.now()}`,
          name: file.name,
          url: dataUrl,
          file_size: file.size,
          file_type: file.type || "image/jpeg",
          alt_text: altText || file.name,
          caption: caption || "",
          created_at: new Date().toISOString(),
        };
        const currentMedia = this.getMedia();
        this.setItem(STORAGE_KEYS.MEDIA, [fallbackMedia, ...currentMedia]);
        syncToServer("media", [fallbackMedia, ...currentMedia]);
        this.addAuditLog("MEDIA_UPLOADED", "LOCAL", `Saved ${fallbackMedia.name} to local media library`);
        resolve(fallbackMedia);
      };
      reader.readAsDataURL(file);
    });
  }

  // PUBLISHING LIFECYCLE
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

  static async publishAllChanges(): Promise<void> {
    const now = new Date().toISOString();

    // 1. Mark all items as published locally
    const settings = { ...this.getSettings(), has_unpublished_changes: false, last_published_at: now };
    this.setItem(STORAGE_KEYS.SETTINGS, settings);

    const sections = this.getSections().map((s) => ({ ...s, has_unpublished_changes: false }));
    this.setItem(STORAGE_KEYS.SECTIONS, sections);

    const activities = this.getActivities(true).map((a) => ({ ...a, has_unpublished_changes: false }));
    this.setItem(STORAGE_KEYS.ACTIVITIES, activities);

    const courses = this.getCourses(true).map((c) => ({ ...c, has_unpublished_changes: false }));
    this.setItem(STORAGE_KEYS.COURSES, courses);

    const trips = this.getTrips(true).map((t) => ({ ...t, has_unpublished_changes: false }));
    this.setItem(STORAGE_KEYS.TRIPS, trips);

    const gallery = this.getGallery(true).map((g) => ({ ...g, has_unpublished_changes: false }));
    this.setItem(STORAGE_KEYS.GALLERY, gallery);

    const reviews = this.getReviews(true).map((r) => ({ ...r, has_unpublished_changes: false }));
    this.setItem(STORAGE_KEYS.REVIEWS, reviews);

    const faqs = this.getFaqs(true).map((f) => ({ ...f, has_unpublished_changes: false }));
    this.setItem(STORAGE_KEYS.FAQS, faqs);

    // 2. Sync all collections to Server & Supabase
    await Promise.all([
      syncToServer("settings", settings),
      syncToServer("sections", sections),
      syncToServer("activities", activities),
      syncToServer("courses", courses),
      syncToServer("trips", trips),
      syncToServer("gallery", gallery),
      syncToServer("reviews", reviews),
      syncToServer("faqs", faqs),
    ]);

    // 3. Trigger publish cache revalidation
    try {
      await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
    } catch (e) {
      console.warn("Publish revalidation notice:", e);
    }

    this.addAuditLog("PLATFORM_PUBLISHED", "SYSTEM", "Published all drafted changes to live website.");
  }

  // BUSINESS SETTINGS
  static getSettings(): BusinessSettings {
    return this.getItem(STORAGE_KEYS.SETTINGS, DEFAULT_BUSINESS_SETTINGS);
  }

  static updateSettings(settings: Partial<BusinessSettings>): BusinessSettings {
    const current = this.getSettings();
    const updated: BusinessSettings = {
      ...current,
      ...settings,
      last_modified_at: new Date().toISOString(),
      has_unpublished_changes: true,
    };
    this.setItem(STORAGE_KEYS.SETTINGS, updated);
    syncToServer("settings", updated);
    this.addAuditLog("SETTINGS_UPDATED", "BRANDING", "Updated business information and branding.");
    return updated;
  }

  // THEME
  static getTheme(): ThemeConfig {
    return this.getItem(STORAGE_KEYS.THEME, THEME_PRESETS["premium-ocean"]);
  }

  static updateTheme(theme: Partial<ThemeConfig>): ThemeConfig {
    const current = this.getTheme();
    const merged: ThemeConfig = {
      ...current,
      ...theme,
      colors: {
        ...current.colors,
        ...(theme.colors || {}),
      },
      typography: {
        ...current.typography,
        ...(theme.typography || {}),
      },
      styling: {
        ...current.styling,
        ...(theme.styling || {}),
      },
      last_modified_at: new Date().toISOString(),
      has_unpublished_changes: true,
    };
    this.setItem(STORAGE_KEYS.THEME, merged);
    syncToServer("themes", merged);
    this.addAuditLog("THEME_UPDATED", "APPEARANCE", `Applied visual theme "${merged.name}".`);
    return merged;
  }

  static setTheme(presetKey: string): ThemeConfig {
    const preset = THEME_PRESETS[presetKey] || THEME_PRESETS["premium-ocean"];
    return this.updateTheme(preset);
  }

  static updateCustomTheme(theme: Partial<ThemeConfig>): ThemeConfig {
    return this.updateTheme(theme);
  }

  // HOMEPAGE SECTIONS
  static getSections(): HomepageSection[] {
    return this.getItem(STORAGE_KEYS.SECTIONS, DEFAULT_HOMEPAGE_SECTIONS);
  }

  static updateSection(id: string, updates: Partial<HomepageSection>): HomepageSection[] {
    const sections = this.getSections();
    const index = sections.findIndex((s) => s.id === id);
    if (index !== -1) {
      sections[index] = { ...sections[index], ...updates, has_unpublished_changes: true };
      this.setItem(STORAGE_KEYS.SECTIONS, sections);
      syncToServer("sections", sections);
      this.addAuditLog("SECTION_UPDATED", "LAYOUT", `Modified section "${sections[index].name}".`);
    }
    return sections;
  }

  static reorderSections(orderedIds: string[]): HomepageSection[] {
    const sections = this.getSections();
    const updated = orderedIds
      .map((id, index) => {
        const sec = sections.find((s) => s.id === id);
        return sec ? { ...sec, display_order: index + 1, has_unpublished_changes: true } : null;
      })
      .filter(Boolean) as HomepageSection[];

    this.setItem(STORAGE_KEYS.SECTIONS, updated);
    syncToServer("sections", updated);
    this.addAuditLog("SECTIONS_REORDERED", "LAYOUT", "Reordered homepage sections.");
    return updated;
  }

  // ACTIVITIES
  static getActivities(includeAll = false): Activity[] {
    const activities = this.getItem(STORAGE_KEYS.ACTIVITIES, DEFAULT_ACTIVITIES);
    return includeAll ? activities : activities.filter((a) => a.status === "published");
  }

  static saveActivity(activity: Activity): Activity[] {
    const activities = this.getItem<Activity[]>(STORAGE_KEYS.ACTIVITIES, DEFAULT_ACTIVITIES);
    const index = activities.findIndex((a) => a.id === activity.id);
    let updated: Activity[];
    if (index !== -1) {
      activities[index] = { ...activity, has_unpublished_changes: true };
      updated = [...activities];
      this.addAuditLog("ACTIVITY_UPDATED", "EXPERIENCES", `Updated activity "${activity.title}".`);
    } else {
      updated = [...activities, { ...activity, has_unpublished_changes: true }];
      this.addAuditLog("ACTIVITY_CREATED", "EXPERIENCES", `Created new activity "${activity.title}".`);
    }
    this.setItem(STORAGE_KEYS.ACTIVITIES, updated);
    syncToServer("activities", updated);
    return updated;
  }

  static addActivity(activity: Omit<Activity, "id">): Activity {
    const current = this.getItem<Activity[]>(STORAGE_KEYS.ACTIVITIES, DEFAULT_ACTIVITIES);
    const newActivity: Activity = {
      ...activity,
      id: `act-${Date.now()}`,
      display_order: current.length + 1,
      has_unpublished_changes: true,
    };
    const updated = [...current, newActivity];
    this.setItem(STORAGE_KEYS.ACTIVITIES, updated);
    syncToServer("activities", updated);
    this.addAuditLog("ACTIVITY_CREATED", "EXPERIENCES", `Created new activity "${newActivity.title}".`);
    return newActivity;
  }

  static updateActivity(id: string, updates: Partial<Activity>): Activity[] {
    const activities = this.getItem<Activity[]>(STORAGE_KEYS.ACTIVITIES, DEFAULT_ACTIVITIES);
    const index = activities.findIndex((a) => a.id === id);
    if (index !== -1) {
      activities[index] = { ...activities[index], ...updates, has_unpublished_changes: true };
      this.setItem(STORAGE_KEYS.ACTIVITIES, activities);
      syncToServer("activities", activities);
      this.addAuditLog("ACTIVITY_UPDATED", "EXPERIENCES", `Updated activity "${activities[index].title}".`);
    }
    return activities;
  }

  static deleteActivity(id: string): Activity[] {
    const activities = this.getItem<Activity[]>(STORAGE_KEYS.ACTIVITIES, DEFAULT_ACTIVITIES);
    const filtered = activities.filter((a) => a.id !== id);
    this.setItem(STORAGE_KEYS.ACTIVITIES, filtered);
    syncToServer("activities", filtered);
    this.addAuditLog("ACTIVITY_DELETED", "EXPERIENCES", `Removed activity ID: ${id}`);
    return filtered;
  }

  // COURSES
  static getCourses(includeAll = false): Course[] {
    const courses = this.getItem(STORAGE_KEYS.COURSES, DEFAULT_COURSES);
    return includeAll ? courses : courses.filter((c) => c.status === "published");
  }

  static saveCourse(course: Course): Course[] {
    const courses = this.getItem<Course[]>(STORAGE_KEYS.COURSES, DEFAULT_COURSES);
    const index = courses.findIndex((c) => c.id === course.id);
    let updated: Course[];
    if (index !== -1) {
      courses[index] = { ...course, has_unpublished_changes: true };
      updated = [...courses];
      this.addAuditLog("COURSE_UPDATED", "ACADEMY", `Updated course "${course.title}".`);
    } else {
      updated = [...courses, { ...course, has_unpublished_changes: true }];
      this.addAuditLog("COURSE_CREATED", "ACADEMY", `Added certification course "${course.title}".`);
    }
    this.setItem(STORAGE_KEYS.COURSES, updated);
    syncToServer("courses", updated);
    return updated;
  }

  static addCourse(course: Omit<Course, "id">): Course {
    const current = this.getItem<Course[]>(STORAGE_KEYS.COURSES, DEFAULT_COURSES);
    const newCourse: Course = {
      ...course,
      id: `course-${Date.now()}`,
      display_order: current.length + 1,
      has_unpublished_changes: true,
    };
    const updated = [...current, newCourse];
    this.setItem(STORAGE_KEYS.COURSES, updated);
    syncToServer("courses", updated);
    this.addAuditLog("COURSE_CREATED", "ACADEMY", `Added certification course "${newCourse.title}".`);
    return newCourse;
  }

  static updateCourse(id: string, updates: Partial<Course>): Course[] {
    const courses = this.getItem<Course[]>(STORAGE_KEYS.COURSES, DEFAULT_COURSES);
    const index = courses.findIndex((c) => c.id === id);
    if (index !== -1) {
      courses[index] = { ...courses[index], ...updates, has_unpublished_changes: true };
      this.setItem(STORAGE_KEYS.COURSES, courses);
      syncToServer("courses", courses);
      this.addAuditLog("COURSE_UPDATED", "ACADEMY", `Updated course "${courses[index].title}".`);
    }
    return courses;
  }

  static deleteCourse(id: string): Course[] {
    const courses = this.getItem<Course[]>(STORAGE_KEYS.COURSES, DEFAULT_COURSES);
    const filtered = courses.filter((c) => c.id !== id);
    this.setItem(STORAGE_KEYS.COURSES, filtered);
    syncToServer("courses", filtered);
    this.addAuditLog("COURSE_DELETED", "ACADEMY", `Removed course ID: ${id}`);
    return filtered;
  }

  // TRIPS
  static getTrips(includeAll = false): Trip[] {
    const trips = this.getItem(STORAGE_KEYS.TRIPS, DEFAULT_TRIPS);
    return includeAll ? trips : trips.filter((t) => t.status === "published");
  }

  static saveTrip(trip: Trip): Trip[] {
    const trips = this.getItem<Trip[]>(STORAGE_KEYS.TRIPS, DEFAULT_TRIPS);
    const index = trips.findIndex((t) => t.id === trip.id);
    let updated: Trip[];
    if (index !== -1) {
      trips[index] = { ...trip, has_unpublished_changes: true };
      updated = [...trips];
      this.addAuditLog("TRIP_UPDATED", "SAFARIS", `Updated trip "${trip.title}".`);
    } else {
      updated = [...trips, { ...trip, has_unpublished_changes: true }];
      this.addAuditLog("TRIP_CREATED", "SAFARIS", `Added safari trip "${trip.title}".`);
    }
    this.setItem(STORAGE_KEYS.TRIPS, updated);
    syncToServer("trips", updated);
    return updated;
  }

  static addTrip(trip: Omit<Trip, "id">): Trip {
    const current = this.getItem<Trip[]>(STORAGE_KEYS.TRIPS, DEFAULT_TRIPS);
    const newTrip: Trip = {
      ...trip,
      id: `trip-${Date.now()}`,
      display_order: current.length + 1,
      has_unpublished_changes: true,
    };
    const updated = [...current, newTrip];
    this.setItem(STORAGE_KEYS.TRIPS, updated);
    syncToServer("trips", updated);
    this.addAuditLog("TRIP_CREATED", "SAFARIS", `Added safari trip "${newTrip.title}".`);
    return newTrip;
  }

  static updateTrip(id: string, updates: Partial<Trip>): Trip[] {
    const trips = this.getItem<Trip[]>(STORAGE_KEYS.TRIPS, DEFAULT_TRIPS);
    const index = trips.findIndex((t) => t.id === id);
    if (index !== -1) {
      trips[index] = { ...trips[index], ...updates, has_unpublished_changes: true };
      this.setItem(STORAGE_KEYS.TRIPS, trips);
      syncToServer("trips", trips);
      this.addAuditLog("TRIP_UPDATED", "SAFARIS", `Updated trip "${trips[index].title}".`);
    }
    return trips;
  }

  static deleteTrip(id: string): Trip[] {
    const trips = this.getItem<Trip[]>(STORAGE_KEYS.TRIPS, DEFAULT_TRIPS);
    const filtered = trips.filter((t) => t.id !== id);
    this.setItem(STORAGE_KEYS.TRIPS, filtered);
    syncToServer("trips", filtered);
    this.addAuditLog("TRIP_DELETED", "SAFARIS", `Removed trip ID: ${id}`);
    return filtered;
  }

  // GALLERY
  static getGallery(includeAll = false): GalleryItem[] {
    const items = this.getItem(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
    return includeAll ? items : items.filter((g) => g.status === "published");
  }

  static saveGalleryItem(item: GalleryItem): GalleryItem[] {
    const items = this.getItem<GalleryItem[]>(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
    const index = items.findIndex((g) => g.id === item.id);
    let updated: GalleryItem[];
    if (index !== -1) {
      items[index] = { ...item, has_unpublished_changes: true };
      updated = [...items];
      this.addAuditLog("GALLERY_UPDATED", "GALLERY", `Updated gallery item "${item.title}".`);
    } else {
      updated = [...items, { ...item, has_unpublished_changes: true }];
      this.addAuditLog("GALLERY_CREATED", "GALLERY", `Added gallery photo "${item.title}".`);
    }
    this.setItem(STORAGE_KEYS.GALLERY, updated);
    syncToServer("gallery", updated);
    return updated;
  }

  static addGallery(item: Omit<GalleryItem, "id">): GalleryItem {
    const current = this.getItem<GalleryItem[]>(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
      display_order: current.length + 1,
      has_unpublished_changes: true,
    };
    const updated = [...current, newItem];
    this.setItem(STORAGE_KEYS.GALLERY, updated);
    syncToServer("gallery", updated);
    this.addAuditLog("GALLERY_CREATED", "GALLERY", `Added gallery photo "${newItem.title}".`);
    return newItem;
  }

  static updateGallery(id: string, updates: Partial<GalleryItem>): GalleryItem[] {
    const items = this.getItem<GalleryItem[]>(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
    const index = items.findIndex((g) => g.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates, has_unpublished_changes: true };
      this.setItem(STORAGE_KEYS.GALLERY, items);
      syncToServer("gallery", items);
      this.addAuditLog("GALLERY_UPDATED", "GALLERY", `Updated gallery item "${items[index].title}".`);
    }
    return items;
  }

  static deleteGallery(id: string): GalleryItem[] {
    const items = this.getItem<GalleryItem[]>(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
    const filtered = items.filter((g) => g.id !== id);
    this.setItem(STORAGE_KEYS.GALLERY, filtered);
    syncToServer("gallery", filtered);
    this.addAuditLog("GALLERY_DELETED", "GALLERY", `Deleted photo ID: ${id}`);
    return filtered;
  }

  static deleteGalleryItem(id: string): GalleryItem[] {
    return this.deleteGallery(id);
  }

  // REVIEWS
  static getReviews(includeAll = false): Review[] {
    const items = this.getItem(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    return includeAll ? items : items.filter((r) => r.status === "published");
  }

  static saveReview(review: Review): Review[] {
    const reviews = this.getItem<Review[]>(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    const index = reviews.findIndex((r) => r.id === review.id);
    let updated: Review[];
    if (index !== -1) {
      reviews[index] = { ...review, has_unpublished_changes: true };
      updated = [...reviews];
      this.addAuditLog("REVIEW_UPDATED", "REVIEWS", `Updated review by ${review.author_name}.`);
    } else {
      updated = [review, ...reviews];
      this.addAuditLog("REVIEW_CREATED", "REVIEWS", `Added review by ${review.author_name}.`);
    }
    this.setItem(STORAGE_KEYS.REVIEWS, updated);
    syncToServer("reviews", updated);
    return updated;
  }

  static addReview(review: Omit<Review, "id">): Review {
    const current = this.getItem<Review[]>(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      has_unpublished_changes: true,
    };
    const updated = [newReview, ...current];
    this.setItem(STORAGE_KEYS.REVIEWS, updated);
    syncToServer("reviews", updated);
    this.addAuditLog("REVIEW_CREATED", "REVIEWS", `Added review by ${newReview.author_name}.`);
    return newReview;
  }

  static updateReview(id: string, updates: Partial<Review>): Review[] {
    const reviews = this.getItem<Review[]>(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    const index = reviews.findIndex((r) => r.id === id);
    if (index !== -1) {
      reviews[index] = { ...reviews[index], ...updates, has_unpublished_changes: true };
      this.setItem(STORAGE_KEYS.REVIEWS, reviews);
      syncToServer("reviews", reviews);
      this.addAuditLog("REVIEW_UPDATED", "REVIEWS", `Updated review by ${reviews[index].author_name}.`);
    }
    return reviews;
  }

  static deleteReview(id: string): Review[] {
    const reviews = this.getItem<Review[]>(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    const filtered = reviews.filter((r) => r.id !== id);
    this.setItem(STORAGE_KEYS.REVIEWS, filtered);
    syncToServer("reviews", filtered);
    this.addAuditLog("REVIEW_DELETED", "REVIEWS", `Deleted review ID: ${id}`);
    return filtered;
  }

  // FAQS
  static getFaqs(includeAll = false): FAQ[] {
    const items = this.getItem(STORAGE_KEYS.FAQS, DEFAULT_FAQS);
    return includeAll ? items : items.filter((f) => f.status === "published");
  }

  static saveFaq(faq: FAQ): FAQ[] {
    const faqs = this.getItem<FAQ[]>(STORAGE_KEYS.FAQS, DEFAULT_FAQS);
    const index = faqs.findIndex((f) => f.id === faq.id);
    let updated: FAQ[];
    if (index !== -1) {
      faqs[index] = { ...faq, has_unpublished_changes: true };
      updated = [...faqs];
      this.addAuditLog("FAQ_UPDATED", "KNOWLEDGE", `Updated FAQ: "${faq.question}".`);
    } else {
      updated = [...faqs, { ...faq, has_unpublished_changes: true }];
      this.addAuditLog("FAQ_CREATED", "KNOWLEDGE", `Added FAQ: "${faq.question}".`);
    }
    this.setItem(STORAGE_KEYS.FAQS, updated);
    syncToServer("faqs", updated);
    return updated;
  }

  static addFaq(faq: Omit<FAQ, "id">): FAQ {
    const current = this.getItem<FAQ[]>(STORAGE_KEYS.FAQS, DEFAULT_FAQS);
    const newFaq: FAQ = {
      ...faq,
      id: `faq-${Date.now()}`,
      display_order: current.length + 1,
      has_unpublished_changes: true,
    };
    const updated = [...current, newFaq];
    this.setItem(STORAGE_KEYS.FAQS, updated);
    syncToServer("faqs", updated);
    this.addAuditLog("FAQ_CREATED", "KNOWLEDGE", `Added FAQ: "${newFaq.question}".`);
    return newFaq;
  }

  static updateFaq(id: string, updates: Partial<FAQ>): FAQ[] {
    const faqs = this.getItem<FAQ[]>(STORAGE_KEYS.FAQS, DEFAULT_FAQS);
    const index = faqs.findIndex((f) => f.id === id);
    if (index !== -1) {
      faqs[index] = { ...faqs[index], ...updates, has_unpublished_changes: true };
      this.setItem(STORAGE_KEYS.FAQS, faqs);
      syncToServer("faqs", faqs);
      this.addAuditLog("FAQ_UPDATED", "KNOWLEDGE", `Updated FAQ: "${faqs[index].question}".`);
    }
    return faqs;
  }

  static deleteFaq(id: string): FAQ[] {
    const faqs = this.getItem<FAQ[]>(STORAGE_KEYS.FAQS, DEFAULT_FAQS);
    const filtered = faqs.filter((f) => f.id !== id);
    this.setItem(STORAGE_KEYS.FAQS, filtered);
    syncToServer("faqs", filtered);
    this.addAuditLog("FAQ_DELETED", "KNOWLEDGE", `Deleted FAQ ID: ${id}`);
    return filtered;
  }

  // INQUIRIES
  static getInquiries(): BookingInquiry[] {
    return this.getItem(STORAGE_KEYS.INQUIRIES, DEFAULT_INQUIRIES);
  }

  static addInquiry(inquiry: Omit<BookingInquiry, "id" | "created_at">): BookingInquiry {
    const current = this.getItem<BookingInquiry[]>(STORAGE_KEYS.INQUIRIES, DEFAULT_INQUIRIES);
    const timestamp = Date.now();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newInquiry: BookingInquiry = {
      ...inquiry,
      id: `inq-${timestamp}`,
      reference_code: `DV-${randomCode}`,
      created_at: new Date().toISOString(),
    };
    const updated = [newInquiry, ...current];
    this.setItem(STORAGE_KEYS.INQUIRIES, updated);
    syncToServer("inquiries", updated);
    this.addAuditLog("INQUIRY_RECEIVED", "BOOKINGS", `New booking inquiry from ${newInquiry.customer_name}`);
    return newInquiry;
  }

  static updateInquiryStatus(id: string, status: BookingInquiry["status"], notes?: string): BookingInquiry[] {
    const current = this.getItem<BookingInquiry[]>(STORAGE_KEYS.INQUIRIES, DEFAULT_INQUIRIES);
    const index = current.findIndex((i) => i.id === id);
    if (index !== -1) {
      current[index] = {
        ...current[index],
        status,
        ...(notes !== undefined && { admin_notes: notes }),
      };
      this.setItem(STORAGE_KEYS.INQUIRIES, current);
      syncToServer("inquiries", current);
    }
    return current;
  }

  static deleteInquiry(id: string): BookingInquiry[] {
    const current = this.getItem<BookingInquiry[]>(STORAGE_KEYS.INQUIRIES, DEFAULT_INQUIRIES);
    const filtered = current.filter((i) => i.id !== id);
    this.setItem(STORAGE_KEYS.INQUIRIES, filtered);
    syncToServer("inquiries", filtered);
    return filtered;
  }

  // MEDIA ASSETS
  static getMedia(): MediaAsset[] {
    return this.getItem(STORAGE_KEYS.MEDIA, DEFAULT_MEDIA);
  }

  static addMedia(media: Omit<MediaAsset, "id" | "created_at">): MediaAsset {
    const current = this.getMedia();
    const newMedia: MediaAsset = {
      ...media,
      id: `med-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [newMedia, ...current];
    this.setItem(STORAGE_KEYS.MEDIA, updated);
    syncToServer("media", updated);
    return newMedia;
  }

  static deleteMedia(id: string): MediaAsset[] {
    const current = this.getMedia();
    const filtered = current.filter((m) => m.id !== id);
    this.setItem(STORAGE_KEYS.MEDIA, filtered);
    syncToServer("media", filtered);
    return filtered;
  }

  // AUDIT LOGS
  static getAuditLogs(): AuditLog[] {
    return this.getItem(STORAGE_KEYS.AUDIT_LOGS, DEFAULT_AUDIT_LOGS);
  }

  static addAuditLog(action: string, entity_type: string, details: string): void {
    if (!this.isClient) return;
    const current = this.getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, DEFAULT_AUDIT_LOGS);
    const admin = this.getAdminUser();
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_email: admin?.email || "system@internal",
      action,
      entity_type,
      details,
      created_at: new Date().toISOString(),
    };
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...current].slice(0, 100));
  }

  // AUTH ADMIN USER
  static getAdminUser(): AdminUser | null {
    if (!this.isClient) return null;
    return this.getItem(STORAGE_KEYS.ADMIN_USER, null);
  }

  static setAdminUser(user: AdminUser | null): void {
    this.setItem(STORAGE_KEYS.ADMIN_USER, user);
  }
}
