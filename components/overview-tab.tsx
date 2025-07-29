"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import { TrendingUp, Target, Zap } from "lucide-react"

interface OverviewTabProps {
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

export default function OverviewTab({ yearlyData, categoryData }: OverviewTabProps) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const chartData = yearlyData.map((item) => ({
    month: monthNames[Number.parseInt(item.month) - 1],
    income: item.totalCredit,
    expenses: item.totalDebit,
    net: item.totalCredit - item.totalDebit,
  }))

  const pieData = categoryData.map((item) => ({
    name: item.expenseDescType,
    value: item.totalExpenses,
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Income vs Expenses Trend */}
      <Card className="lg:col-span-2 shadow-lg border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            Income vs Expenses Trend
          </CardTitle>
          <CardDescription>Monthly comparison of income and expenses throughout the year</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              income: {
                label: "Income",
                color: "hsl(var(--chart-1))",
              },
              expenses: {
                label: "Expenses",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Monthly Net Balance */}
      <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Monthly Net Balance
          </CardTitle>
          <CardDescription>Profit/Loss analysis by month</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              net: {
                label: "Net Balance",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[250px]"
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

      {/* Category Distribution */}
      <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Expense Categories
          </CardTitle>
          <CardDescription>Distribution of expenses by category</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              expenses: {
                label: "Expenses",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="h-[250px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm text-slate-600 dark:text-slate-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="lg:col-span-2 shadow-lg border-0 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Financial Insights</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Key metrics and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-emerald-600">75%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Savings Rate</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-orange-600">₹3,100</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Top Category (Tea)</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">7</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Active Months</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
