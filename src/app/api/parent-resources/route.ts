import { NextResponse } from "next/server";
import { createBucketClient } from "@cosmicjs/sdk";

function extractHref(htmlString: string): string | null {
  if (!htmlString) return null;
  const match = htmlString.match(/href="([^"]+)"/);
  return match ? match[1] : null;
}

export async function GET() {
  try {
    const bucketSlug = process.env.COSMIC_BUCKET_SLUG;
    const readKey = process.env.COSMIC_READ_KEY;

    if (!bucketSlug || !readKey) {
      throw new Error("COSMIC_BUCKET_SLUG or COSMIC_READ_KEY is not set");
    }

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

    const section = (data as any).object;

    if (!section?.metadata?.links) {
      return NextResponse.json(
        { error: "No links found in 'Resources - For Parents' section" },
        { status: 404 }
      );
    }

    const linksArray = section.metadata.links;
    const links: Record<string, string> = {};

    linksArray.forEach((linkObj: any) => {
      const title = linkObj.title;
      const rawLinkHTML = linkObj.metadata?.link;
      const url = extractHref(rawLinkHTML || "");

      if (title && url) {
        links[title] = url;
      }
    });

    return NextResponse.json({ links });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("COSMIC parent-resources error:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch parent resources" },
      { status: 500 }
    );
  }
}
