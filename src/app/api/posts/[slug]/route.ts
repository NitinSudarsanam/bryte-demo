import { NextResponse } from "next/server";
import { createBucketClient } from "@cosmicjs/sdk";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const bucketSlug =
      process.env.COSMIC_POSTS_BUCKET_SLUG ||
      process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG ||
      process.env.NEXT_PUBLIC_COSMIC_BUCKET;
    const readKey =
      process.env.COSMIC_POSTS_READ_KEY ||
      process.env.NEXT_PUBLIC_COSMIC_READ_KEY;

    if (!bucketSlug || !readKey) {
      return NextResponse.json(
        { error: "Posts configuration not available" },
        { status: 500 }
      );
    }

    const cosmic = createBucketClient({ bucketSlug, readKey });
    const data = await cosmic.objects
      .find({ type: "posts" })
      .props("id,slug,title,metadata,type,created_at")
      .depth(1);

    const objects = (data as { objects?: unknown[] }).objects || [];
    const post = objects.find(
      (obj: { slug?: string; type?: string }) =>
        obj.slug === slug && obj.type === "posts"
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
