"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChartIcon,
  Calendar,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Coffee,
  Droplets,
  PartyPopper,
  MoreHorizontal,
  BarChart3,
} from "lucide-react"

interface ComprehensiveDashboardProps {
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

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16"]

const categoryIcons = {
  Tea: Coffee,
  Water: Droplets,
  Party: PartyPopper,
  Other: MoreHorizontal,
}

export default function ComprehensiveDashboard({ yearlyData, categoryData }: ComprehensiveDashboardProps) {
  // Calculate totals and metrics
  const totalIncome = yearlyData.reduce((sum, item) => sum + item.totalCredit, 0)
  const totalExpenses = yearlyData.reduce((sum, item) => sum + item.totalDebit, 0)
  const netSavings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0
  const activeMonths = yearlyData.filter((item) => item.totalCredit > 0 || item.totalDebit > 0).length

  // Prepare chart data
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const chartData = yearlyData.map((item) => ({
    month: monthNames[Number.parseInt(item.month) - 1],
    shortMonth: monthNames[Number.parseInt(item.month) - 1].slice(0, 3),
    income: item.totalCredit,
    expenses: item.totalDebit,
    net: item.totalCredit - item.totalDebit,
    savingsRate: item.totalCredit > 0 ? ((item.totalCredit - item.totalDebit) / item.totalCredit) * 100 : 0,
  }))

  // Enhanced category data
  const enhancedCategoryData = categoryData
    .map((item, index) => ({
      ...item,
      percentage: (item.totalExpenses / totalExpenses) * 100,
      color: COLORS[index % COLORS.length],
      icon: categoryIcons[item.expenseDescType as keyof typeof categoryIcons] || MoreHorizontal,
    }))
    .sort((a, b) => b.totalExpenses - a.totalExpenses)

  // Weekly data (sample)
  const weeklyData = [
    { week: "W1", weekStart: "01/01", weekEnd: "07/01", totalCredit: 3000, totalDebit: 1153, net: 1847 },
    { week: "W2", weekStart: "08/01", weekEnd: "14/01", totalCredit: 0, totalDebit: 0, net: 0 },
    { week: "W3", weekStart: "15/01", weekEnd: "21/01", totalCredit: 0, totalDebit: 580, net: -580 },
    { week: "W4", weekStart: "22/01", weekEnd: "28/01", totalCredit: 2000, totalDebit: 1200, net: 800 },
    { week: "W5", weekStart: "29/01", weekEnd: "04/02", totalCredit: 1500, totalDebit: 800, net: 700 },
    { week: "W6", weekStart: "05/02", weekEnd: "11/02", totalCredit: 0, totalDebit: 900, net: -900 },
    { week: "W7", weekStart: "12/02", weekEnd: "18/02", totalCredit: 0, totalDebit: 1200, net: -1200 },
    { week: "W8", weekStart: "19/02", weekEnd: "25/02", totalCredit: 2000, totalDebit: 423, net: 1577 },
  ]

  const pieData = categoryData.map((item) => ({
    name: item.expenseDescType,
    value: item.totalExpenses,
  }))

  return (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <DollarSign className="h-5 w-5" />
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-800">₹{totalIncome.toLocaleString()}</div>
            <div className="text-sm text-emerald-600 flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3" />
              +12.5% from last period
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <TrendingDown className="h-5 w-5" />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">₹{totalExpenses.toLocaleString()}</div>
            <div className="text-sm text-red-600 flex items-center gap-1 mt-1">
              <ArrowDownRight className="h-3 w-3" />
              -8.2% from last period
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Target className="h-5 w-5" />
              Net Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netSavings >= 0 ? "text-purple-800" : "text-red-800"}`}>
              ₹{netSavings.toLocaleString()}
            </div>
            <div className="text-sm text-purple-600 mt-1">{savingsRate.toFixed(1)}% savings rate</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Calendar className="h-5 w-5" />
              Active Months
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">{activeMonths}/12</div>
            <div className="text-sm text-orange-600 mt-1">{((activeMonths / 12) * 100).toFixed(0)}% year coverage</div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview and Expense Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Financial Overview */}
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Financial Overview
            </CardTitle>
            <CardDescription>Track your income and expenses over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                income: {
                  label: "Income",
                  color: "#10b981",
                },
                expenses: {
                  label: "Expenses",
                  color: "#ef4444",
                },
              }}
              className="h-[350px]"
            >
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stackId="2"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Expense Distribution */}
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-purple-600" />
              Expense Distribution
            </CardTitle>
            <CardDescription>Visual breakdown of spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                expenses: {
                  label: "Expenses",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={enhancedCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="totalExpenses"
                  >
                    {enhancedCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-semibold">{data.expenseDescType}</p>
                            <p className="text-sm">₹{data.totalExpenses.toLocaleString()}</p>
                            <p className="text-xs text-slate-600">{data.percentage.toFixed(1)}%</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {enhancedCategoryData.map((entry, index) => (
                <div key={entry.expenseDescType} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{entry.expenseDescType}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Income vs Expenses */}
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Monthly Income vs Expenses
            </CardTitle>
            <CardDescription>Detailed monthly financial performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                income: {
                  label: "Income",
                  color: "#10b981",
                },
                expenses: {
                  label: "Expenses",
                  color: "#ef4444",
                },
              }}
              className="h-[350px]"
            >
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="shortMonth" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="income" fill="#10b981" radius={4} />
                <Bar dataKey="expenses" fill="#ef4444" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Monthly Savings Rate */}
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Monthly Savings Rate
            </CardTitle>
            <CardDescription>Percentage of income saved each month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                savingsRate: {
                  label: "Savings Rate %",
                  color: "#8b5cf6",
                },
              }}
              className="h-[350px]"
            >
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="shortMonth" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="savingsRate"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Net Balance and Weekly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Net Balance Trend */}
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-600" />
              Net Balance Trend
            </CardTitle>
            <CardDescription>Monthly profit/loss analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                net: {
                  label: "Net Balance",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[350px]"
            >
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="net" radius={4}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.net >= 0 ? "#10b981" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Weekly Net Balance Trend */}
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-600" />
              Weekly Net Balance Trend
            </CardTitle>
            <CardDescription>Track your weekly financial performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                net: {
                  label: "Net Balance",
                  color: "#10b981",
                },
              }}
              className="h-[350px]"
            >
              <AreaChart data={weeklyData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-semibold">{label}</p>
                          <p className="text-sm">
                            {data.weekStart} - {data.weekEnd}
                          </p>
                          <p className="text-sm">Net: ₹{data.net.toLocaleString()}</p>
                          <p className="text-xs text-slate-600">
                            Income: ₹{data.totalCredit.toLocaleString()} | Expenses: ₹{data.totalDebit.toLocaleString()}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area type="monotone" dataKey="net" stroke="#10b981" fill="#10b981" fillOpacity={0.3} strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories */}
      <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Top Categories - Highest Spending Categories
          </CardTitle>
          <CardDescription>Detailed breakdown of your spending by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {enhancedCategoryData.map((category, index) => {
              const IconComponent = category.icon
              return (
                <div
                  key={category.expenseDescType}
                  className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: `${category.color}20` }}>
                      <IconComponent className="h-6 w-6" style={{ color: category.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{category.expenseDescType}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {category.percentage.toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-2xl font-bold" style={{ color: category.color }}>
                      ₹{category.totalExpenses.toLocaleString()}
                    </div>
                    <Progress
                      value={category.percentage}
                      className="h-2"
                      style={{
                        backgroundColor: `${category.color}20`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Financial Insights */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Financial Insights & Recommendations</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Smart insights based on your spending patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h4 className="font-semibold text-emerald-700 mb-3">Best Performing Month</h4>
              <div className="text-2xl font-bold text-emerald-800 mb-2">January</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Highest savings rate at <strong>39.7%</strong> with ₹2,397 saved
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h4 className="font-semibold text-orange-700 mb-3">Top Spending Category</h4>
              <div className="text-2xl font-bold text-orange-800 mb-2">Tea</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Accounts for <strong>74.5%</strong> of your total expenses
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h4 className="font-semibold text-purple-700 mb-3">Savings Goal</h4>
              <div className="text-2xl font-bold text-purple-800 mb-2">{savingsRate.toFixed(1)}%</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Current savings rate. Target: <strong>80%</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
