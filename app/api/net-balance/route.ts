export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors"; // <-- ADD THIS

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");
    const year = searchParams.get("year");

    if (!groupId || !year) {
      return new NextResponse(
        JSON.stringify({ error: "Missing groupId or year" }),
        { status: 400, headers: corsHeaders } // ← CORS
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

    const daywiseData: [number, number][] = responses
      .flat()
      .map((item: any) => {
        const dateParts = item.date.split("/"); // dd/mm/yyyy
        const day = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1;
        const yr = parseInt(dateParts[2]);
        const timestamp = new Date(yr, month, day).getTime();
        const balance = (item.credit || 0) - (item.debit || 0);
        return [timestamp, balance] as [number, number];
      })
      .sort((a, b) => a[0] - b[0]);

    return new NextResponse(JSON.stringify(daywiseData), {
      status: 200,
      headers: corsHeaders, // ← CORS
    });
  } catch (error) {
    console.error("API proxy error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: corsHeaders } // ← CORS
    );
  }
}

// ✅ MUST HAVE for Preflight CORS Requests
export function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}