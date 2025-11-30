"use client";

import Masthead from "@/app/components/masthead/masthead";
import Header from "@/app/components/header";
import Slideshow from "@/app/components/slideshow";
import Section from "@/app/components/section/section";

const slides = [
  { id: "1", image: "/slide1.png", caption: "Lorem impsum dolor sit amet" },
  { id: "2", image: "/slide2.png", caption: "Lorem impsum dolor sit amet" },
];

interface ValuesSectionData {
  metadata?: {
    header?: string;
    body_text?: string;
    images?: Array<{
      metadata?: {
        image?: {
          imgix_url?: string;
          url?: string;
        };
      };
      title?: string;
    }>;
  };
}

interface HomePageClientProps {
  valuesSection: ValuesSectionData | null;
}

export default function HomePageClient({ valuesSection }: HomePageClientProps) {
  return (
    <div>
      <Header />
      <Masthead />
      {valuesSection?.metadata && (
        <Section
          title={valuesSection.metadata.header || "Why BRYTE?"}
          content={
            <div
              dangerouslySetInnerHTML={{
                __html: valuesSection.metadata.body_text || "",
              }}
            />
          }
          image={
            valuesSection.metadata.images?.[0]?.metadata?.image
              ? {
                  src:
                    valuesSection.metadata.images[0].metadata.image.imgix_url ||
                    valuesSection.metadata.images[0].metadata.image.url ||
                    "",
                  alt: valuesSection.metadata.images[0].title || valuesSection.metadata.header || "Our Values",
                }
              : undefined
          }
          imagePosition="right"
          sectionBackgroundColor="var(--darkgreen)"
          sectionTextColor="#fff"
        />
      )}
      <Slideshow slides={slides} />
    </div>
  );
}

