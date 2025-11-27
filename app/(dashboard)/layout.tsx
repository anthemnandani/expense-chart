"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { useAuth } from "@/context/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, checkAuth } = useAuth();
  const router = useRouter();

  // Check auth on layout mount
  // useEffect(() => {
  //   checkAuth();
  // }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signin");
    }
  }, [loading, user, router]);

  // Show simple loader while auth is loading or redirecting
  if (loading || (!user && !loading)) {
    return (
      < >
        <Spinner />
      </>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}