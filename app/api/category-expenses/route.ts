import { NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors"; // ensure this file exists

export const dynamic = "force-dynamic";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  const year = searchParams.get("year");

  if (!groupId || !year) {
    return NextResponse.json(
      { error: "Missing groupId or year" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const apiUrl = `${BASE_URL}/api/Analytics/GetExpensesByTypewise?groupId=${groupId}&year=${year}`;
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: res.status, headers: corsHeaders }
      );
    }

    const data = await res.json();
    console.log("data: ", data);
    return NextResponse.json(data, { headers: corsHeaders });
  } catch (error) {
    console.error("Backend API error:", error);
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
