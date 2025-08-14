export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    if (!groupId || !year || !month) {
      return NextResponse.json({ error: "Missing required query params" }, { status: 400 });
    }

    const res = await fetch(
      `${BASE_URL}/api/Analytics/GetMonthlyExpenseDrandCr?groupId=${groupId}&year=${year}&months=${month}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from analytics API" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}