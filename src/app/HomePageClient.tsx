"use client";

import DOMPurify from "isomorphic-dompurify";
import Masthead from "@/app/components/masthead/masthead";
import Section from "@/app/components/section/section";
import HomeStats from "@/app/components/home-stats";
import type { HomeStatItem } from "@/app/components/home-stats";

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

/** Cosmic section object for home-stats (slug: home-stats) - supports various metadata shapes */
interface HomeStatsSection {
  id?: string;
  slug?: string;
  title?: string;
  metadata?: Record<string, unknown>;
}

interface HomePageClientProps {
  cosmic: CosmicData | null;
  homeStatsSection?: HomeStatsSection | null;
}

const DEFAULT_HOME_STATS: HomeStatItem[] = [
  { value: "170+", description: "refugee youth in grades K-12", bubble_color: "maroon" },
  { value: "& 3,497", description: "refugee youth in grades K-12", bubble_color: "orange" },
];

/** Parse one stat item from various Cosmic shapes (flat or nested in .metadata) */
function parseStatItem(item: unknown): HomeStatItem | null {
  if (!item || typeof item !== "object") return null;
  const o = item as Record<string, unknown>;
  const meta = o.metadata as Record<string, unknown> | undefined;
  const value = (o.value ?? meta?.value ?? "") as string;
  const description = (o.description ?? meta?.description ?? "") as string;
  const bubble_color = (o.bubble_color ?? meta?.bubble_color ?? o.color ?? meta?.color) as string | undefined;
  if (!value && !description) return null;
  return {
    value: String(value).trim() || "—",
    description: String(description).trim() || "",
    bubble_color: bubble_color ? String(bubble_color).trim() : undefined,
  };
}

/**
 * Parse "170+ refugee youth in grades K-12 & 3,497 refugee youth in grades K-12" style text
 * into two stats: value "170+", description "refugee youth..."; value "&", description "3,497 refugee youth..."
 */
function parseHomeStatsFromText(text: string): HomeStatItem[] {
  const trimmed = String(text).trim();
  if (!trimmed) return [];
  const parts = trimmed.split(/\s+&\s+/);
  if (parts.length < 2) return [];
  const result: HomeStatItem[] = [];
  const firstPart = parts[0].trim();
  const firstMatch = firstPart.match(/^(\d+\+?)\s+(.+)$/);
  if (firstMatch) {
    result.push({
      value: firstMatch[1],
      description: firstMatch[2].trim(),
      bubble_color: "maroon",
    });
  }
  result.push({
    value: "&",
    description: parts[1].trim(),
    bubble_color: "orange",
  });
  return result;
}

/** Parse home-stats section from Cosmic into HomeStatItem[]; tries repeatable array then body text */
function parseHomeStats(section: HomeStatsSection | null | undefined): HomeStatItem[] {
  if (!section?.metadata || typeof section.metadata !== "object") return [];
  const meta = section.metadata as Record<string, unknown>;
  const raw = meta.stats ?? meta.stat_items ?? meta.items ?? meta.entries;
  if (Array.isArray(raw) && raw.length > 0) {
    const parsed = raw.map(parseStatItem).filter((item): item is HomeStatItem => item !== null);
    if (parsed.length > 0) return parsed;
  }
  const bodyText = (meta.body_text ?? meta.content ?? meta.text ?? meta.description) as string | undefined;
  if (bodyText && typeof bodyText === "string") {
    const fromText = parseHomeStatsFromText(bodyText);
    if (fromText.length > 0) return fromText;
  }
  return [];
}

export default function HomePageClient({ cosmic, homeStatsSection }: HomePageClientProps) {
  const homeStatsFromSection = parseHomeStats(homeStatsSection);
  const homeStatsFromPage = parseHomeStats(
    cosmic?.metadata?.sections?.find((s) => s.slug === "home-stats") as HomeStatsSection | undefined
  );
  const homeStats =
    homeStatsFromSection.length > 0
      ? homeStatsFromSection
      : homeStatsFromPage.length > 0
        ? homeStatsFromPage
        : DEFAULT_HOME_STATS;

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
                  __html: DOMPurify.sanitize(whatsBryteSection.metadata.body_text || ""),
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
        {homeStats.length > 0 && (
          <HomeStats stats={homeStats} />
        )}
      </div>
      {/* home-why-bryte Section - green background */}
      {homeWhyBryteSection?.metadata && (
        <Section
          title={homeWhyBryteSection.metadata.header || "Why BRYTE?"}
          content={
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(homeWhyBryteSection.metadata.body_text || ""),
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
