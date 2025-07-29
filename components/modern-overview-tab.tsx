"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { TrendingUp, TrendingDown, PieChartIcon, Target, Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ModernOverviewTabProps {
  yearlyData: Array<{
    month: string
    totalDebit: number
    totalCredit: number
  }>
  categoryData: Array<{
    expenseDescType: string
    totalExpenses: number
  }>
}

export default function ModernOverviewTab({ yearlyData, categoryData }: ModernOverviewTabProps) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const chartData = yearlyData.map((item) => ({
    month: monthNames[Number.parseInt(item.month) - 1],
    income: item.totalCredit,
    expenses: item.totalDebit,
    net: item.totalCredit - item.totalDebit,
  }))

  // Calculate metrics
  const totalIncome = yearlyData.reduce((sum, item) => sum + item.totalCredit, 0)
  const totalExpenses = yearlyData.reduce((sum, item) => sum + item.totalDebit, 0)
  const netSavings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
  const activeMonths = yearlyData.filter((item) => item.totalCredit > 0 || item.totalDebit > 0).length
  const avgMonthlyExpense = totalExpenses / activeMonths || 0

  // Performance by category (like team performance in reference)
  const categoryPerformance = categoryData
    .map((cat) => ({
      name: cat.expenseDescType,
      percentage: (cat.totalExpenses / totalExpenses) * 100,
      amount: cat.totalExpenses,
    }))
    .sort((a, b) => b.percentage - a.percentage)

  return (
    <div className="space-y-6">
      {/* Top Metrics Row - Circular Progress Style */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total Income */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl p-4">
          <div className="flex items-center justify-center">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="75, 100"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="text-center mt-2">
            <div className="text-lg font-bold text-gray-900 dark:text-white">₹{(totalIncome / 1000).toFixed(0)}K</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Income</div>
          </div>
        </Card>

        {/* Total Expenses */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl p-4">
          <div className="flex items-center justify-center">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="60, 100"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="text-center mt-2">
            <div className="text-lg font-bold text-gray-900 dark:text-white">₹{(totalExpenses / 1000).toFixed(0)}K</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Expenses</div>
          </div>
        </Card>

        {/* Categories */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl p-4">
          <div className="flex items-center justify-center">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="25, 100"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <PieChartIcon className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="text-center mt-2">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{categoryData.length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Categories</div>
          </div>
        </Card>

        {/* Active Months */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl p-4">
          <div className="flex items-center justify-center">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeDasharray={`${(activeMonths / 12) * 100}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
          </div>
          <div className="text-center mt-2">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{activeMonths}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Active Months</div>
          </div>
        </Card>

        {/* Savings Rate */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl p-4">
          <div className="flex items-center justify-center">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  strokeDasharray={`${savingsRate}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="text-center mt-2">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{savingsRate.toFixed(0)}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Savings Rate</div>
          </div>
        </Card>
      </div>

      {/* Second Row - Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Trends - Takes 2 columns */}
        <Card className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Financial Trends</CardTitle>
              <CardDescription className="text-sm text-gray-500">
                2025 • Income: ₹{(totalIncome / 1000).toFixed(0)}K • Expenses: ₹{(totalExpenses / 1000).toFixed(0)}K •
                Others: ₹{((totalIncome - totalExpenses) / 1000).toFixed(0)}K
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <select className="text-sm border rounded-lg px-3 py-1 bg-white dark:bg-gray-700">
                <option>Years</option>
                <option>2025</option>
                <option>2024</option>
              </select>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ChartContainer
                config={{
                  income: { label: "Income", color: "#10b981" },
                  expenses: { label: "Expenses", color: "#ef4444" },
                  net: { label: "Net", color: "#8b5cf6" },
                }}
                className="h-full w-full"
              >
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="net"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Savings Goal Progress */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Savings Goal</CardTitle>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="3"
                  strokeDasharray={`${savingsRate}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Target className="h-8 w-8 text-orange-500 mb-1" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{savingsRate.toFixed(0)}%</div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">0%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">100%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Row - Performance & Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Performance */}
        <Card className="lg:col-span-1 bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Category Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryPerformance.map((category, index) => (
              <div key={category.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category.name}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {category.percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor:
                        index === 0 ? "#ef4444" : index === 1 ? "#06b6d4" : index === 2 ? "#8b5cf6" : "#10b981",
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Monthly Expenses Trend */}
        <Card className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Expenses</CardTitle>
              <select className="text-sm border rounded-lg px-2 py-1 mt-1 bg-white dark:bg-gray-700">
                <option>2025</option>
                <option>2024</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ChartContainer
                config={{
                  expenses: { label: "Expenses", color: "#ef4444" },
                  income: { label: "Income", color: "#10b981" },
                }}
                className="h-full w-full"
              >
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Line
                    type="monotone"
                    dataKey="net"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 3 }}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Distribution */}
        <Card className="lg:col-span-1 bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">2025</CardTitle>
              <div className="text-xs text-gray-500 mt-1">
                <div>Tea: ₹{categoryData.find((c) => c.expenseDescType === "Tea")?.totalExpenses || 0}</div>
                <div>Water: ₹{categoryData.find((c) => c.expenseDescType === "Water")?.totalExpenses || 0}</div>
              </div>
            </div>
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="3"
                  strokeDasharray="58, 100"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-xs font-bold text-gray-900 dark:text-white">58%</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Sort by</span>
              <select className="text-sm border rounded px-2 py-1 bg-white dark:bg-gray-700">
                <option>Years</option>
              </select>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
