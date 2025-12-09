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
    console.log("Cosmic home page data:", JSON.stringify(cosmic, null, 2));
  } catch (error) {
    console.error("Error fetching home page:", error);
    // If the home page doesn't exist in Cosmic, use fallback data
    cosmic = null;
  }

  return <HomePageClient cosmic={cosmic} />;
}
