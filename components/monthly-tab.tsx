"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, Target, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MonthlyTabProps {
  yearlyData: Array<{
    month: string
    totalDebit: number
    totalCredit: number
  }>
}

export default function MonthlyTab({ yearlyData }: MonthlyTabProps) {
  const monthNames = [
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

  const monthlyData = yearlyData.map((item) => ({
    month: monthNames[Number.parseInt(item.month) - 1],
    shortMonth: monthNames[Number.parseInt(item.month) - 1].slice(0, 3),
    income: item.totalCredit,
    expenses: item.totalDebit,
    savings: item.totalCredit - item.totalDebit,
    savingsRate: item.totalCredit > 0 ? ((item.totalCredit - item.totalDebit) / item.totalCredit) * 100 : 0,
  }))

  // Daily data for July (sample)
  const dailyData = [
    { date: "01", credit: 0, debit: 0 },
    { date: "02", credit: 0, debit: 0 },
    { date: "03", credit: 5000, debit: 200 },
    { date: "04", credit: 400, debit: 0 },
    { date: "05", credit: 0, debit: 1000 },
    { date: "06", credit: 0, debit: 0 },
    { date: "07", credit: 0, debit: 0 },
    { date: "08", credit: 0, debit: 0 },
    { date: "09", credit: 0, debit: 0 },
    { date: "10", credit: 0, debit: 0 },
    { date: "11", credit: 0, debit: 0 },
    { date: "12", credit: 0, debit: 0 },
    { date: "13", credit: 0, debit: 0 },
    { date: "14", credit: 0, debit: 0 },
    { date: "15", credit: 0, debit: 0 },
  ]

  const activeMonths = monthlyData.filter((m) => m.income > 0 || m.expenses > 0)
  const bestMonth = activeMonths.reduce(
    (prev, current) => (prev.savings > current.savings ? prev : current),
    activeMonths[0],
  )
  const worstMonth = activeMonths.reduce(
    (prev, current) => (prev.savings < current.savings ? prev : current),
    activeMonths[0],
  )

  // Calculate quarterly data
  const quarterlyData = [
    { quarter: "Q1", months: "Jan-Mar", income: 13200, expenses: 11542, savings: 1658 },
    { quarter: "Q2", months: "Apr-Jun", income: 17500, expenses: 18163, savings: -663 },
    { quarter: "Q3", months: "Jul-Sep", income: 3000, expenses: 3480, savings: -480 },
    { quarter: "Q4", months: "Oct-Dec", income: 0, expenses: 0, savings: 0 },
  ]

  return (
    <div className="space-y-6">
      {/* Monthly Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <ArrowUpRight className="h-5 w-5" />
              Best Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-800">{bestMonth?.month}</div>
            <div className="text-sm text-emerald-600">₹{bestMonth?.savings.toLocaleString()} saved</div>
            <Badge className="mt-2 bg-emerald-200 text-emerald-800">
              {bestMonth?.savingsRate.toFixed(1)}% savings rate
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <ArrowDownRight className="h-5 w-5" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">{worstMonth?.month}</div>
            <div className="text-sm text-red-600">₹{Math.abs(worstMonth?.savings || 0).toLocaleString()} deficit</div>
            <Badge className="mt-2 bg-red-200 text-red-800">{worstMonth?.savingsRate.toFixed(1)}% savings rate</Badge>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Calendar className="h-5 w-5" />
              Active Months
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">{activeMonths.length}</div>
            <div className="text-sm text-purple-600">out of 12 months</div>
            <Badge className="mt-2 bg-purple-200 text-purple-800">
              {((activeMonths.length / 12) * 100).toFixed(0)}% year coverage
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Income vs Expenses */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
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
              className="h-[400px]"
            >
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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

        {/* Quarterly Summary */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Quarterly Summary
            </CardTitle>
            <CardDescription>Financial performance by quarters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quarterlyData.map((quarter, index) => (
                <div key={quarter.quarter} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-lg">{quarter.quarter}</div>
                    <div className="text-sm text-slate-600">{quarter.months}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${quarter.savings >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {quarter.savings >= 0 ? "+" : ""}₹{quarter.savings.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-500">
                      ₹{quarter.income.toLocaleString()} - ₹{quarter.expenses.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Rate Trend */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle>Monthly Savings Rate</CardTitle>
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
              className="h-[300px]"
            >
              <LineChart data={monthlyData}>
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

        {/* Monthly Goals & Targets */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              Monthly Goals & Targets
            </CardTitle>
            <CardDescription>Track your financial goals progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Monthly Savings Goal</span>
                  <span className="text-sm text-slate-600">₹2,000</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
                <div className="text-xs text-slate-500 mt-1">₹1,500 achieved (75%)</div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Expense Limit</span>
                  <span className="text-sm text-slate-600">₹5,000</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
                <div className="text-xs text-slate-500 mt-1">₹4,250 spent (85%)</div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Investment Target</span>
                  <span className="text-sm text-slate-600">₹3,000</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                </div>
                <div className="text-xs text-slate-500 mt-1">₹1,800 invested (60%)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Month Daily Breakdown */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle>July 2025 - Daily Breakdown</CardTitle>
            <CardDescription>Daily credit and debit transactions for the current month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                credit: {
                  label: "Credit",
                  color: "#10b981",
                },
                debit: {
                  label: "Debit",
                  color: "#ef4444",
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="credit" fill="#10b981" radius={2} />
                <Bar dataKey="debit" fill="#ef4444" radius={2} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Monthly Insights */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-slate-50 to-slate-100">
          <CardHeader>
            <CardTitle>Monthly Insights</CardTitle>
            <CardDescription>Smart recommendations based on your monthly patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold text-emerald-700 mb-2">Best Performing Month</h4>
                <p className="text-sm text-slate-600">
                  <strong>January</strong> had the highest savings rate at <strong>39.7%</strong> with ₹2,397 saved
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold text-orange-700 mb-2">Improvement Opportunity</h4>
                <p className="text-sm text-slate-600">
                  Focus on <strong>May</strong> - despite high income (₹9,000), expenses were also highest (₹9,048)
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold text-blue-700 mb-2">Trend Analysis</h4>
                <p className="text-sm text-slate-600">
                  Your savings rate has been <strong>declining</strong> since March. Consider budget adjustments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
