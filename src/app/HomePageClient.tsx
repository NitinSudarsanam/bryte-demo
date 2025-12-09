"use client";

import Masthead from "@/app/components/masthead/masthead";
import Header from "@/app/components/header";
import Section from "@/app/components/section/section";

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

interface CosmicSection {
  id: string;
  slug: string;
  metadata: {
    header: string;
    body_text: string;
    images?: string[] | CosmicImage[];
  };
}

interface CosmicData {
  metadata?: {
    title?: string;
    sections?: CosmicSection[];
    images?: CosmicImage[];
  };
}

interface HomePageClientProps {
  cosmic: CosmicData | null;
}

export default function HomePageClient({ cosmic }: HomePageClientProps) {
  // Find the "What's BRYTE" section
  const whatsBryteSection = cosmic?.metadata?.sections?.find(
    (section) => 
      section.slug?.toLowerCase().includes("what") || 
      section.metadata?.header?.toLowerCase().includes("what")
  );

  // Find the "Why BRYTE" section from the home page sections
  const whyBryteSection = cosmic?.metadata?.sections?.find(
    (section) => section.slug === "about-us-why-bryte"
  );

  // Find the "home-why-bryte" section for the new section
  const homeWhyBryteSection = cosmic?.metadata?.sections?.find(
    (section) => section.slug === "home-why-bryte"
  );

  // Get all images from page metadata
  const pageImages = cosmic?.metadata?.images || [];

  // Helper function to extract image from section
  const getSectionImage = (section: CosmicSection | undefined) => {
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
        showAtSymbol={true}
        topRowPillColorClass="bryte-pill-maroon"
        subtitle="Brown Refugee Youth Tutoring & Enrichment"
        animatedWords={["child", "family", "care"]}
        showWholeSection={true}
      />
      {/* What's BRYTE? Section - theme yellow background */}
      <div style={{ marginTop: "60px" }}>
        {whatsBryteSection?.metadata && (
          <Section
            title={whatsBryteSection.metadata.header || "WHAT'S BRYTE?"}
            content={
              <div
                dangerouslySetInnerHTML={{
                  __html: whatsBryteSection.metadata.body_text || "",
                }}
              />
            }
            image={getSectionImage(whatsBryteSection)}
            imagePosition="right"
            sectionBackgroundColor="#fce794"
            sectionTextColor="#22300d"
            className="whats-bryte-section"
          />
        )}
        {<div style={{ 
          padding: "40px 20px", 
          background: "#fefae1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"   // <-- centers horizontally
        }}>
          
          <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
            <div style={{
              fontSize: "140px",
              fontWeight: 700,
              color: "#1e2b0f",
              marginRight: "20px",
              lineHeight: 1
            }}>
              170+
            </div>

            <div style={{
              padding: "35px 45px",
              borderRadius: "60px",
              fontSize: "28px",
              color: "white",
              background: "#934136"
            }}>
              refugee youth in grades K-12
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{
              fontSize: "150px",
              color: "#1e2b0f",
              marginRight: "20px",
              lineHeight: 1
            }}>
              &
            </div>

            <div style={{
              padding: "35px 45px",
              borderRadius: "60px",
              fontSize: "32px",
              color: "white",
              background: "#cf7e40"
            }}>
              refugee youth in grades K-12
            </div>
          </div>

        </div>
      }
      </div>
      {/* home-why-bryte Section - green background */}
      {homeWhyBryteSection?.metadata && (
        <Section
          title={homeWhyBryteSection.metadata.header || "Why BRYTE?"}
          content={
            <div
              dangerouslySetInnerHTML={{
                __html: homeWhyBryteSection.metadata.body_text || "",
              }}
            />
          }
          image={getSectionImage(homeWhyBryteSection)}
          imagePosition="right"
          sectionBackgroundColor="var(--darkgreen)"
          sectionTextColor="#fefae1"
          className="whats-bryte-section"
        />
      )}
    </div>
  );
}
