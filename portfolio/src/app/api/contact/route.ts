import { NextRequest, NextResponse } from "next/server";

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
  return str.replace(/[<>]/g, "").trim();
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

    // Sanitize
    const sanitized = {
      name: sanitize(name),
      email: sanitize(email),
      subject: subject ? sanitize(subject) : "",
      message: sanitize(message),
    };

    // In production, integrate with an email service:
    // - Resend (resend.com)
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP
    //
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "portfolio@ras.dev",
    //   to: process.env.CONTACT_EMAIL!,
    //   subject: `Portfolio Contact: ${sanitized.subject || "New Message"}`,
    //   html: `<p><strong>From:</strong> ${sanitized.name} (${sanitized.email})</p>
    //          <p><strong>Subject:</strong> ${sanitized.subject}</p>
    //          <p>${sanitized.message}</p>`,
    // });

    console.log("Contact form submission:", sanitized);

    return NextResponse.json(
      { success: true, message: "Message received successfully." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
