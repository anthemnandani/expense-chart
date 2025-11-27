import { NextRequest, NextResponse } from "next/server";
import { sql, config } from "@/lib/db";
import { corsHeaders } from "@/lib/cors";
import { sendEmail } from "@/lib/sendEmail";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
    return new Response(null, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            userId,
            expenseDescType,
            description,
            expenses,
            expenseTypeId,
            date,
            groupId
        } = body;

        if (!userId || !description || !expenses || !expenseTypeId || !date) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400, headers: corsHeaders }
            );
        }

        const pool = await sql.connect(config);

        // 1️⃣ INSERT EXPENSE FIRST (same as .NET)
        const insertResult = await pool.request()
            .input("Description", description)
            .input("Expenses", expenses)
            .input("ExpenseTypeId", expenseTypeId)
            .input("Date", new Date(date))
            .input("UserId", userId)
            .input("ExpenseDescType", expenseDescType || null)
            .input("GroupId", groupId || null)
            .query(`
        INSERT INTO tbl_Expenses
        (Description, Expenses, ExpenseTypeId, Date, UserId, ExpenseDescType, GroupId, CreatedOn, IsDeleted)
        VALUES
        (@Description, @Expenses, @ExpenseTypeId, @Date, @UserId, @ExpenseDescType, @GroupId, GETDATE(), 0);

        SELECT SCOPE_IDENTITY() AS ExpenseId;
      `);

        const newExpenseId = insertResult.recordset[0].ExpenseId;

        // 2️⃣ FETCH USER EMAIL (same as .NET GetEmailAddress)
        const userResult = await pool.request()
            .input("UserId", userId)
            .query(`
        SELECT EmailId, CCEmailAddress, Currency, FullName
        FROM tblUsers
        WHERE UserId = @UserId
      `);

        if (userResult.recordset.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404, headers: corsHeaders }
            );
        }

        const email = userResult.recordset[0].EmailId;
        const cc = userResult.recordset[0].CCEmailAddress;
        const currency = userResult.recordset[0].Currency ?? "INR";
        const fullname = userResult.recordset[0].FullName || "User";
        const UserKey = userId;

        if (!email) {
            return NextResponse.json(
                { error: "Email not found for the user" },
                { status: 400, headers: corsHeaders }
            );
        }

        // 3️⃣ Fetch ALL expenses for calculating balance
        const allExpenses = await pool.request()
            .input("UserId", userId)
            .query(`
        SELECT
          CASE WHEN ExpenseTypeId = 1 THEN Expenses ELSE 0 END AS TotalCreated,
          CASE WHEN ExpenseTypeId != 1 THEN Expenses ELSE 0 END AS TotalDebited
        FROM tbl_Expenses
        WHERE UserId = @UserId AND IsDeleted = 0
      `);

        let totalCreated = 0;
        let totalDebited = 0;

        allExpenses.recordset.forEach((exp: any) => {
            totalCreated += Number(exp.TotalCreated);
            totalDebited += Number(exp.TotalDebited);
        });

        const AvailableBalance = totalCreated - totalDebited;

        // 4️⃣ Update balance in inserted row
        await pool.request()
            .input("Balance", AvailableBalance)
            .input("ExpenseId", newExpenseId)
            .query(`
        UPDATE tbl_Expenses
        SET Balance = @Balance
        WHERE ExpenseId = @ExpenseId;
      `);

        const descText = expenseTypeId == 1 ? "Credited" : "Debited";
        const formattedDate = new Date(date).toLocaleDateString("en-GB");
        const color = AvailableBalance < 0 ? "red" : "green";
        const btnColor = expenseTypeId == 1 ? "#4CAF50" : "#e53935";
const htmlBody = `
  <div style="
    background:#f2f2f2;
    padding: 15px;
  ">
    <div style="
      margin: auto;
      background: #ffffff;
      padding: 20px 22px;
      border-radius: 6px;
      box-shadow: 0 1px 5px rgba(0,0,0,0.06);
      max-width: 600px;
    ">

      <h3 style="
        margin: 0 0 8px;
        color: #333;
        font-size: 17px;
        font-weight: 600;
      ">
        Hi <b>${fullname}</b>,
      </h3>

      <p style="font-size: 13px; color: #555; margin-top: 6px;">
        A new transaction has been recorded on the <b>Expense Tracker</b> portal.
      </p>

      <div style="
        background: #fafafa;
        padding: 12px 15px;
        border-left: 3px solid ${btnColor};
        margin: 14px 0;
        border-radius: 4px;
      ">
        <h4 style="margin: 0 0 8px; font-size: 14px; color:#333;">Transaction Details</h4>

        <p style="margin: 0; line-height: 1.6; font-size:13px; color:#555;">
          <b>Amount ${descText}:</b> ${currency} ${expenses}<br/>
          <b>Description:</b> ${description}<br/>
          <b>Type:</b> ${descText}<br/>
          <b>Date:</b> ${formattedDate}<br/>
          <b>Updated Balance:</b>
          ${currency}
          <span style="color:${color}; font-weight:600;">
            ${AvailableBalance}
          </span>
        </p>
      </div>

      <p style="font-size: 13px; color:#555;">
        View your complete expense report below:
      </p>

      <a href="https://essentials.workanthem.com/userExpenses?UserKey=${UserKey}"
        style="
          display:inline-block;
          padding: 10px 16px;
          background:${btnColor};
          color:white;
          border-radius:5px;
          font-size:13px;
          text-decoration:none;
          font-weight:500;
        ">
        View Expense Report
      </a>

      <p style="margin-top: 20px; font-size: 12px; color:#666;">
        Regards,<br/>
        <b>Expense Tracker Team</b>
      </p>

    </div>
  </div>
`;

        // 6️⃣ SEND EMAIL TO MULTIPLE USERS (comma separated)
        const emailArray = email.split(",").map((x: string) => x.trim());

        let emailSuccess = false;

        for (const mail of emailArray) {
            if (mail) {
                emailSuccess = await sendEmail(
                    mail,
                    `A new expense of ${currency} ${expenses} was made.`,
                    htmlBody
                );
            }
        }

        if (!emailSuccess) {
            return NextResponse.json(
                { error: "Failed to send email" },
                { status: 500, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Expense added and email sent successfully",
                ExpenseId: newExpenseId,
                Balance: AvailableBalance,
                Email: email,
            },
            { status: 201, headers: corsHeaders }
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500, headers: corsHeaders }
        );
    }
}
