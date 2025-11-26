export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from "next/server";
import { sql, config } from "@/lib/db";
import { corsHeaders } from "@/lib/cors"; // <-- ADD THIS

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

    return new NextResponse(JSON.stringify(result.recordset), {
      status: 200,
      headers: corsHeaders, // <-- CORS ENABLE
    });
  } catch (error: any) {
    console.error("❌ Fetch expense types error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: corsHeaders, // <-- ERROR me bhi CORS zaroori
      }
    );
  }
}

// ✅ IMPORTANT: CORS preflight (OPTIONS)
export function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}