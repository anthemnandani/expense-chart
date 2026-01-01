"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Users } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { apiService } from "@/lib/apiService";

export default function MainDashboard() {
  const { user } = useAuth();
  const groupId = user?.groupId;

  const [employeeStats, setEmployeeStats] = useState<any>(null);
  const [expenseStats, setExpenseStats] = useState<any>(null);

  /* ---------------- FETCH EMPLOYEE STATS ---------------- */
  useEffect(() => {
    if (!user?.token) return;

    apiService.getEmployeeStats(user.token).then((res) => {
      setEmployeeStats(res);
    });
  }, [user?.token]);

  /* ---------------- FETCH EXPENSE STATS ---------------- */
  useEffect(() => {
    if (!groupId) return;

    const year = new Date().getFullYear();

    fetch(`/api/stats?groupId=${groupId}&year=${year}`)
      .then((res) => res.json())
      .then((data) => {
        setExpenseStats(data);
      })
      .catch(() => {
        setExpenseStats(null);
      });
  }, [groupId]);

  /* ---------------- MEMOIZED EXPENSE VALUES ---------------- */
  const expenseValues = useMemo(() => {
    return {
      debit: expenseStats?.curr?.totalDebit ?? 0,
      credit: expenseStats?.curr?.totalCredit ?? 0,
      net: Number(expenseStats?.netBalance ?? 0),
    };
  }, [expenseStats]);

  /* ---------------- MEMOIZED EMPLOYEE VALUES ---------------- */
  const employeeValues = useMemo(() => {
    return {
      checkedIn: employeeStats?.checkedInToday ?? 0,
      total: employeeStats?.activeEmployees ?? 0,
      late: employeeStats?.lateToday ?? 0,
      onLeave: employeeStats?.onLeaveToday ?? 0,
    };
  }, [employeeStats]);

  return (
    <div className="min-h-screen px-6 py-10 space-y-10 animate-fade-in">
      {/* ---------------- HEADER ---------------- */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Dashboard Overview
      </h1>

      {/* ---------------- DASHBOARD CARDS ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ================= EXPENSES ================= */}
        <Link href="/expenses/dashboard">
          <Card className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
            <div className="relative w-full h-80">
              <Image
                src="/images/ExpensesManagement.jpg"
                alt="Expenses"
                fill
                className="object-cover"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/100 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2">
                <CreditCard className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Expenses</h2>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
                <div>
                  <p className="opacity-80">Total Debit</p>
                  <p className="font-semibold">
                    ₹{expenseValues.debit.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="opacity-80">Total Credit</p>
                  <p className="font-semibold">
                    ₹{expenseValues.credit.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="opacity-80">Balance</p>
                  <p
                    className={`font-semibold ${
                      expenseValues.net >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    ₹{expenseValues.net.toLocaleString()}
                  </p>
                </div>
              </div>

              <Button className="mt-4 bg-white text-black hover:bg-gray-200">
                Explore
              </Button>
            </div>
          </Card>
        </Link>

        {/* ================= EMPLOYEES ================= */}
        <Link href="/employees/dashboard">
          <Card className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
            <div className="relative w-full h-80">
              <Image
                src="/images/EmployeesManagement.jpg"
                alt="Employees"
                fill
                className="object-cover"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/100 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Employees</h2>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
                <div>
                  <p className="opacity-80">Checked-in</p>
                  <p className="font-semibold">
                    {employeeValues.checkedIn}/{employeeValues.total}
                  </p>
                </div>

                <div>
                  <p className="opacity-80">Late</p>
                  <p className="font-semibold text-yellow-400">
                    {employeeValues.late}
                  </p>
                </div>

                <div>
                  <p className="opacity-80">On Leave</p>
                  <p className="font-semibold">
                    {employeeValues.onLeave}
                  </p>
                </div>
              </div>

              <Button className="mt-4 bg-white text-black hover:bg-gray-200">
                Explore
              </Button>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}