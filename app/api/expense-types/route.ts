import { type NextRequest, NextResponse } from "next/server";
import { sql, config } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const pool = await sql.connect(config);

    const result = await pool.query`
      SELECT 
        ExpenseTypeId, 
        [Type], 
        IsDeleted, 
        CreatedOn
      FROM [dbo].[tbl_Expensetype]
      WHERE IsDeleted = 0
      ORDER BY ExpenseTypeId ASC
    `;

    return NextResponse.json(result.recordset);
  } catch (error: any) {
    console.error("❌ Fetch expense types error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}