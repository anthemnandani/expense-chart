export const dynamic = "force-dynamic";

import { corsHeaders } from "@/lib/cors";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");

    if (!groupId) {
      return NextResponse.json(
        { error: "Missing required query params" },
        { status: 400, headers: corsHeaders }
      );
    }

    const res = await fetch(
      `${BASE_URL}/api/Users/GetCurrencyByUserId?groupId=${groupId}`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from analytics API" },
        { status: res.status, headers: corsHeaders }
      );
    }

    const data = await res.json();

    return NextResponse.json(data, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
