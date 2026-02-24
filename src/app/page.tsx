import { fetchCosmicObject } from "@/app/lib/cosmic";
import HomePageClient from "./HomePageClient";

export default async function HomePage() {
  // Fetch "home-page" page object from Cosmic
  let cosmic;
  try {
    cosmic = await fetchCosmicObject({
      bucketSlug: process.env.COSMIC_BUCKET_SLUG!,
      readKey: process.env.COSMIC_READ_KEY!,
      type: "pages",
      slug: "home-page",
      props: "slug,title,metadata,type",
      depth: 2,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching home page:", error);
    }
    cosmic = null;
  }

  // Fetch "home-stats" section from Cosmic (stats/factoid block)
  let homeStatsSection;
  try {
    homeStatsSection = await fetchCosmicObject({
      bucketSlug: process.env.COSMIC_BUCKET_SLUG!,
      readKey: process.env.COSMIC_READ_KEY!,
      type: "sections",
      slug: "home-stats",
      props: "slug,title,metadata,type",
      depth: 1,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching home-stats section:", error);
    }
    homeStatsSection = null;
  }

  return <HomePageClient cosmic={cosmic} homeStatsSection={homeStatsSection} />;
}
