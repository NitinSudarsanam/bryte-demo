"use client";

import Masthead from "@/app/components/masthead/masthead";
import Header from "@/app/components/header";
import Slideshow from "@/app/components/slideshow";
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
  // Find the "Why BRYTE" section from the home page sections
  const whyBryteSection = cosmic?.metadata?.sections?.find(
    (section) => section.slug === "about-us-why-bryte"
  );

  // Find the slideshow section - look for a section with "slideshow" in slug or header
  const slideshowSection = cosmic?.metadata?.sections?.find(
    (section) => 
      section.slug?.toLowerCase().includes("slideshow") || 
      section.metadata?.header?.toLowerCase().includes("slideshow")
  );

  // Get all images from page metadata
  const pageImages = cosmic?.metadata?.images || [];

  // Extract slideshow images from page metadata.images array
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

  // Fallback slides if no Cosmic slideshow data
  const fallbackSlides = [
    { id: "1", image: "/slide1.png", caption: "Lorem impsum dolor sit amet" },
    { id: "2", image: "/slide2.png", caption: "Lorem impsum dolor sit amet" },
  ];

  const slides = slideshowImages.length > 0 ? slideshowImages : fallbackSlides;
  const slideshowCaption = slideshowSection?.metadata?.header || "";

  return (
    <div>
      <Header />
      <Masthead />
      {whyBryteSection?.metadata && (
        <Section
          title={whyBryteSection.metadata.header || "Why BRYTE?"}
          content={
            <div
              dangerouslySetInnerHTML={{
                __html: whyBryteSection.metadata.body_text || "",
              }}
            />
          }
          image={
            (() => {
              // Get image IDs from the section
              const sectionImageIds = whyBryteSection.metadata.images;
              if (!sectionImageIds || !Array.isArray(sectionImageIds) || sectionImageIds.length === 0) {
                return undefined;
              }

              // Get the first image ID (could be string or object)
              const firstImageRef = sectionImageIds[0];
              let imageId: string | undefined;

              if (typeof firstImageRef === "string") {
                imageId = firstImageRef;
              } else if (typeof firstImageRef === "object" && firstImageRef?.id) {
                imageId = firstImageRef.id;
              }

              // Find the matching image in page metadata.images
              if (imageId && pageImages.length > 0) {
                const matchedImage = pageImages.find((img: CosmicImage) => img.id === imageId);
                if (matchedImage?.metadata?.image) {
                  return {
                    src:
                      matchedImage.metadata.image.imgix_url ||
                      matchedImage.metadata.image.url ||
                      "",
                    alt: matchedImage.title || whyBryteSection.metadata.header || "Why BRYTE",
                  };
                }
              }

              // Fallback: if the image was already populated as an object
              if (typeof firstImageRef === "object" && firstImageRef?.metadata?.image) {
                return {
                  src:
                    firstImageRef.metadata.image.imgix_url ||
                    firstImageRef.metadata.image.url ||
                    "",
                  alt: firstImageRef.title || whyBryteSection.metadata.header || "Why BRYTE",
                };
              }

              return undefined;
            })()
          }
          imagePosition="right"
          sectionBackgroundColor="var(--darkgreen)"
          sectionTextColor="#fff"
        />
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
    </div>
  );
}

