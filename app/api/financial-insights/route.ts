import { NextRequest, NextResponse } from "next/server";
import { sql, config } from "@/lib/db";

// Hardcoded months array
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  // Validate query parameters
  if (!groupId || !year || !month) {
    return NextResponse.json(
      { error: "Missing required query params: groupId, year, or month" },
      { status: 400 }
    );
  }
  if (isNaN(parseInt(year)) || isNaN(parseInt(month)) || parseInt(month) < 1 || parseInt(month) > 12) {
    return NextResponse.json({ error: "Invalid year or month" }, { status: 400 });
  }

  // Normalize month
  const normalizedMonth = parseInt(month).toString();

  try {
    // Initialize the SQL connection
    const pool = await sql.connect(config);

    // Helper to convert month number to name
    const monthName = (monthNum: string) => months[parseInt(monthNum) - 1] || "Unknown";

    // 1. Best Performing Month (Highest Savings Rate)
    const yearlyData = await pool
      .request()
      .input("groupId", groupId)
      .input("year", year)
      .query(`
        SELECT 
          MONTH(Date) AS month,
          SUM(CASE WHEN ExpenseTypeId = 1 AND ISNUMERIC(Expenses) = 1 THEN CAST(Expenses AS FLOAT) ELSE 0 END) AS totalCredit,
          SUM(CASE WHEN ExpenseTypeId = 2 AND ISNUMERIC(Expenses) = 1 THEN CAST(Expenses AS FLOAT) ELSE 0 END) AS totalDebit
        FROM tbl_Expenses
        WHERE GroupId = @groupId
          AND YEAR(Date) = @year
          AND IsDeleted = 0
        GROUP BY MONTH(Date)
      `);

    console.log("Yearly Data:", JSON.stringify(yearlyData.recordset, null, 2));

    const bestPerformingMonth = yearlyData.recordset.reduce(
      (best: any, curr: any) => {
        const savings = curr.totalCredit - curr.totalDebit;
        const savingsRate = curr.totalCredit > 0 ? (savings / curr.totalCredit) * 100 : -Infinity;
        return savingsRate > (best.savingsRate || -Infinity) && savings > 0
          ? { month: monthName(curr.month.toString()), savingsRate, amountSaved: savings }
          : best;
      },
      { month: "N/A", savingsRate: 0, amountSaved: 0 }
    );

    // 2. Lowest Income Month
    const lowestIncomeMonth = yearlyData.recordset.reduce(
      (lowest: any, curr: any) =>
        curr.totalDebit > 0 && curr.totalDebit < (lowest.debit || Infinity)
          ? { month: monthName(curr.month.toString()), debit: curr.totalDebit }
          : lowest,
      { month: "N/A", debit: Infinity }
    );

    // 3. Top Spending Category
    const expenseByCategory = await pool
      .request()
      .input("groupId", groupId)
      .input("year", year)
      .input("month", month)
      .query(`
        SELECT 
          COALESCE(e.ExpenseDescType, 'Unknown') AS expenseDescType,
          SUM(CASE WHEN ISNUMERIC(e.Expenses) = 1 THEN CAST(e.Expenses AS FLOAT) ELSE 0 END) AS totalExpenses
        FROM tbl_Expenses e
        WHERE e.GroupId = @groupId
          AND YEAR(e.Date) = @year
          AND MONTH(e.Date) = @month
          AND e.ExpenseTypeId = 2
          AND e.IsDeleted = 0
        GROUP BY e.ExpenseDescType
      `);

    console.log("Expense by Category:", JSON.stringify(expenseByCategory.recordset, null, 2));

    const totalExpenses = expenseByCategory.recordset.reduce(
      (sum: number, curr: any) => sum + (curr.totalExpenses || 0),
      0
    );
    const topSpendingCategory = expenseByCategory.recordset.reduce(
      (top: any, curr: any) =>
        curr.totalExpenses > (top.totalExpenses || 0)
          ? {
            category: curr.expenseDescType,
            percentage: totalExpenses > 0 ? (curr.totalExpenses / totalExpenses) * 100 : 0,
          }
          : top,
      { category: "N/A", percentage: 0, totalExpenses: 0 }
    );

    // 4. This Month’s Trend
    const prevMonth = parseInt(month) - 1;
    let prevMonthTotal = 0;
    if (prevMonth > 0) {
      const prevMonthData = await pool
        .request()
        .input("groupId", groupId)
        .input("year", year)
        .input("prevMonth", prevMonth)
        .query(`
          SELECT SUM(CASE WHEN ISNUMERIC(Expenses) = 1 THEN CAST(Expenses AS FLOAT) ELSE 0 END) AS totalExpenses
          FROM tbl_Expenses
          WHERE GroupId = @groupId
            AND YEAR(Date) = @year
            AND MONTH(Date) = @prevMonth
            AND ExpenseTypeId = 2
            AND IsDeleted = 0
        `);
      prevMonthTotal = prevMonthData.recordset[0]?.totalExpenses || 0;
    }
    const currentMonthData = await pool
      .request()
      .input("groupId", groupId)
      .input("year", year)
      .input("month", month)
      .query(`
        SELECT SUM(CASE WHEN ISNUMERIC(Expenses) = 1 THEN CAST(Expenses AS FLOAT) ELSE 0 END) AS totalExpenses
        FROM tbl_Expenses
        WHERE GroupId = @groupId
          AND YEAR(Date) = @year
          AND MONTH(Date) = @month
          AND ExpenseTypeId = 2
          AND IsDeleted = 0
      `);
    const currentMonthTotal = currentMonthData.recordset[0]?.totalExpenses || 0;
    const percentageChange =
      prevMonthTotal > 0
        ? ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100
        : currentMonthTotal > 0
          ? 100
          : 0;

    // 5. Average Transaction Size
    const avgTransaction = await pool
      .request()
      .input("groupId", groupId)
      .input("year", year)
      .input("month", month)
      .query(`
        SELECT 
          AVG(CASE WHEN ISNUMERIC(Expenses) = 1 THEN CAST(Expenses AS FLOAT) ELSE NULL END) AS avg_amount, 
          COUNT(CASE WHEN ISNUMERIC(Expenses) = 1 THEN 1 ELSE NULL END) AS transaction_count
        FROM tbl_Expenses
        WHERE GroupId = @groupId
          AND YEAR(Date) = @year
          AND MONTH(Date) = @month
          AND ExpenseTypeId = 2
          AND IsDeleted = 0
      `);
    const transactionData = avgTransaction.recordset[0] || { avg_amount: 0, transaction_count: 0 };

    // 6. Income vs Expense
    const monthlySummary = await pool
      .request()
      .input("groupId", groupId)
      .input("year", year)
      .input("month", month)
      .query(`
        SELECT 
          SUM(CASE WHEN ExpenseTypeId = 1 AND ISNUMERIC(Expenses) = 1 THEN CAST(Expenses AS FLOAT) ELSE 0 END) AS totalCredit,
          SUM(CASE WHEN ExpenseTypeId = 2 AND ISNUMERIC(Expenses) = 1 THEN CAST(Expenses AS FLOAT) ELSE 0 END) AS totalDebit
        FROM tbl_Expenses
        WHERE GroupId = @groupId
          AND YEAR(Date) = @year
          AND MONTH(Date) = @month
          AND IsDeleted = 0
      `);
    const { totalCredit = 0, totalDebit = 0 } = monthlySummary.recordset[0] || {};
    const incomeVsExpense = {
      ratio: totalDebit > 0 ? (totalCredit / totalDebit).toFixed(1) + " : 1" : "N/A",
      percentageHigher: totalDebit > 0 ? ((totalCredit - totalDebit) / totalDebit) * 100 : 0,
    };

    // Construct the response
    const insights = {
      bestPerformingMonth: {
        month: bestPerformingMonth.month,
        savingsRate: parseFloat(bestPerformingMonth.savingsRate.toFixed(1)) || 0,
        amountSaved: Math.round(bestPerformingMonth.amountSaved) || 0,
      },
      lowestIncomeMonth: {
        month: lowestIncomeMonth.month === "N/A" && lowestIncomeMonth.debit === Infinity ? "N/A" : lowestIncomeMonth.month,
        income: lowestIncomeMonth.debit === Infinity ? 0 : lowestIncomeMonth.debit,
      },
      topSpendingCategory: {
        category: topSpendingCategory.category,
        percentage: parseFloat(topSpendingCategory.percentage.toFixed(1)) || 0,
      },
      thisMonthTrend: {
        trend: percentageChange < 0 ? "Downward" : "Upward",
        percentageChange: Math.abs(parseFloat(percentageChange.toFixed(1))) || 0,
      },
      avgTransactionSize: {
        amount: Math.round(transactionData.avg_amount || 0),
        transactionCount: transactionData.transaction_count || 0,
      },
      incomeVsExpense: {
        ratio: incomeVsExpense.ratio,
        percentageHigher: parseFloat(incomeVsExpense.percentageHigher.toFixed(1)) || 0,
      },
    };

    console.log("Financial Insights Response:", JSON.stringify(insights, null, 2));
    return NextResponse.json(insights);
  } catch (error) {
    console.error("Error fetching financial insights:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      groupId,
      year,
      month,
    });
    return NextResponse.json(
      {
        error: "Failed to load financial insights",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}