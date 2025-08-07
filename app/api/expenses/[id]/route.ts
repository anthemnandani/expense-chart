import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@vercel/postgres"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// DELETE - Delete expense
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    const userId = decoded.userId
    const expenseId = params.id

    // Soft delete - set IsDeleted = 1
    const result = await sql`
      UPDATE tbl_Expenses 
      SET IsDeleted = 1 
      WHERE ExpenseId = ${expenseId} 
      AND UserId = ${userId}
      AND IsDeleted = 0
    `

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Expense not found or already deleted" }, { status: 404 })
    }

    return NextResponse.json({ message: "Expense deleted successfully" })
  } catch (error) {
    console.error("Delete expense error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
