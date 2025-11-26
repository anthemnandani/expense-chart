import { corsHeaders } from "@/lib/cors";

export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");
    const year = searchParams.get("year");

    if (!groupId || !year) {
      return NextResponse.json(
        { error: "Missing groupId or year" },
        { status: 400, headers: corsHeaders }
      );
    }

    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const responses = await Promise.all(
      months.map((m) =>
        fetch(
          `${BASE_URL}/api/Analytics/GetMonthlyExpenseDrandCr?groupId=${groupId}&year=${year}&months=${m}`,
          { cache: "no-store" }
        )
          .then((res) => res.json())
          .catch(() => [])
      )
    );

    const creditData = [];
    const debitData = [];

    responses.flat().forEach((item) => {
      const [dd, mm, yyyy] = item.date.split("/").map(Number);
      const timestamp = new Date(yyyy, mm - 1, dd).getTime();

      creditData.push([timestamp, item.credit || 0]);
      debitData.push([timestamp, item.debit || 0]);
    });

    return NextResponse.json(
      {
        credit: creditData.sort((a, b) => a[0] - b[0]),
        debit: debitData.sort((a, b) => a[0] - b[0]),
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}