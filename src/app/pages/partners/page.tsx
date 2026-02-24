import Header from "@/app/components/header";
import Masthead from "@/app/components/masthead/masthead";
import Slideshow from "@/app/components/slideshow";
import Section from "@/app/components/section/section";
import { fetchCosmicObject } from "@/app/lib/cosmic";
import DOMPurify from "isomorphic-dompurify";

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
  // Fetch community partners page data
  let cosmic;
  try {
    cosmic = await fetchCosmicObject({
      bucketSlug: process.env.COSMIC_BUCKET_SLUG!,
      readKey: process.env.COSMIC_READ_KEY!,
      type: "pages",
      slug: "community-partners",
      props: "slug,title,metadata,type",
      depth: 2,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching community partners page:", error);
    }
    cosmic = null;
  }

  // Get all sections
  const sections = cosmic?.metadata?.sections || [];
  
  // Get the first section to display above the slideshow
  const firstSection = sections.length > 0 ? sections[0] : null;
  
  // Get remaining sections to display after the slideshow
  const remainingSections = sections.length > 1 ? sections.slice(1) : [];
  
  // Find the slideshow section
  const slideshowSection = sections.find(
    (section: any) => 
      section.slug?.toLowerCase().includes("slideshow") || 
      section.metadata?.header?.toLowerCase().includes("slideshow")
  );

  // Get page images
  const pageImages = cosmic?.metadata?.images || [];

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
  
  // Helper function to extract image from section (same logic as home page)
  const getSectionImage = (section: any) => {
    if (!section?.metadata?.images) return undefined;
    const sectionImageIds = section.metadata.images;
    if (!Array.isArray(sectionImageIds) || sectionImageIds.length === 0) {
      return undefined;
    }
    const firstImageRef = sectionImageIds[0];
    let imageId: string | undefined;
    if (typeof firstImageRef === "string") {
      imageId = firstImageRef;
    } else if (typeof firstImageRef === "object" && firstImageRef?.id) {
      imageId = firstImageRef.id;
    }
    if (imageId && pageImages.length > 0) {
      const matchedImage = pageImages.find((img: CosmicImage) => img.id === imageId);
      if (matchedImage?.metadata?.image) {
        return {
          src: matchedImage.metadata.image.imgix_url || matchedImage.metadata.image.url || "",
          alt: matchedImage.title || section.metadata.header || "",
        };
      }
    }
    if (typeof firstImageRef === "object" && firstImageRef?.metadata?.image) {
      return {
        src: firstImageRef.metadata.image.imgix_url || firstImageRef.metadata.image.url || "",
        alt: firstImageRef.title || section.metadata.header || "",
      };
    }
    return undefined;
  };

  return (
    <div>
      <Header />
      <Masthead
        showLargeTitle={true}
        showAtSymbol={false}
        topRowPillColorClass="bryte-pill-green"
        titleWords={["Community", "Partners"]}
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
      {/* First section above slideshow */}
      {firstSection?.metadata && (
        <div style={{ marginTop: "60px" }}>
          <Section
            title={firstSection.metadata.header || firstSection.title || "OUR PARTNERS"}
            content={
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(firstSection.metadata.body_text || ""),
                }}
              />
            }
            image={getSectionImage(firstSection)}
            imagePosition="right"
            sectionBackgroundColor="#fce794"
            sectionTextColor="#22300d"
            className="whats-bryte-section"
          />
        </div>
      )}
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
      {/* Remaining sections after slideshow */}
      {remainingSections.map((section: any, index: number) => (
        section?.metadata && (
          <div key={section.id || `section-${index}`} style={{ marginTop: "60px" }}>
            <Section
              title={section.metadata.header || section.title || `SECTION ${index + 2}`}
              content={
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(section.metadata.body_text || ""),
                  }}
                />
              }
              image={getSectionImage(section)}
              imagePosition={index % 2 === 0 ? "right" : "left"}
              sectionBackgroundColor={index % 2 === 0 ? "var(--darkgreen)" : "#fce794"}
              sectionTextColor={index % 2 === 0 ? "#fefae1" : "#22300d"}
              className="whats-bryte-section"
            />
          </div>
        )
      ))}
    </div>
  );
}
