// app/api/net-balance-daywise/route.ts
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

    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const responses = await Promise.all(
      months.map((m) =>
        fetch(`${BASE_URL}/api/Analytics/GetMonthlyExpenseDrandCr?groupId=${groupId}&year=${year}&months=${m}`)
          .then((res) => res.json())
          .catch(() => [])
      )
    );

    // Flatten & transform to [timestamp, netBalance]
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
      .sort((a, b) => a[0] - b[0]); // sort by date

    return NextResponse.json(daywiseData);
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
