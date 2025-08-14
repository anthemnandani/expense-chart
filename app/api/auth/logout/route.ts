export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set("access_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("user_email", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return response;
}