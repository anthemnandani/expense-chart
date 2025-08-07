import { type NextRequest, NextResponse } from "next/server";
import { sql, config } from "@/lib/db";
import { cookies } from "next/headers";

// GET - Fetch user expenses based on email
export async function GET(request: NextRequest) {
  const pool = await sql.connect(config);
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get("user_email")?.value?.trim();
    console.log("Fetching expenses for email:", email);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Get userId from tblUsers using schema-qualified name
    const userResult = await pool.query`
      SELECT UserId FROM [dbo].[tblUsers] WHERE EmailId = ${email}
    `;
    const user = userResult.recordset?.[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch expenses using userId
    const expensesResult = await pool.query`
      SELECT 
        ExpenseId, Expenses, Description, ExpenseTypeId, Date, 
        Balance, UserId, ExpenseDescType, GroupId, IsDeleted, CreatedOn
      FROM [dbo].[tbl_Expenses]
      WHERE UserId = ${user.UserId} AND IsDeleted = 0
      ORDER BY Date DESC, CreatedOn DESC
    `;

    return NextResponse.json(expensesResult.recordset);
  } catch (error: any) {
    console.error("❌ Fetch expenses error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
