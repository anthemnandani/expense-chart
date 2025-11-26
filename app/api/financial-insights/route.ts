export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { sql, config } from "@/lib/db";

import { corsHeaders } from "@/lib/cors"; 

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  if (!groupId || !year || !month) {
    return NextResponse.json({ error: "Missing query params" }, { status: 400 });
  }

  try {
    const pool = await sql.connect(config);
    const monthName = (m: number) => months[m - 1] || "Unknown";

    // ---------- 1. Yearly Credit/Debit Summary ----------
    const yearlyData = await pool.request()
      .input("groupId", groupId)
      .input("year", year)
      .query(`
        SELECT 
          MONTH(Date) AS month,
          SUM(CASE WHEN ExpenseTypeId = 1 AND ISNUMERIC(Expenses) = 1 
                   THEN CAST(Expenses AS FLOAT) ELSE 0 END) AS totalCredit,
          SUM(CASE WHEN ExpenseTypeId = 2 AND ISNUMERIC(Expenses) = 1 
                   THEN CAST(Expenses AS FLOAT) ELSE 0 END) AS totalDebit
        FROM tbl_Expenses
        WHERE GroupId = @groupId
          AND YEAR(Date) = @year
          AND IsDeleted = 0
        GROUP BY MONTH(Date)
      `);

    // Filter out zero months for lowest-month calculation
    const debitMonths = yearlyData.recordset.filter(m => m.totalDebit > 0);
    const creditMonths = yearlyData.recordset.filter(m => m.totalCredit > 0);

    const highestDebitMonth = debitMonths.length
      ? debitMonths.reduce((max, curr) =>
          curr.totalDebit > max.amount
            ? { month: monthName(curr.month), amount: curr.totalDebit }
            : max,
        { month: monthName(debitMonths[0].month), amount: debitMonths[0].totalDebit })
      : { month: "N/A", amount: 0 };

    const lowestDebitMonth = debitMonths.length > 1
      ? debitMonths.reduce((min, curr) =>
          curr.totalDebit < min.amount
            ? { month: monthName(curr.month), amount: curr.totalDebit }
            : min,
        { month: monthName(debitMonths[0].month), amount: debitMonths[0].totalDebit })
      : { month: debitMonths.length ? monthName(debitMonths[0].month) : "N/A", amount: debitMonths.length ? debitMonths[0].totalDebit : 0 };

    const highestCreditMonth = creditMonths.length
      ? creditMonths.reduce((max, curr) =>
          curr.totalCredit > max.amount
            ? { month: monthName(curr.month), amount: curr.totalCredit }
            : max,
        { month: monthName(creditMonths[0].month), amount: creditMonths[0].totalCredit })
      : { month: "N/A", amount: 0 };

    const lowestCreditMonth = creditMonths.length > 1
      ? creditMonths.reduce((min, curr) =>
          curr.totalCredit < min.amount
            ? { month: monthName(curr.month), amount: curr.totalCredit }
            : min,
        { month: monthName(creditMonths[0].month), amount: creditMonths[0].totalCredit })
      : { month: creditMonths.length ? monthName(creditMonths[0].month) : "N/A", amount: creditMonths.length ? creditMonths[0].totalCredit : 0 };

    // ---------- 2. Average Debit ----------
    const avgDebitData = await pool.request()
      .input("groupId", groupId)
      .input("year", year)
      .input("month", month)
      .query(`
        SELECT 
          AVG(CASE WHEN ExpenseTypeId = 2 AND ISNUMERIC(Expenses) = 1 
                   THEN CAST(Expenses AS FLOAT) ELSE NULL END) AS avg_amount,
          COUNT(CASE WHEN ExpenseTypeId = 2 AND ISNUMERIC(Expenses) = 1 
                     THEN 1 ELSE NULL END) AS transaction_count
        FROM tbl_Expenses
        WHERE GroupId = @groupId
          AND YEAR(Date) = @year
          AND MONTH(Date) = @month
          AND IsDeleted = 0
      `);
    const avgDebit = avgDebitData.recordset[0] || { avg_amount: 0, transaction_count: 0 };

    // ---------- 3. Average Credit ----------
    const avgCreditData = await pool.request()
      .input("groupId", groupId)
      .input("year", year)
      .input("month", month)
      .query(`
        SELECT 
          AVG(CASE WHEN ExpenseTypeId = 1 AND ISNUMERIC(Expenses) = 1 
                   THEN CAST(Expenses AS FLOAT) ELSE NULL END) AS avg_amount,
          COUNT(CASE WHEN ExpenseTypeId = 1 AND ISNUMERIC(Expenses) = 1 
                     THEN 1 ELSE NULL END) AS transaction_count
        FROM tbl_Expenses
        WHERE GroupId = @groupId
          AND YEAR(Date) = @year
          AND MONTH(Date) = @month
          AND IsDeleted = 0
      `);
    const avgCredit = avgCreditData.recordset[0] || { avg_amount: 0, transaction_count: 0 };

    // ---------- 4. This Month’s Trend ----------
    const prevMonth = parseInt(month) - 1;
    let prevMonthTotal = 0;
    if (prevMonth > 0) {
      const prevData = await pool.request()
        .input("groupId", groupId)
        .input("year", year)
        .input("month", prevMonth)
        .query(`
          SELECT SUM(CASE WHEN ExpenseTypeId = 2 AND ISNUMERIC(Expenses) = 1 
                          THEN CAST(Expenses AS FLOAT) ELSE 0 END) AS total
          FROM tbl_Expenses
          WHERE GroupId = @groupId
            AND YEAR(Date) = @year
            AND MONTH(Date) = @month
            AND IsDeleted = 0
        `);
      prevMonthTotal = prevData.recordset[0]?.total || 0;
    }
    const currentData = await pool.request()
      .input("groupId", groupId)
      .input("year", year)
      .input("month", month)
      .query(`
        SELECT SUM(CASE WHEN ExpenseTypeId = 2 AND ISNUMERIC(Expenses) = 1 
                        THEN CAST(Expenses AS FLOAT) ELSE 0 END) AS total
        FROM tbl_Expenses
        WHERE GroupId = @groupId
          AND YEAR(Date) = @year
          AND MONTH(Date) = @month
          AND IsDeleted = 0
      `);
    const currentTotal = currentData.recordset[0]?.total || 0;
    const trendChange = prevMonthTotal > 0
      ? ((currentTotal - prevMonthTotal) / prevMonthTotal) * 100
      : (currentTotal > 0 ? 100 : 0);

    // ---------- 5. Top Spending Category ----------
    const categoryData = await pool.request()
      .input("groupId", groupId)
      .input("year", year)
      .input("month", month)
      .query(`
        SELECT 
          COALESCE(ExpenseDescType, 'Unknown') AS category,
          SUM(CASE WHEN ExpenseTypeId = 2 AND ISNUMERIC(Expenses) = 1 
                   THEN CAST(Expenses AS FLOAT) ELSE 0 END) AS total
        FROM tbl_Expenses
        WHERE GroupId = @groupId
          AND YEAR(Date) = @year
          AND MONTH(Date) = @month
          AND IsDeleted = 0
        GROUP BY ExpenseDescType
      `);
    const totalMonthExpense = categoryData.recordset.reduce((sum, row) => sum + (row.total || 0), 0);
    const topCategory = categoryData.recordset.reduce(
      (max, row) => row.total > (max.total || 0)
        ? { category: row.category, percentage: totalMonthExpense > 0 ? (row.total / totalMonthExpense) * 100 : 0 }
        : max,
      { category: "N/A", percentage: 0 }
    );

    // ---------- 6. Income vs Expense ----------
    const summaryData = await pool.request()
      .input("groupId", groupId)
      .input("year", year)
      .input("month", month)
      .query(`
        SELECT 
          SUM(CASE WHEN ExpenseTypeId = 1 AND ISNUMERIC(Expenses) = 1 
                   THEN CAST(Expenses AS FLOAT) ELSE 0 END) AS credit,
          SUM(CASE WHEN ExpenseTypeId = 2 AND ISNUMERIC(Expenses) = 1 
                   THEN CAST(Expenses AS FLOAT) ELSE 0 END) AS debit
        FROM tbl_Expenses
        WHERE GroupId = @groupId
          AND YEAR(Date) = @year
          AND MONTH(Date) = @month
          AND IsDeleted = 0
      `);
    const { credit = 0, debit = 0 } = summaryData.recordset[0] || {};
    const ratio = debit > 0 ? `${(credit / debit).toFixed(1)} : 1` : "N/A";

    // Final Response
    return NextResponse.json({
      highestDebitMonth,
      lowestDebitMonth,
      avgDebit: { amount: Math.round(avgDebit.avg_amount || 0), transactionCount: avgDebit.transaction_count || 0 },
      highestCreditMonth,
      lowestCreditMonth,
      avgCredit: { amount: Math.round(avgCredit.avg_amount || 0), transactionCount: avgCredit.transaction_count || 0 },
      thisMonthTrend: { trend: trendChange < 0 ? "Downward" : "Upward", percentageChange: Math.abs(trendChange.toFixed(1)) },
      topSpendingCategory: { category: topCategory.category, percentage: parseFloat(topCategory.percentage.toFixed(1)) },
      incomeVsExpense: { ratio, percentageHigher: debit > 0 ? ((credit - debit) / debit) * 100 : 0 }
    },  { status: 200, headers: corsHeaders });

  } catch (err) {
    console.error("Error in financial insights:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: corsHeaders });
  }
}