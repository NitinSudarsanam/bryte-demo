import { NextResponse } from "next/server"
import { createBucketClient } from "@cosmicjs/sdk"

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Initialize Cosmic client
    const cosmic = createBucketClient({
      bucketSlug: process.env.COSMIC_BUCKET_SLUG!,
      writeKey: process.env.COSMIC_WRITE_KEY!,
      readKey: process.env.COSMIC_READ_KEY!,
    })


    await cosmic.objects.insertOne({
      type: "contact-submissions",
      title: `Contact from ${name}`,
      metadata: {
        name,
        email,
        message,
        submitted_at: "2024-01-16",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cosmic API error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}