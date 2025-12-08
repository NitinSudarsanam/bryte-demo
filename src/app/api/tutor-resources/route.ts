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
      .find({
        type: "tutor-resources",
      })
      .props("slug,title,metadata")
      .depth(1);

    const objects = (data as any).objects || [];

    const sections = objects.map((obj: any) => {
      const slug = obj.slug;
      const title = obj.title;
      const info = obj.metadata?.info || null;
      const linksArray = obj.metadata?.links || [];

      const links = linksArray.map((linkObj: any) => {
        const linkTitle = linkObj.title;
        const rawLinkHTML = linkObj.metadata?.link || "";
        const url = extractHref(rawLinkHTML);
        const description = linkObj.metadata?.description || null;

        return {
          title: linkTitle,
          url: url,
          description,
        };
      }).filter((l: any) => l.title && l.url);

      return {
        slug,
        title,
        info,
        links,
      };
    });

    return NextResponse.json({ sections });
  } catch (error: any) {
    console.error("COSMIC tutor-resources error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch tutor resources",
        detail: error?.message,
      },
      { status: 500 }
    );
  }
}
