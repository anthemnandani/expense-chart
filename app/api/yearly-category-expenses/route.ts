export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors"; // <-- ADD THIS

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const groupId = searchParams.get("groupId");
    const yearsParam = searchParams.get("years");
    const years = yearsParam ? yearsParam.split(",").map(Number) : [];

    if (!groupId || years.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "Missing groupId or years" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Fetch all category data for each year
    const allData = await Promise.all(
      years.map(async (year) => {
        const res = await fetch(
          `${BASE_URL}/api/Analytics/GetExpensesByTypewise?groupId=${groupId}&year=${year}`,
          { cache: "no-store" }
        );
        return await res.json();
      })
    );

    // Process categories
    const allCategories = new Set<string>();
    const yearDataMap = new Map<string, Record<string, number>>();

    allData.forEach((yearData, index) => {
      const year = years[index].toString();
      const yearCategories: Record<string, number> = {};

      yearData.forEach((item: any) => {
        if (item.expenseDescType && item.totalExpenses) {
          const category = item.expenseDescType;
          allCategories.add(category);
          yearCategories[category] =
            (yearCategories[category] || 0) + item.totalExpenses;
        }
      });

      yearDataMap.set(year, yearCategories);
    });

    const categories = Array.from(allCategories);

    const data = Array.from(yearDataMap.entries()).map(
      ([year, categoriesData]) => ({
        year,
        ...categoriesData,
      })
    );

    return new NextResponse(
      JSON.stringify({
        years: Array.from(yearDataMap.keys()),
        categories,
        data,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Yearly category expenses API error:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to load yearly category expenses data",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// ✅ Preflight request support
export function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}