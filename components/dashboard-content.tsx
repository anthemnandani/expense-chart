"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ComprehensiveDashboard from "@/components/comprehensive-dashboard"

// Static data based on your API responses
const yearlyData = [
  { month: "1", totalDebit: 3803, totalCredit: 6200 },
  { month: "2", totalDebit: 3523, totalCredit: 2000 },
  { month: "3", totalDebit: 4216, totalCredit: 5000 },
  { month: "4", totalDebit: 3900, totalCredit: 4000 },
  { month: "5", totalDebit: 9048, totalCredit: 9000 },
  { month: "6", totalDebit: 5215, totalCredit: 4500 },
  { month: "7", totalDebit: 3480, totalCredit: 3000 },
  { month: "8", totalDebit: 0, totalCredit: 0 },
  { month: "9", totalDebit: 0, totalCredit: 0 },
  { month: "10", totalDebit: 0, totalCredit: 0 },
  { month: "11", totalDebit: 0, totalCredit: 0 },
  { month: "12", totalDebit: 0, totalCredit: 0 },
]

const categoryData = [
  { expenseDescType: "Tea", totalExpenses: 3100 },
  { expenseDescType: "Water", totalExpenses: 520 },
  { expenseDescType: "Party", totalExpenses: 296 },
  { expenseDescType: "Other", totalExpenses: 300 },
]

export default function DashboardContent() {
  const [selectedYear, setSelectedYear] = useState("2025")
  const [selectedMonth, setSelectedMonth] = useState("July")

  const years = ["2023", "2024", "2025", "2026"]
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
            Financial Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Complete overview of your financial data</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[120px] bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Comprehensive Dashboard */}
      <ComprehensiveDashboard yearlyData={yearlyData} categoryData={categoryData} />
    </div>
  )
}
