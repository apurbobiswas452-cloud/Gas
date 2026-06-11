import { NextResponse } from "next/server";

// In-memory storage (resets on redeploy — for serverless/Netlify)
let bookings: any[] = [];

async function sendEmailNotification(booking: any) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const receiverEmail = process.env.RECEIVER_EMAIL || "aditayadasd@gmail.com";

  if (!resendApiKey) {
    console.log("📧 Email skipped: RESEND_API_KEY not configured");
    return;
  }

  const serviceNames: Record<string, string> = {
    "engine-diagnostics": "Engine Diagnostics",
    "general-repair": "General Repair",
    "scheduled-maintenance": "Scheduled Maintenance",
    "precision-detailing": "Precision Detailing",
    "ac-service": "AC Diagnostics & Repair",
    "brake-repair": "Advanced Brake System",
    "tire-replacement": "Performance Tires",
    "car-painting": "Custom Painting & Restoration",
  };

  const serviceName = serviceNames[booking.service] || booking.service;
  const bookingDate = new Date(booking.createdAt).toLocaleString("en-BD", {
    timeZone: "Asia/Dhaka",
    dateStyle: "full",
    timeStyle: "short",
  });

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f1f5f9; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #0f172a; border-radius: 16px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #1e3a8a, #1d4ed8); padding: 32px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 2px; }
        .header p { color: #93c5fd; margin: 8px 0 0; font-size: 13px; }
        .badge { display: inline-block; background: rgba(59,130,246,0.2); border: 1px solid rgba(59,130,246,0.4); color: #60a5fa; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 1px; margin-top: 12px; }
        .body { padding: 32px; }
        .alert { background: #1e3a5f; border: 1px solid #2563eb; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; }
        .alert p { color: #93c5fd; margin: 0; font-size: 13px; }
        .alert strong { color: white; }
        .field { margin-bottom: 16px; }
        .label { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px; }
        .value { font-size: 15px; font-weight: 600; color: #f1f5f9; background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 12px 16px; }
        .service-badge { display: inline-block; background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); color: #60a5fa; padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 700; }
        .message-box { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 14px 16px; color: #cbd5e1; font-size: 14px; line-height: 1.6; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .footer { background: #020617; padding: 20px 32px; text-align: center; }
        .footer p { color: #475569; font-size: 11px; margin: 0; }
        .divider { height: 1px; background: #1e293b; margin: 24px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>GRAND AUTO SERVICES</h1>
          <p>New Booking Inquiry Received</p>
          <span class="badge">GAS BOOKING SYSTEM</span>
        </div>
        <div class="body">
          <div class="alert">
            <p>📅 <strong>${bookingDate}</strong> — A new service inquiry has been submitted.</p>
          </div>
          <div class="grid">
            <div class="field">
              <div class="label">Customer Name</div>
              <div class="value">${booking.name}</div>
            </div>
            <div class="field">
              <div class="label">Phone Number</div>
              <div class="value">${booking.phone || "Not provided"}</div>
            </div>
          </div>
          <div class="field">
            <div class="label">Email Address</div>
            <div class="value">${booking.email}</div>
          </div>
          <div class="grid">
            <div class="field">
              <div class="label">Vehicle Model & Year</div>
              <div class="value">${booking.model}</div>
            </div>
            <div class="field">
              <div class="label">Service Requested</div>
              <div class="value"><span class="service-badge">${serviceName}</span></div>
            </div>
          </div>
          ${booking.message ? `
          <div class="divider"></div>
          <div class="field">
            <div class="label">Customer Message</div>
            <div class="message-box">${booking.message}</div>
          </div>` : ""}
          <div class="divider"></div>
          <p style="color:#64748b;font-size:12px;text-align:center;margin:0;">
            Booking ID: <code style="color:#60a5fa;">${booking.id}</code>
          </p>
        </div>
        <div class="footer">
          <p>&copy; 2026 Grand Auto Services — Chattogram, Bangladesh</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Grand Auto Services <onboarding@resend.dev>",
        to: [receiverEmail],
        subject: `🚗 New Booking: ${booking.name} — ${booking.model}`,
        html: htmlBody,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      console.log(`✅ Email sent successfully via Resend:`, result.id);
    } else {
      console.error("❌ Resend API error:", result);
    }
  } catch (error) {
    console.error("❌ Email send failed:", error);
  }
}

export async function GET() {
  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, model, service, message } = body;

    if (!name || !email || !model) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newBooking = {
      id: Date.now().toString(),
      name,
      phone: phone || "",
      email,
      model,
      service,
      message,
      createdAt: new Date().toISOString(),
    };

    bookings.push(newBooking);

    // Await so serverless container doesn't freeze before email is sent
    try {
      await sendEmailNotification(newBooking);
    } catch (emailError) {
      console.error("❌ Failed to send email notification:", emailError);
    }

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      bookings = [];
    } else {
      bookings = bookings.filter((b: any) => b.id !== id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
