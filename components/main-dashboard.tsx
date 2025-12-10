"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Users } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const allowedEmployeeEmails = [
  "nandani@antheminfotech.com",
  "info@antheminfotech.com",
];


export default function MainDashboard() {
  const { user } = useAuth();

  const canAccessEmployees = allowedEmployeeEmails.includes(user?.email);

  return (
    <div className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Expenses Card */}
        <Link href="/expenses/dashboard">
          <Card className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group">
            <div className="relative w-full h-72">
              <Image
                src="/images/ExpensesManagement.jpg"
                alt="Expenses"
                fill
                className="object-cover transition-transform group-hover:scale-105 duration-300"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            <div className="absolute bottom-4 left-4 text-white">
              <div className="flex items-center gap-2">
                <CreditCard className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Expenses</h2>
              </div>
              <p className="text-sm text-gray-200 mt-1">
                Track expenses & expense types
              </p>
              <Button className="mt-3 bg-white text-black hover:bg-gray-200">
                Explore
              </Button>
            </div>
          </Card>
        </Link>

        {/* Employees Card → Only Show If Allowed */}
        {canAccessEmployees && (
          <Link href="/employees/dashboard">
            <Card className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group">
              <div className="relative w-full h-72">
                <Image
                  src="/images/EmployeesManagement.jpg"
                  alt="Employees"
                  fill
                  className="object-cover transition-transform group-hover:scale-105 duration-300"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  <h2 className="text-xl font-semibold">Employees</h2>
                </div>
                <p className="text-sm text-gray-200 mt-1">
                  Manage employees, roles & departments
                </p>
                <Button className="mt-3 bg-white text-black hover:bg-gray-200">
                  Explore
                </Button>
              </div>
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}
