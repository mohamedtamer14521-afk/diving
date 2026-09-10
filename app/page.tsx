import { getPublishedHomepageData } from "@/lib/server-data";
import { HomeView } from "@/components/home/home-view";

// Revalidate page on demand or periodically
export const revalidate = 60;

export default async function HomePage() {
  const {
    businessSettings,
    sections,
    activities,
    courses,
    trips,
    gallery,
    reviews,
    faqs,
  } = await getPublishedHomepageData();

  return (
    <HomeView
      initialSettings={businessSettings}
      initialSections={sections}
      initialActivities={activities}
      initialCourses={courses}
      initialTrips={trips}
      initialGallery={gallery}
      initialReviews={reviews}
      initialFaqs={faqs}
    />
  );
}
