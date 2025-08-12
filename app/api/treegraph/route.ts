import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");
    const yearsParam = searchParams.get("years");
    const availableYears = yearsParam ? yearsParam.split(",").map(Number) : [];

    if (!groupId || availableYears.length === 0) {
      return NextResponse.json({ error: "Missing groupId or years" }, { status: 400 });
    }

    const rootNode = [{ id: "root", name: "Expense Data" }];
    let nodes: any[] = [];

    for (let year of availableYears) {
      // 1️⃣ Yearly Credit & Debit totals
      const yearRes = await fetch(
        `${BASE_URL}/api/Analytics/GetCrAndDRYearwise?groupId=${groupId}&year=${year}`
      );
      const yearData = await yearRes.json();

      const totalCredit = yearData.reduce(
        (sum: number, item: any) => sum + (item.totalCredit || 0),
        0
      );
      const totalDebit = yearData.reduce(
        (sum: number, item: any) => sum + (item.totalDebit || 0),
        0
      );

      nodes.push({
        id: `${year}`,
        parent: "root",
        name: `${year} (Cr ₹${totalCredit}, Dr ₹${totalDebit})`,
        color: "#3b82f6"
      });

      // 2️⃣ Category-wise expenses
      const catRes = await fetch(
        `${BASE_URL}/api/Analytics/GetExpensesByTypewise?groupId=${groupId}&year=${year}`
      );
      const cats = await catRes.json();

      const months = [...new Set(cats.map((c: any) => c.month).filter(Boolean))];

      for (let m of months) {
        const monthName = new Date(2000, m - 1, 1).toLocaleString("default", {
          month: "long"
        });

        const monthTotalExpense = cats
          .filter((c: any) => c.month == m)
          .reduce((sum: number, c: any) => sum + (c.totalExpenses || 0), 0);

        nodes.push({
          id: `${year}-${m}`,
          parent: `${year}`,
          name: `${monthName} (₹${monthTotalExpense})`,
          color: "#22c55e"
        });

        cats
          .filter((c: any) => c.month == m && c.totalExpenses > 0)
          .forEach((c: any, idx: number) => {
            nodes.push({
              id: `${year}-${m}-${idx}`,
              parent: `${year}-${m}`,
              name: `${c.expenseDescType}: ₹${c.totalExpenses}`,
              color: "#f59e0b"
            });
          });
      }
    }

    return NextResponse.json([...rootNode, ...nodes]);
  } catch (error) {
    console.error("TreeGraph API error:", error);
    return NextResponse.json(
      { error: "Failed to load tree data" },
      { status: 500 }
    );
  }
}