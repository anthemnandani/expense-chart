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
    try {
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input("groupId", groupId)
            .query(`
                SELECT DISTINCT YEAR(Date) AS year
                FROM tbl_Expenses
                WHERE GroupId = @groupId
                ORDER BY year ASC
            `);

        const years = result.recordset.map(row => row.year);

        return NextResponse.json({ years }, {
            status: 200,
            headers: corsHeaders,   // ⭐ CORS added here
        });
    } catch (error) {
        console.error("Error fetching available years from DB:", error);
        return NextResponse.json(
            { error: "Failed to fetch available years" },
            { status: 500,  headers: corsHeaders, }
        );
    }
}
