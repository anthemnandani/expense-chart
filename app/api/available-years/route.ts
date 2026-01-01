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

        // 1️⃣ Get minimum year from DB
        const result = await pool.request()
            .input("groupId", groupId)
            .query(`
                SELECT MIN(YEAR(Date)) AS startYear
                FROM tbl_Expenses
                WHERE GroupId = @groupId
            `);

        const startYear = result.recordset[0]?.startYear;
        const currentYear = new Date().getFullYear();

        if (!startYear) {
            // No data at all
            return NextResponse.json(
                { years: [currentYear] },
                { status: 200, headers: corsHeaders }
            );
        }

        // 2️⃣ Generate full year range
        const years = [];
        for (let year = startYear; year <= currentYear; year++) {
            years.push(year);
        }

        return NextResponse.json(
            { years },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error("Error fetching available years from DB:", error);
        return NextResponse.json(
            { error: "Failed to fetch available years" },
            { status: 500, headers: corsHeaders }
        );
    }
}