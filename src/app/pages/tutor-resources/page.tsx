import { createBucketClient } from "@cosmicjs/sdk";
import Masthead from "@/app/components/masthead/masthead";
import CollapsibleLinkSection from "@/app/components/links-section/links-section";
import "./tutor-resources.css";

type LinksDict = Record<string, string>;

type TutorSection = {
  slug: string;
  title: string;
  links: LinksDict;
};

// Helper: Extract anchor text from HTML link
function extractAnchorText(htmlString: string): string | null {
  if (!htmlString) return null;
  const match = htmlString.match(/<a[^>]*>([^<]+)<\/a>/i);
  return match ? match[1].trim() : null;
}

// Helper: Clean and normalize title text
function cleanTitle(title: string): string {
  // Normalize Unicode to standard form (converts fancy spaces, etc)
  let cleaned = title.normalize('NFKC');
  
  // Replace various Unicode whitespace characters with regular space
  cleaned = cleaned.replace(/[\u00A0\u200B\u2002\u2003\u2009\u202F\uFEFF]/g, ' ');
  
  // Normalize multiple spaces to single space and trim
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

// Helper: Validate if title is actually visible text
function isValidTitle(title: string): boolean {
  if (!title || title.length < 2) return false;
  
  // Check for whitespace-only (including Unicode whitespace)
  if (/^[\s\u00A0\u200B\u2002\u2003\u2009\u202F\uFEFF]*$/.test(title)) return false;
  
  // Check for only special characters
  if (/^[\W_]*$/.test(title)) return false;
  
  return true;
}

export default async function ResourcesForBryteTutorsPage() {
  let sections: TutorSection[] = [];
  let error: string | null = null;

  try {
    // Server-side: Use Cosmic client directly (fetch won't work on server)
    const bucketSlug = process.env.COSMIC_BUCKET_SLUG!;
    const readKey = process.env.COSMIC_READ_KEY!;

    const cosmic = createBucketClient({
      bucketSlug,
      readKey,
    });

    const data = await cosmic.objects
      .find({
        type: "tutor-resources",
      })
      .props("slug,title,metadata")
      .depth(1);

    const objects = (data as any).objects || [];

    sections = objects.map((obj: any) => {
      const linksArray = obj.metadata?.links || [];
      const links: LinksDict = {};
      
      linksArray.forEach((linkObj: any, index: number) => {
        const rawTitle = linkObj.title || '';
        const rawLinkHTML = linkObj.metadata?.link || '';
        
        // Extract URL from HTML
        let url = null;
        if (rawLinkHTML) {
          const match = rawLinkHTML.match(/href\s*=\s*["']([^"']+)["']/);
          url = match ? match[1].trim() : null;
        }
        
        // Try to get title from object, fallback to HTML anchor text
        let linkTitle = cleanTitle(rawTitle);
        
        if (!isValidTitle(linkTitle) && rawLinkHTML) {
          const anchorText = extractAnchorText(rawLinkHTML);
          if (anchorText) {
            linkTitle = cleanTitle(anchorText);
          }
        }
        
        const isValidUrl = url && url.trim() && url !== '#' && !/^[\s\u00A0\u200B]*$/.test(url);
        if (isValidTitle(linkTitle) && isValidUrl) {
          links[linkTitle] = url;
        }
      });
      
      return {
        slug: obj.slug,
        title: obj.title,
        links: links,
      };
    });
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to load tutor resources:", e);
    }
    error = "Unable to load tutor resources at this time.";
  }

  return (
    <div className="tutor-resources-page">
      <Masthead
        showLargeTitle={true}
        showAtSymbol={false}
        topRowPillColorClass="bryte-pill-green"
        titleWords={["Tutor Resources"]}
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

      <div className="tutor-resources-inner">
        {error && <p className="error-message">{error}</p>}

        {!error && sections.length === 0 && (
          <p className="no-resources-message">No resources available right now.</p>
        )}

        {!error &&
          sections.map((section) => (
            <CollapsibleLinkSection
              key={section.slug}
              title={section.title}
              links={section.links}
            />
          ))}
      </div>
    </div>
  );
}