import { createBucketClient } from "@cosmicjs/sdk";
import Header from "@/app/components/header";
import Masthead from "@/app/components/masthead/masthead";
import CollapsibleLinkSection from "@/app/components/links-section/links-section";
import "./resources.css";

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

// Helper: Decode HTML entities
function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
    '&ndash;': '–',
    '&mdash;': '—',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
  };
  
  // Replace named entities
  let decoded = text.replace(/&[a-z]+;/gi, (entity) => entities[entity.toLowerCase()] || entity);
  
  // Replace numeric entities (&#160; etc)
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(parseInt(dec, 10)));
  
  // Replace hex entities (&#x00A0; etc)
  decoded = decoded.replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
  
  return decoded;
}

// Helper: Clean and normalize title text
function cleanTitle(title: string): string {
  // First decode HTML entities (like &nbsp;)
  let cleaned = decodeHTMLEntities(title);
  
  // Normalize Unicode to standard form (converts fancy spaces, etc)
  cleaned = cleaned.normalize('NFKC');
  
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

export default async function ResourcesPage() {
  let parentLinks: LinksDict = {};
  let tutorSections: TutorSection[] = [];
  let error: string | null = null;

  try {
    const bucketSlug = process.env.COSMIC_BUCKET_SLUG!;
    const readKey = process.env.COSMIC_READ_KEY!;

    const cosmic = createBucketClient({
      bucketSlug,
      readKey,
    });

    // Fetch parent resources
    const parentData = await cosmic.objects
      .findOne({
        type: "sections",
        slug: "resources-for-parents",
      })
      .props("title,metadata")
      .depth(1);

    if (parentData?.object?.metadata) {
      const metadata = parentData.object.metadata;
      
      if (metadata.links && Array.isArray(metadata.links)) {
        parentLinks = metadata.links.reduce((acc: LinksDict, linkObj: any, index: number) => {
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
            acc[linkTitle] = url;
          }
          
          return acc;
        }, {});
      }
    }

    // Fetch tutor resources
    const tutorData = await cosmic.objects
      .find({
        type: "tutor-resources",
      })
      .props("slug,title,metadata")
      .depth(1);

    const tutorObjects = (tutorData as any).objects || [];

    tutorSections = tutorObjects.map((obj: any) => {
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
      console.error("Failed to load resources:", e);
    }
    error = "Unable to load resources at this time.";
  }

  return (
    <div className="resources-page">
      <Header />
      <Masthead
        showLargeTitle={true}
        showAtSymbol={false}
        topRowPillColorClass="bryte-pill-green"
        titleWords={["Resources"]}
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

      <div className="resources-inner">
        {error && <p className="error-message">{error}</p>}

        {!error && (
          <>
            {/* Parent Resources Section */}
            <section className="resources-section">
              <h2 className="section-heading">For Parents</h2>
              {Object.keys(parentLinks).length > 0 ? (
                <CollapsibleLinkSection
                  title="English Language Learning Classes"
                  links={parentLinks}
                />
              ) : (
                <p className="no-resources-message">No parent resources available right now.</p>
              )}
            </section>

            {/* Tutor Resources Section */}
            <section className="resources-section">
              <h2 className="section-heading">For Tutors</h2>
              {tutorSections.length > 0 ? (
                tutorSections.map((section) => (
                  <CollapsibleLinkSection
                    key={section.slug}
                    title={section.title}
                    links={section.links}
                  />
                ))
              ) : (
                <p className="no-resources-message">No tutor resources available right now.</p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
