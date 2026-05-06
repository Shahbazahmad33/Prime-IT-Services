const path = require("path");
const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

app.use(express.json());
app.use(express.static(path.join(__dirname)));

function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // true for SSL (465), false for TLS (587)
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

// app.use(cors({
//   origin: "https://your-frontend-domain.com"
// }));


// ✅ Health check that verifies SMTP connection
app.get("/api/health", async (req, res) => {
  const transporter = createTransporter();

  if (!transporter) {
    return res.json({
      ok: true,
      service: "prime-it-contact-api",
      smtpConfigured: false,
      env: isProduction ? "production" : "development",
    });
  }

  try {
    await transporter.verify(); // Nodemailer handshake
    res.json({
      ok: true,
      service: "prime-it-contact-api",
      smtpConfigured: true,
      env: isProduction ? "production" : "development",
    });
  } catch (error) {
    res.json({
      ok: true,
      service: "prime-it-contact-api",
      smtpConfigured: false,
      env: isProduction ? "production" : "development",
      error: error.message,
    });
  }
});

// ✅ Contact form route
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim();
    const cleanMessage = String(message || "").trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanName || !cleanEmail || !cleanMessage || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({ ok: false, error: "Invalid input." });
    }

    const recipient = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER;
    if (!recipient) {
      return res.status(500).json({ ok: false, error: "Recipient email not configured." });
    }

    const transporter = createTransporter();
    if (!transporter) {
      return res.status(500).json({ ok: false, error: "SMTP settings are missing." });
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      to: recipient,
      replyTo: cleanEmail,
      subject: `New Contact Form Message from ${cleanName}`,
      text: `Name: ${cleanName}\nEmail: ${cleanEmail}\n\nMessage:\n${cleanMessage}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${cleanName}</p>
        <p><strong>Email:</strong> ${cleanEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${cleanMessage.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Failed to send message." });
  }
});

// ✅ Test email route
app.post("/api/test-email", async (req, res) => {
  if (isProduction) {
    return res.status(403).json({ ok: false, error: "Disabled in production." });
  }

  try {
    const recipient = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER;
    const transporter = createTransporter();

    if (!recipient || !transporter) {
      return res.status(500).json({ ok: false, error: "SMTP is not fully configured." });
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      to: recipient,
      subject: "Prime IT Website SMTP Test",
      text: "SMTP test successful. Your contact form backend can send emails.",
      html: "<p><strong>SMTP test successful.</strong> Your contact form backend can send emails.</p>",
    });

    return res.json({ ok: true, message: "Test email sent successfully." });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Failed to send test email." });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend is running" });
});


// ✅ Serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});



app.listen(PORT, () => {
  console.log(`Prime IT website running on http://localhost:${PORT}`);
});
