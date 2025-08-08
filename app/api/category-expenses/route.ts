// app/api/category-expenses/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  const year = searchParams.get("year");

  if (!groupId || !year) {
    return NextResponse.json({ error: "Missing groupId or year" }, { status: 400 });
  }

  try {
    const apiUrl = `http://essentialsapi.antheminfotech.com/api/Analytics/GetExpensesByTypewise?groupId=${groupId}&year=${year}`;
    const res = await fetch(apiUrl);

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: res.status });
    }

    const data = await res.json();
    console.log("data: ", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Backend API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}