export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");
    const year = searchParams.get("year");
    const months = searchParams.get("months");

    if (!groupId || !year || !months) {
      return new NextResponse(
        JSON.stringify({ error: "Missing groupId, year, or months" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const apiUrl = `${BASE_URL}/api/Analytics/GetExpenseMonthswise?groupId=${groupId}&year=${year}&months=${months}`;

    const res = await fetch(apiUrl);

    if (!res.ok) {
      return new NextResponse(
        JSON.stringify({ error: "Failed to fetch data" }),
        { status: res.status, headers: corsHeaders }
      );
    }

    const data = await res.json();

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("API proxy error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Required for CORS preflight (OPTIONS)
export function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}