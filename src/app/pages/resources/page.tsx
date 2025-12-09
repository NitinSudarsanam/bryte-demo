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

function extractHref(htmlString: string): string | null {
  if (!htmlString) return null;
  const match = htmlString.match(/href="([^"]+)"/);
  return match ? match[1] : null;
}

function extractLinks(htmlString: string): LinksDict {
  if (!htmlString) return {};
  
  const links: LinksDict = {};
  const linkRegex = /<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;
  let match;
  
  while ((match = linkRegex.exec(htmlString)) !== null) {
    const url = match[1];
    const title = match[2].trim();
    if (title && url) {
      links[title] = url;
    }
  }
  
  return links;
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
        parentLinks = metadata.links.reduce((acc: LinksDict, linkObj: any) => {
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
      }
    }

    // Fetch tutor resources
    const tutorData = await cosmic.objects
      .findOne({
        type: "sections",
        slug: "resources-for-tutors",
      })
      .props("slug,title,metadata")
      .depth(1);

    if (tutorData?.object?.metadata?.tutor_resources) {
      const tutorResources = tutorData.object.metadata.tutor_resources;
      
      tutorSections = tutorResources.map((resource: any) => {
        const metadata = resource.metadata || {};
        const info = metadata.info || "";
        
        return {
          slug: resource.slug,
          title: resource.title,
          links: extractLinks(info),
        };
      });
    }
  } catch (e) {
    console.error("Failed to load resources:", e);
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
