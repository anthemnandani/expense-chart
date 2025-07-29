"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CreditCard, PieChart, Calendar, BarChart3, Activity } from "lucide-react"
import ModernOverviewTab from "@/components/modern-overview-tab"
import MonthlyTab from "@/components/monthly-tab"
import CategoriesTab from "@/components/categories-tab"
import WeeklyTab from "@/components/weekly-tab"
import DailyTab from "@/components/daily-tab"

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
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
            Financial Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your expenses with beautiful insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 px-3 py-1"
          >
            2025
          </Badge>
          <Badge
            variant="outline"
            className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800 px-3 py-1"
          >
            July
          </Badge>
        </div>
      </div>

      {/* Modern Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-0 h-12 p-1 rounded-xl">
          <TabsTrigger
            value="overview"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 text-sm"
          >
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="monthly"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 text-sm"
          >
            <Calendar className="h-4 w-4" />
            Monthly
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 text-sm"
          >
            <PieChart className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger
            value="weekly"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 text-sm"
          >
            <Activity className="h-4 w-4" />
            Weekly
          </TabsTrigger>
          <TabsTrigger
            value="daily"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 text-sm"
          >
            <CreditCard className="h-4 w-4" />
            Daily
          </TabsTrigger>
        </TabsList>

        <div className="min-h-[600px]">
          <TabsContent value="overview" className="space-y-6 mt-0">
            <ModernOverviewTab yearlyData={yearlyData} categoryData={categoryData} />
          </TabsContent>

          <TabsContent value="monthly" className="space-y-6 mt-0">
            <MonthlyTab yearlyData={yearlyData} />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6 mt-0">
            <CategoriesTab categoryData={categoryData} />
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6 mt-0">
            <WeeklyTab />
          </TabsContent>

          <TabsContent value="daily" className="space-y-6 mt-0">
            <DailyTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
