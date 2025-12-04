import { NextResponse } from "next/server";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import nodemailer from "nodemailer";
import { v2 as cloudinary } from "cloudinary";
import { corsHeaders } from "@/lib/cors";

// ⛔ Handle preflight OPTIONS request
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { expenses, email, fullName } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!expenses || expenses.length === 0) {
      return NextResponse.json(
        { error: "No expenses found" },
        { status: 400, headers: corsHeaders }
      );
    }

    // 1. Generate PDF
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Expenses Report", 14, 22);

    const tableColumn = ["Date", "Description", "Category", "Type", "Amount"];
    const tableRows: any[] = [];

    expenses.forEach((exp: any) => {
      const date = new Date(exp.Date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      tableRows.push([
        date,
        exp.Description,
        exp.ExpenseDescType,
        exp.Type === "Cr." ? "Credit" : "Debit",
        // `${exp.Expenses.toLocaleString()}`,
        String(exp.Expenses)
          .replace(/[^0-9.-]+/g, "")  // remove currency symbols and text
          .toLocaleString()
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 9 },
    });

    const pdfBase64 = doc.output("datauristring").split(",")[1];
    const pdfBuffer = Buffer.from(pdfBase64, "base64");

    // 2. Upload to Cloudinary
    const cloudinaryUpload = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "expense-reports",
          resource_type: "raw",
          type: "authenticated",
          filename_override: `expense-report-${Date.now()}.pdf`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(pdfBuffer);
    });

    const fileUrl = (cloudinaryUpload as any).secure_url;

    // 3. Send email with button
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <body style="margin:0; padding:0; background:#f2f6fc; font-family:Arial, sans-serif;">
        <table width="100%" cellspacing="0" cellpadding="0" style="padding:40px 0;">
          <tr>
            <td align="center">

              <table width="600" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

                <tr>
                  <td style="background:#0d6efd; padding:22px; text-align:center;">
                    <h2 style="color:#ffffff; margin:0; font-size:24px;">Your Expense Report</h2>
                  </td>
                </tr>

                <tr>
                  <td style="padding:32px; color:#333; font-size:16px; line-height:1.6;">
                    <p>Hello ${fullName},</p>

                    <p>Your requested <strong>Expense Report</strong> is ready.</p>

                    <p>Click the button below to download your PDF.</p>

                    <div style="text-align:center; margin:30px 0;">
                      <a href="${fileUrl}"
                        style="
                          background:#0d6efd;
                          padding:14px 30px;
                          color:#ffffff;
                          text-decoration:none;
                          font-size:16px;
                          border-radius:8px;
                          font-weight:bold;
                          display:inline-block;">
                        View Expense Report
                      </a>
                    </div>

                    <p>If you have questions, feel free to reach out.</p>

                    <p style="margin-top:30px;">
                      Regards,<br />
                      <strong>${process.env.SMTP_SENDER_NAME}</strong>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="background:#f2f6fc; padding:20px; text-align:center; color:#777; font-size:14px;">
                    This is an automated email. Please do not reply.<br />
                    © ${new Date().getFullYear()} ${process.env.SMTP_SENDER_NAME}
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"${process.env.SMTP_SENDER_NAME}" <${process.env.SMTP_SENDER_EMAIL}>`,
      to: email,
      subject: "Your Expense Report",
      html: emailHtml,
    });

    return NextResponse.json(
      { message: "Email sent successfully", fileUrl },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json(
      { error: "Failed to send report" },
      { status: 500, headers: corsHeaders }
    );
  }
}