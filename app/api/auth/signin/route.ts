export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { sql, config } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const COOKIE_NAME = "access_token";

function decodeBase64(str: string) {
  return Buffer.from(str, "base64").toString("utf-8");
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email/Username and password required" }, { status: 400 });
    }

    const pool = await sql.connect(config);
    const result = await pool.request()
  .input("identifier", email)
  .query(`
    SELECT 
      userId, userName, emailId, fullName, currency, 
      profileImage, contactNumber, groupId, chkExpense, lastLogin,
      isDeleted, isVerified, password
    FROM tblUsers 
    WHERE (emailId = @identifier OR userName = @identifier) AND IsDeleted = 0
  `);

    const user = result.recordset[0];

    if (!user) {
      return NextResponse.json({ error: "User not found", shouldRegister: true }, { status: 404 });
    }

    const decodedPassword = decodeBase64(user.password);
    if (password !== decodedPassword) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    const token = jwt.sign({ email: user.emailId }, JWT_SECRET, { expiresIn: "7d" });

    const userData = {
      userId: user.userId,
      userName: user.userName,
      emailId: user.emailId,
      fullName: user.fullName,
      currency: user.currency || "INR",
      profileImage: user.profileImage,
      contactNumber: user.contactNumber,
      groupId: user.groupId,
      chkExpense: user.chkExpense,
      lastLogin: user.lastLogin,
    };

    const response = NextResponse.json({
      user: userData,
      token,
      message: "Sign in successful",
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 2 * 60 * 60,
      path: "/",
    });

    response.cookies.set("user_email", user.emailId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 2 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}