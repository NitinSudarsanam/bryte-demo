import { fetchCosmicObject } from "@/app/lib/cosmic";
import FAQsPageClient from "./FAQsPageClient";
import AccordionComponent from "@/app/components/accordion";
import Section from "@/app/components/section/section";
import Header from "@/app/components/header";
import Masthead from "@/app/components/masthead/masthead";

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
    console.log("Cosmic FAQ data:", JSON.stringify(cosmic, null, 2));
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    // If the FAQ object doesn't exist in Cosmic, use fallback data
    cosmic = null;
  }

  return <FAQsPageClient cosmic={cosmic} />;
  return (
    <>
      <Header />
      <Masthead
        showLargeTitle={true}
        showAtSymbol={false}
        topRowPillColorClass="bryte-pill-green"
        titleWords={["FAQ"]}
        decorativePills={[
          {
            colorClass: "bryte-pill-maroon",
            size: "long",
            row: 0,
            position: "left",
          },
          {
            colorClass: "bryte-pill-orange",
            size: "short",
            row: 0,
            position: "right",
          },
        ]}
      />
      <AccordionComponent title="FAQs" items={faqItems} />
    </>
  );
}
