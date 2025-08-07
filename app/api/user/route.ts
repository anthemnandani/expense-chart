import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { sql, config } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get("user_email")?.value?.trim();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!email) {
      return NextResponse.json({ error: "Email cookie is required" }, { status: 400 });
    }

    const pool = await sql.connect(config);

    const userResult = await pool.query`
      SELECT TOP 1
        [UserId], [UserName], [Password], [EmailId], [UserTypeId], [LastLogin],
        [IsDeleted], [CreatedOn], [ExpensereportEmail], [Currency], [FullName],
        [IsVerified], [VerificationToken], [ContactNumber], [ProfileImage], [GroupId],
        [CCEmailAddress], [ChkDashboard], [ChkDocuments], [ChkExpense], [ChkNotes],
        [ChkQuantityTracker], [ChkMarketing], [ChkLocations]
      FROM [dbo].[tblUsers]
      WHERE LOWER([EmailId]) = ${email.toLowerCase()}
    `;

    const dbUser = userResult.recordset?.[0];
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Build full user object
    const user = {
      userId: dbUser.UserId,
      userName: dbUser.UserName,
      email: dbUser.EmailId,
      fullName: dbUser.FullName,
      userTypeId: dbUser.UserTypeId,
      lastLogin: dbUser.LastLogin,
      isDeleted: dbUser.IsDeleted,
      createdOn: dbUser.CreatedOn,
      expenseReportEmail: dbUser.ExpensereportEmail,
      currency: dbUser.Currency,
      isVerified: dbUser.IsVerified,
      verificationToken: dbUser.VerificationToken,
      contactNumber: dbUser.ContactNumber,
      profileImage: dbUser.ProfileImage,
      groupId: dbUser.GroupId,
      ccEmailAddress: dbUser.CCEmailAddress,
      chkDashboard: dbUser.ChkDashboard,
      chkDocuments: dbUser.ChkDocuments,
      chkExpense: dbUser.ChkExpense,
      chkNotes: dbUser.ChkNotes,
      chkQuantityTracker: dbUser.ChkQuantityTracker,
      chkMarketing: dbUser.ChkMarketing,
      chkLocations: dbUser.ChkLocations,
    };

    // Optionally enhance with access token data
    if (accessToken && accessToken.startsWith("ey")) {
      try {
        const decoded = jwt.decode(accessToken) as any;
        if (decoded) {
          if (decoded.name) user.fullName = decoded.name;
          if (decoded.picture) user.profileImage = decoded.picture;
          if (decoded.email) user.email = decoded.email;
        }
      } catch (err) {
        console.warn("JWT decode failed", err);
      }
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}
