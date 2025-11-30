import { fetchCosmicObject } from "@/app/lib/cosmic";
import FAQsPageClient from "./FAQsPageClient";

export default async function FAQsPage() {
  // Fetch "faq-partners" page object from Cosmic using the correct bucket
  let cosmic;
  try {
    cosmic = await fetchCosmicObject({
      bucketSlug: "basic-template-production",
      readKey: "38hX2h4NgRq5t6btJvbkjxJygVsfD9jN5eX9TG9sV8BYPEHw8f",
      type: "pages",
      slug: "faq-partners",
      props: "slug,title,metadata,type",
      depth: 1,
    });
    console.log("Cosmic FAQ data:", JSON.stringify(cosmic, null, 2));
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    // If the FAQ object doesn't exist in Cosmic, use fallback data
    cosmic = null;
  }

  return <FAQsPageClient cosmic={cosmic} />;
}
