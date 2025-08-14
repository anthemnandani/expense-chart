export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { sql, config } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const code = req.nextUrl.searchParams.get("code");

  if (!code) return new NextResponse("No code provided", { status: 400 });

  try {
    // Step 1: Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${origin}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token)
      return new NextResponse("Failed to get access token", { status: 400 });

    // Step 2: Get user info from Google
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userRes.json();

    if (!googleUser?.email)
      return new NextResponse("Failed to get user info", { status: 400 });

    const email = googleUser.email;

    // Step 3: Check user in your DB
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input("email", email)
      .query(`
        SELECT userId, userName, emailId, fullName, currency, profileImage, contactNumber
        FROM tblUsers
        WHERE emailId = @email AND IsDeleted = 0
      `);

    const dbUser = result.recordset[0];

    if (!dbUser) {
      // User doesn't exist in your DB — redirect to register page
      return NextResponse.redirect("https://essentials.workanthem.com/userRegister");
    }

    // Step 4: Create token (optional: use your own claims)
    const token = jwt.sign({ email: dbUser.emailId }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Step 5: Set cookies and redirect
    const res = NextResponse.redirect(`${origin}/`);

    res.cookies.set("user_email", dbUser.emailId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    res.cookies.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error("OAuth error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}