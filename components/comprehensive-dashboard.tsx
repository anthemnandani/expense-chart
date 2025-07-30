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
  Legend,
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
import NetBalanceChart from "./NetBalanceChart"
import MonthlyRadarChart from "./MonthlyRadarChart"
import { TopCategoriesChart } from "./TopCategoriesChart"

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

const COLORS = ["#3b82f6", "#00b4d8", "#22c55e", "#60d394", "#", "#f4a261"]

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
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Metric Card Template */}
        {[
          {
            title: "Total Income",
            icon: DollarSign,
            value: `₹${totalIncome.toLocaleString()}`,
            change: "+12.5% from last period",
            changeIcon: ArrowUpRight,
          },
          {
            title: "Total Expenses",
            icon: TrendingDown,
            value: `₹${totalExpenses.toLocaleString()}`,
            change: "-8.2% from last period",
            changeIcon: ArrowDownRight,
          },
          {
            title: "Net Savings",
            icon: Target,
            value: `₹${netSavings.toLocaleString()}`,
            subtitle: `${savingsRate.toFixed(1)}% savings rate`,
          },
          {
            title: "Active Months",
            icon: Calendar,
            value: `${activeMonths}/12`,
            subtitle: `${((activeMonths / 12) * 100).toFixed(0)}% year coverage`,
          },
        ].map(({ title, icon: Icon, value, change, subtitle, changeIcon: ChangeIcon }, idx) => (
          <Card
            key={idx}
            className="shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100 text-sm font-medium">
                <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
              {change && (
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <ChangeIcon className="h-3 w-3" />
                  {change}
                </div>
              )}
              {subtitle && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {subtitle}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>


      {/* Financial Overview and Expense Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Financial Overview */}
        <Card className="shadow-lg border-0 bg-white col-span-3 dark:bg-gray-800">
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
                  color: "#22c55e",
                },
                expenses: {
                  label: "Expenses",
                  color: "#3b82f6",
                },
              }}
              className="h-[350px]"
            >
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="income" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stackId="2"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Expense Distribution */}
        <Card className="shadow-lg col-span-2 border-0 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-purple-600" />
              Expense Distribution
            </CardTitle>
            <CardDescription>Track category-wise expenses and their relative proportions.</CardDescription>
          </CardHeader>

          <CardContent>
            <ChartContainer
              config={{
                expenses: {
                  label: "Expenses",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={enhancedCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="totalExpenses"
                    cornerRadius={5}
                    label={({ percentage, expenseDescType }) =>
                      `${expenseDescType} (${percentage.toFixed(1)}%)`
                    }
                    labelLine={false}
                  >
                    {enhancedCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>

                  <ChartTooltip
                    wrapperStyle={{ zIndex: 9999 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white px-3 py-2 border rounded shadow-xl max-w-[200px]">
                            <div className="flex justify-between gap-2 pb-1">
                              <p className="font-semibold text-purple-700">
                                {data.expenseDescType}
                              </p>
                              <p className="text-xs text-slate-600">
                                <p className="text-xs">₹{data.totalExpenses.toLocaleString()}</p>
                              </p>
                            </div>
                            {data.percentage.toFixed(1)}% of total
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {enhancedCategoryData.map((entry) => (
                <div
                  key={entry.expenseDescType}
                  className="flex items-center gap-2 bg-muted/20 dark:bg-muted/10 px-2 py-1 rounded-md"
                >
                  <div
                    className="w-6 h-full rounded"
                    style={{ backgroundColor: entry.color }}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {entry.expenseDescType}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      ₹{entry.totalExpenses.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Other cards */}
        <NetBalanceChart />
      </div>

      {/* Monthly Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Income vs Expenses */}
        <MonthlyRadarChart />


        {/* Monthly Savings Rate */}
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 col-span-7">
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
                  color: "#3b82f6",
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
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Net Balance and Weekly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Net Balance Trend */}
          <TopCategoriesChart />

        {/* Weekly Net Balance Trend */}
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {/* <Activity className="h-5 w-5 text-orange-600" /> */}
              Weekly Net Balance Trend
            </CardTitle>
            <CardDescription>Track your weekly financial performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                net: {
                  label: "Net Balance",
                  color: "#3b82f6",
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
                <Area type="monotone" dataKey="net" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
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
