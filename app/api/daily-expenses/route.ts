import { NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors"; // ensure this exists

export const dynamic = "force-dynamic";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    if (!groupId || !year || !month) {
      return NextResponse.json(
        { error: "Missing required query params" },
        { status: 400, headers: corsHeaders }
      );
    }

    const res = await fetch(
      `${BASE_URL}/api/Analytics/GetMonthlyExpenseDrandCr?groupId=${groupId}&year=${year}&months=${month}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from analytics API" },
        { status: res.status, headers: corsHeaders }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { headers: corsHeaders });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
