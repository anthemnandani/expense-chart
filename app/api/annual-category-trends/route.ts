import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  const year = searchParams.get("year");

  try {
    const res = await fetch(
      `${BASE_URL}/api/Analytics/GetExpensesByTypewise?groupId=${groupId}&year=${year}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`Backend API failed: ${res.status}`);
    }

    const rawData = await res.json();

    // Transform data → heatmap format: [monthIndex, categoryIndex, value]
    const categories = Array.from(
      new Set(rawData.map((item: any) => item.expenseDescType.trim()).filter(Boolean))
    );

    const data: [number, number, number][] = [];
    rawData.forEach((item: any) => {
      const monthIndex = Number(item.month) - 1; // 0-based for Highcharts
      const categoryIndex = categories.indexOf(item.expenseDescType.trim());
      const value = Number(item.totalExpenses) || 0;
      if (monthIndex >= 0 && categoryIndex >= 0) {
        data.push([monthIndex, categoryIndex, value]);
      }
    });

    return NextResponse.json({ categories, data });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}