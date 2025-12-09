import { createBucketClient } from "@cosmicjs/sdk";
import Header from "@/app/components/header";
import Masthead from "@/app/components/masthead/masthead";
import CollapsibleLinkSection from "@/app/components/links-section/links-section";
import "./tutor-resources.css";

type LinksDict = Record<string, string>;

type TutorSection = {
  slug: string;
  title: string;
  links: LinksDict;
};

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

export default async function ResourcesForBryteTutorsPage() {
  let sections: TutorSection[] = [];
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
        slug: "resources-for-tutors",
      })
      .props("slug,title,metadata")
      .depth(1);

    if (!data?.object?.metadata?.tutor_resources) {
      throw new Error("No tutor resources data returned from Cosmic");
    }

    const tutorResources = data.object.metadata.tutor_resources;
    
    sections = tutorResources.map((resource: any) => {
      const metadata = resource.metadata || {};
      const info = metadata.info || "";
      
      return {
        slug: resource.slug,
        title: resource.title,
        links: extractLinks(info),
      };
    });
  } catch (e) {
    console.error("Failed to load tutor resources:", e);
    error = "Unable to load tutor resources at this time.";
  }

  return (
    <div className="tutor-resources-page">
      <Header />
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