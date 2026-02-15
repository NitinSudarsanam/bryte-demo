import Header from "@/app/components/header";
import Masthead from "@/app/components/masthead/masthead";
import Slideshow from "@/app/components/slideshow";
import { fetchCosmicObject } from "@/app/lib/cosmic";

interface CosmicImage {
  id: string;
  slug?: string;
  title?: string;
  metadata?: {
    image?: {
      imgix_url?: string;
      url?: string;
    };
  };
}

export default async function UpartnersPage() {
  // Fetch home page data to get slideshow images
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
      console.error("Error fetching home page for slideshow:", error);
    }
    cosmic = null;
  }

  const pageImages = cosmic?.metadata?.images || [];
  const slideshowSection = cosmic?.metadata?.sections?.find(
    (section: any) => 
      section.slug?.toLowerCase().includes("slideshow") || 
      section.metadata?.header?.toLowerCase().includes("slideshow")
  );

  // Extract slideshow images
  const slideshowImages: Array<{ id: string; image: string; caption?: string }> = [];
  
  if (pageImages.length > 0) {
    pageImages.forEach((img: CosmicImage, index: number) => {
      const imageUrl = img.metadata?.image?.imgix_url || img.metadata?.image?.url || "";
      if (imageUrl) {
        slideshowImages.push({
          id: img.id || `slide-${index}`,
          image: imageUrl,
          caption: img.title || "",
        });
      }
    });
  }

  // Fallback slides
  const fallbackSlides = [
    { id: "1", image: "/slide1.png", caption: "Lorem impsum dolor sit amet" },
    { id: "2", image: "/slide2.png", caption: "Lorem impsum dolor sit amet" },
  ];

  const slides = slideshowImages.length > 0 ? slideshowImages : fallbackSlides;
  const slideshowCaption = slideshowSection?.metadata?.header || "";

  return (
    <div>
      <Header />
      <Masthead
        showLargeTitle={true}
        showAtSymbol={false}
        topRowPillColorClass="bryte-pill-green"
        titleWords={["Community", "Partners"]} // One line
        decorativePills={[
          {
            colorClass: "bryte-pill-maroon",
            size: "short",
            row: 0,
            position: "left",
          },
          {
            colorClass: "bryte-pill-orange",
            size: "medium",
            row: 1,
            position: "right",
          },
        ]}
      />
      <Slideshow slides={slides} />
      {slideshowCaption && (
        <div style={{ 
          textAlign: "center", 
          padding: "20px", 
          fontSize: "18px", 
          fontWeight: "500",
          color: "var(--foreground)"
        }}>
          {slideshowCaption}
        </div>
      )}
    </div>
  );
}
