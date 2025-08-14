export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");
    const year = searchParams.get("year");

    if (!groupId || !year) {
      return NextResponse.json({ error: "Missing groupId or year" }, { status: 400 });
    }

    const apiUrl = `${BASE_URL}/api/Analytics/GetYearlyExpenseChart?groupId=${groupId}&year=${year}`;

    const res = await fetch(apiUrl);
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
