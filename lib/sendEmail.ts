import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, htmlBody: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"${process.env.SMTP_SENDER_NAME}" <${process.env.SMTP_SENDER_EMAIL}>`,
      to,
      subject,
      html: htmlBody,
    });

    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}