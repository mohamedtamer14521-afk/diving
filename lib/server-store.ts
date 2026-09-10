import fs from "fs";
import path from "path";
import {
  DEFAULT_BUSINESS_SETTINGS,
  DEFAULT_HOMEPAGE_SECTIONS,
  DEFAULT_ACTIVITIES,
  DEFAULT_COURSES,
  DEFAULT_TRIPS,
  DEFAULT_GALLERY,
  DEFAULT_REVIEWS,
  DEFAULT_FAQS,
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
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");

export interface SiteContent {
  settings: BusinessSettings;
  sections: HomepageSection[];
  activities: Activity[];
  courses: Course[];
  trips: Trip[];
  gallery: GalleryItem[];
  reviews: Review[];
  faqs: FAQ[];
}

const DEFAULT_CONTENT: SiteContent = {
  settings: DEFAULT_BUSINESS_SETTINGS,
  sections: DEFAULT_HOMEPAGE_SECTIONS,
  activities: DEFAULT_ACTIVITIES,
  courses: DEFAULT_COURSES,
  trips: DEFAULT_TRIPS,
  gallery: DEFAULT_GALLERY,
  reviews: DEFAULT_REVIEWS,
  faqs: DEFAULT_FAQS,
};

export function getServerContent(): SiteContent {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const raw = fs.readFileSync(CONTENT_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      return {
        settings: parsed.settings || DEFAULT_BUSINESS_SETTINGS,
        sections: parsed.sections || DEFAULT_HOMEPAGE_SECTIONS,
        activities: parsed.activities || DEFAULT_ACTIVITIES,
        courses: parsed.courses || DEFAULT_COURSES,
        trips: parsed.trips || DEFAULT_TRIPS,
        gallery: parsed.gallery || DEFAULT_GALLERY,
        reviews: parsed.reviews || DEFAULT_REVIEWS,
        faqs: parsed.faqs || DEFAULT_FAQS,
      };
    }
  } catch (e) {
    console.warn("Could not read server content.json, using defaults:", e);
  }
  return DEFAULT_CONTENT;
}

export function saveServerContent(newContent: Partial<SiteContent>): SiteContent {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const current = getServerContent();
    const merged: SiteContent = {
      ...current,
      ...newContent,
    };
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(merged, null, 2), "utf-8");
    return merged;
  } catch (e) {
    console.warn("Could not write server content.json:", e);
    return { ...DEFAULT_CONTENT, ...newContent };
  }
}
