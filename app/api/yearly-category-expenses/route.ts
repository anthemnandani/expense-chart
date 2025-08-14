export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");
    const yearsParam = searchParams.get("years");
    const years = yearsParam ? yearsParam.split(',').map(Number) : [];

    // Fetch all category data for the requested years
    const allData = await Promise.all(
      years.map(async (year) => {
        const res = await fetch(
          `${BASE_URL}/api/Analytics/GetExpensesByTypewise?groupId=${groupId}&year=${year}`
        );
        return await res.json();
      })
    );

    // Process data to get unique categories across all years
    const allCategories = new Set<string>();
    const yearDataMap = new Map<string, Record<string, number>>();

    allData.forEach((yearData, index) => {
      const year = years[index].toString();
      const yearCategories: Record<string, number> = {};

      yearData.forEach((item: any) => {
        if (item.expenseDescType && item.totalExpenses) {
          const category = item.expenseDescType;
          allCategories.add(category);
          yearCategories[category] = (yearCategories[category] || 0) + item.totalExpenses;
        }
      });

      yearDataMap.set(year, yearCategories);
    });

    // Prepare response data
    const categories = Array.from(allCategories);
    const data = Array.from(yearDataMap.entries()).map(([year, categoriesData]) => {
      return {
        year,
        ...categoriesData
      };
    });

    return NextResponse.json({
      years: Array.from(yearDataMap.keys()),
      categories,
      data
    });
  } catch (error) {
    console.error("Yearly category expenses API error:", error);
    return NextResponse.json(
      { error: "Failed to load yearly category expenses data" },
      { status: 500 }
    );
  }
}