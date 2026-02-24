import { fetchCosmicObject } from "@/app/lib/cosmic";
import FAQsPageClient from "./FAQsPageClient";

export default async function FAQsPage() {
  // Fetch "faq-partners" page object from Cosmic using the correct bucket
  let cosmic;
  try {
    cosmic = await fetchCosmicObject({
      bucketSlug: process.env.COSMIC_BUCKET_SLUG!,
      readKey: process.env.COSMIC_READ_KEY!,
      type: "pages",
      slug: "faq-partners",
      props: "slug,title,metadata,type",
      depth: 1,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching FAQ:", error);
    }
    // If the FAQ object doesn't exist in Cosmic, use fallback data
    cosmic = null;
  }

  return <FAQsPageClient cosmic={cosmic} />;
}
