import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");
    const year = searchParams.get("year");
    const months = searchParams.get("months");

    if (!groupId || !year || !months) {
      return NextResponse.json(
        { error: "Missing groupId, year, or months" },
        { status: 400 }
      );
    }

    const apiUrl = `http://essentialsapi.antheminfotech.com/api/Analytics/GetExpenseMonthswise?groupId=${groupId}&year=${year}&months=${months}`;

    const res = await fetch(apiUrl);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}