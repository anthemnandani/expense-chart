export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { sql, config } from "@/lib/db";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = Number(searchParams.get("groupId"));
  const year = Number(searchParams.get("year"));

  if (!groupId || !year) {
    return NextResponse.json(
      { error: "Missing required parameters: groupId and year" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const pool = await sql.connect(config);

    const result = await pool.request()
      .input("groupId", groupId)
      .input("year", year)
      .query(`
        SELECT 
          Expenses,
          ExpenseTypeId,
          ExpenseDescType,
          [Date],
          Balance
        FROM tbl_Expenses
        WHERE GroupId = @groupId
          AND YEAR([Date]) = @year
          AND IsDeleted = 0
        ORDER BY [Date] ASC
      `);

    const expenses = result.recordset;

    // 🔹 Initialize months
    const monthlyMap: Record<string, any> = {};

    for (let i = 1; i <= 12; i++) {
      monthlyMap[i] = {
        month: i.toString(),
        totalDebit: 0,
        totalCredit: 0,
        balance: 0,
        categories: {}
      };
    }

    // 🔹 Aggregate
    for (const exp of expenses) {
      const date = new Date(exp.Date);
      const month = (date.getMonth() + 1).toString();
      const amount = Number(exp.Expenses) || 0;
      const type = Number(exp.ExpenseTypeId);
      const category = exp.ExpenseDescType?.trim();

      if (type === 1) {
        monthlyMap[month].totalCredit += amount;
      } else {
        monthlyMap[month].totalDebit += amount;
      }

      // ✅ last transaction balance of the month
      monthlyMap[month].balance = Number(exp.Balance) || monthlyMap[month].balance;

      // ✅ category-wise aggregation (only for debit usually, but keeping generic)
      if (category) {
        monthlyMap[month].categories[category] =
          (monthlyMap[month].categories[category] || 0) + amount;
      }
    }

    const response = Object.values(monthlyMap);

    return NextResponse.json(response, {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error("Error fetching yearly expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch yearly expenses" },
      { status: 500, headers: corsHeaders }
    );
  }
}