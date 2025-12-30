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
          Description,
          ExpenseTypeId,
          [Date],
          Balance
        FROM tbl_Expenses
        WHERE 
          GroupId = @groupId
          AND YEAR([Date]) = @year
          AND IsDeleted = 0
        ORDER BY [Date] ASC
      `);

    const data = result.recordset.map((exp: any) => {
      const expDate = new Date(exp.Date);

      return {
        x: expDate.getTime(),                 // ✅ exact transaction time
        y: Number(exp.Balance) || 0,           // ✅ DB balance
        transaction: {
          type: Number(exp.ExpenseTypeId) === 1 ? "credit" : "debit",
          amount: Number(exp.Expenses) || 0,
          description: exp.Description || "",
          date: expDate.toISOString(),
        },
      };
    });

    return NextResponse.json(data, {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error("Error fetching net balance:", error);
    return NextResponse.json(
      { error: "Failed to fetch net balance" },
      { status: 500, headers: corsHeaders }
    );
  }
}
