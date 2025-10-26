import { NextResponse } from "next/server"
import { createBucketClient } from "@cosmicjs/sdk"
import nodemailer from "nodemailer"

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

    // Send email notification to ethan_seiz@brown.edu
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // Your email
          pass: process.env.EMAIL_PASS, // Your app password
        },
      })

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><em>This message was sent from the contact form on your website.</em></p>
        `,
      }

      await transporter.sendMail(mailOptions)
      console.log('Email sent successfully')
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail the entire request if email fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cosmic API error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}