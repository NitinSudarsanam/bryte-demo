import { fetchCosmicObject } from "@/app/lib/cosmic";
import HomePageClient from "./HomePageClient";

export default async function HomePage() {
  // Fetch "about us - our values" section from Cosmic (the why bryte section)
  let valuesSection;
  try {
    valuesSection = await fetchCosmicObject({
      bucketSlug: "basic-template-production",
      readKey: "38hX2h4NgRq5t6btJvbkjxJygVsfD9jN5eX9TG9sV8BYPEHw8f",
      type: "sections",
      slug: "about-us-why-bryte",
      props: "slug,title,metadata",
      depth: 1,
    });
    console.log("Cosmic values section:", JSON.stringify(valuesSection, null, 2));
  } catch (error) {
    console.error("Error fetching values section:", error);
    // If the section doesn't exist, use fallback data
    valuesSection = null;
  }

  return <HomePageClient valuesSection={valuesSection} />;
}