// /api/auth/google/route.ts
import { NextRequest, NextResponse } from "next/server";

const GOOGLE_REDIRECT_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const SCOPE = "openid profile email";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/google/callback`;

  const authUrl = `${GOOGLE_REDIRECT_URL}?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent(
    SCOPE
  )}&access_type=offline&prompt=consent`;

  return NextResponse.redirect(authUrl);
}