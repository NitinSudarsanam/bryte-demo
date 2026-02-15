import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

const MAX_NAME_LENGTH = 100
const MAX_MESSAGE_LENGTH = 5000
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5

const contactRateLimit = new Map<string, number[]>()

function getClientId(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return req.headers.get("x-real-ip") ?? "unknown"
}

function isRateLimited(clientId: string): boolean {
  const now = Date.now()
  let timestamps = contactRateLimit.get(clientId) ?? []
  timestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) return true
  timestamps.push(now)
  contactRateLimit.set(clientId, timestamps)
  return false
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export async function POST(req: Request) {
  try {
    // CSRF: require same-origin (Origin matches request URL origin)
    const origin = req.headers.get("origin")
    if (origin) {
      try {
        const requestOrigin = new URL(req.url).origin
        if (origin !== requestOrigin) {
          return NextResponse.json(
            { error: "Forbidden" },
            { status: 403 }
          )
        }
      } catch {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        )
      }
    }

    const clientId = getClientId(req)
    if (isRateLimited(clientId)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      )
    }

    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const nameStr = String(name).trim()
    const emailStr = String(email).trim()
    const messageStr = String(message).trim()

    if (nameStr.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: "Name is too long" },
        { status: 400 }
      )
    }
    if (messageStr.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: "Message is too long" },
        { status: 400 }
      )
    }
    if (!EMAIL_REGEX.test(emailStr)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Initialize Cosmic client (only if you want to log submissions)
    // Commenting out Cosmic storage due to schema restrictions
    /*
    const cosmic = createBucketClient({
      bucketSlug: process.env.COSMIC_BUCKET_SLUG!,
      readKey: process.env.COSMIC_READ_KEY!,
      writeKey: process.env.COSMIC_WRITE_KEY!,
    })

    // Generate a unique slug for the contact submission
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const slug = `contact-inquiry-${name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}`
    
    await cosmic.objects.insertOne({
      type: "sections",
      slug: slug,
      title: `Contact Inquiry from ${name}`,
      metadata: {
        contact_name: name,
        contact_email: email,
        contact_message: message,
        submission_date: new Date().toISOString().split('T')[0],
        submission_type: "contact-form",
      },
    })
    */

    // Send email notification to ethan_seiz@brown.edu
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // Your email
          pass: process.env.EMAIL_PASS, // Your app password
        },
      })

      const safeName = escapeHtml(nameStr)
      const safeEmail = escapeHtml(emailStr)
      const safeMessage = escapeHtml(messageStr).replace(/\n/g, "<br>")

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `New Contact Form Submission from ${safeName}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
          <hr>
          <p><em>This message was sent from the contact form on your website.</em></p>
        `,
      }

      await transporter.sendMail(mailOptions)
      if (process.env.NODE_ENV === "development") {
        console.log("Email sent successfully")
      }
    } catch (emailError) {
      if (process.env.NODE_ENV === "development") {
        console.error("Email sending failed:", emailError)
      }
      // Don't fail the entire request if email fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Contact API error:", error)
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}