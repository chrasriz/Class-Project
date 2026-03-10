import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactPayload;
    const { name, email, subject, message } = body;

    // Validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    if (name.length > 200 || email.length > 200 || (subject && subject.length > 500) || message.length > 5000) {
      return NextResponse.json(
        { error: "Input exceeds maximum length." },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitized = {
      name: sanitize(name),
      email: sanitize(email),
      subject: subject ? sanitize(subject) : "New Message",
      message: sanitize(message),
    };

    // Send email via Resend
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: `Portfolio <${process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"}>`,
        to: process.env.CONTACT_EMAIL || "connect@chrasriz.com",
        replyTo: email,
        subject: `Portfolio Contact: ${sanitized.subject}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #06b6d4; border-bottom: 2px solid #06b6d4; padding-bottom: 8px;">New Portfolio Message</h2>
            <p><strong>From:</strong> ${sanitized.name}</p>
            <p><strong>Email:</strong> ${sanitized.email}</p>
            <p><strong>Subject:</strong> ${sanitized.subject}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <p style="white-space: pre-wrap;">${sanitized.message}</p>
          </div>
        `,
      });

      if (error) {
        console.error("Resend error:", error);
        return NextResponse.json(
          { error: "Failed to send message. Please try again or email directly." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again or email directly." },
      { status: 500 }
    );
  }
}
