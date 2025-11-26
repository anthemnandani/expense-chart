export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors"; // <-- ADD THIS

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    if (!groupId || !year || !month) {
      return new NextResponse(
        JSON.stringify({ error: "Missing query parameters" }),
        { status: 400, headers: corsHeaders } // <-- CORS
      );
    }

    const res = await fetch(
      `${BASE_URL}/api/Analytics/GetMonthlyExpenseDrandCr?groupId=${groupId}&year=${year}&months=${month}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return new NextResponse(
        JSON.stringify({ error: "Failed to fetch data" }),
        { status: res.status, headers: corsHeaders } // <-- CORS
      );
    }

    const data = await res.json();

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: corsHeaders, // <-- CORS
    });
  } catch (error) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: corsHeaders } // <-- CORS
    );
  }
}

// ✅ Preflight Request Handler (required)
export function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
