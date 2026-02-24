import { createBucketClient } from "@cosmicjs/sdk";
import CollapsibleLinkSection from "@/app/components/links-section/links-section";
import "./parent-resources.css";
import Masthead from "@/app/components/masthead/masthead";

type LinksDict = Record<string, string>;

function extractHref(htmlString: string): string | null {
  if (!htmlString) return null;
  const match = htmlString.match(/href="([^"]+)"/);
  return match ? match[1] : null;
}

export default async function ResourcesForBryteParentsPage() {
  let links: LinksDict = {};
  let error: string | null = null;

  try {
    const bucketSlug = process.env.COSMIC_BUCKET_SLUG!;
    const readKey = process.env.COSMIC_READ_KEY!;

    const cosmic = createBucketClient({
      bucketSlug,
      readKey,
    });

    const data = await cosmic.objects
      .findOne({
        type: "sections",
        slug: "resources-for-parents",
      })
      .props("title,metadata")
      .depth(1);

    if (!data?.object?.metadata) {
      throw new Error("No data returned from Cosmic");
    }

    const metadata = data.object.metadata;
    
    // Check if links are in the 'links' array format
    if (metadata.links && Array.isArray(metadata.links)) {
      links = metadata.links.reduce((acc: LinksDict, linkObj: any) => {
        const title = linkObj.metadata?.title || linkObj.title;
        const linkHtml = linkObj.metadata?.link;
        
        if (title && linkHtml) {
          const href = extractHref(linkHtml);
          if (href) {
            acc[title] = href;
          }
        }
        return acc;
      }, {});
    } else {
      // Fallback to old format if needed
      links = Object.entries(metadata)
        .filter(([key]) => key.startsWith("link_"))
        .reduce((acc, [key, value]) => {
          const linkName = key
            .replace("link_", "")
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
          const href = extractHref(value as string);
          if (href) {
            acc[linkName] = href;
          }
          return acc;
        }, {} as LinksDict);
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to load parent resources:", e);
    }
    error = "Unable to load parent resources at this time.";
  }

  return (
    <div className="parent-resources-page">
      <Masthead
        showLargeTitle={true}
        showAtSymbol={false}
        topRowPillColorClass="bryte-pill-green"
        titleWords={["Parent Resources"]}
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

      <div className="parent-resources-inner">
        {error && <p className="error-message">{error}</p>}

        {!error && Object.keys(links).length > 0 && (
          <CollapsibleLinkSection
            title="English Language Learning Classes"
            links={links}
          />
        )}

        {!error && Object.keys(links).length === 0 && (
          <p className="no-resources-message">No resources available right now.</p>
        )}
      </div>
    </div>
  );
}