"use client";

import { ReactNode } from "react";
import { useAuth } from "@/context/auth-context";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

interface EmployeesLayoutProps {
  children: ReactNode;
}

const ALLOWED_EMAILS = ["info@antheminfotech.com", "nandani@antheminfotech.com"];

export default function EmployeesLayout({ children }: EmployeesLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // ⏳ Auth not resolved yet
  if (loading || user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] text-gray-500">
        Checking access...
      </div>
    );
  }

  // ❌ Auth resolved, but no user
  if (user === null) {
    router.replace("/signin");
    return null;
  }

  // ✅ Access check
  const hasAccess = ALLOWED_EMAILS.includes(user.email);

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
        <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md">
          <Lock className="w-16 h-16 text-red-500 animate-pulse mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You do not have permission to view this section.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
