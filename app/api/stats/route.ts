// app/api/expenses/stats/route.ts
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { sql, config } from "@/lib/db";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  const yearParam = searchParams.get("year");
  const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();
  const prevYear = year - 1;

  if (!groupId) {
    return NextResponse.json({ error: "groupId is required" }, { status: 400, headers: corsHeaders });
  }

  try {
    const pool = await sql.connect(config);

    // 📌 Helper: get totals for a year
    const getYearData = async (yr: number) => {
      const totals = await pool.request()
        .input("groupId", groupId)
        .input("year", yr)
        .query(`
          SELECT 
              SUM(CASE WHEN ExpenseTypeId = 1 THEN Expenses ELSE 0 END) AS totalCredit,
              SUM(CASE WHEN ExpenseTypeId = 2 THEN Expenses ELSE 0 END) AS totalDebit
          FROM tbl_Expenses
          WHERE GroupId = @groupId AND YEAR(Date) = @year AND IsDeleted = 0
        `);

      const activeMonths = await pool.request()
        .input("groupId", groupId)
        .input("year", yr)
        .query(`
          SELECT COUNT(DISTINCT MONTH(Date)) AS activeMonths
          FROM tbl_Expenses
          WHERE GroupId = @groupId AND YEAR(Date) = @year 
                AND IsDeleted = 0 
                AND (ExpenseTypeId = 1 OR ExpenseTypeId = 2)
        `);

      return {
        totalCredit: totals.recordset[0]?.totalCredit || 0,
        totalDebit: totals.recordset[0]?.totalDebit || 0,
        activeMonths: activeMonths.recordset[0]?.activeMonths || 0,
      };
    };

    // Fetch current & previous year
    const curr = await getYearData(year);
    const prev = await getYearData(prevYear);

    // Latest balance (from latest record)
    const latestBalanceResult = await pool.request()
      .input("groupId", groupId)
      .query(`
        SELECT TOP 1 Balance
        FROM tbl_Expenses
        WHERE GroupId = @groupId AND IsDeleted = 0
        ORDER BY Date DESC
      `);

    const latestBalance = latestBalanceResult.recordset[0]?.Balance || 0;

    return NextResponse.json({
      curr,
      prev,
      netBalance: latestBalance,
    }, {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500, headers: corsHeaders });
  }
}