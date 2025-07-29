"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Calendar, TrendingUp, Activity, Target, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function WeeklyTab() {
  // Sample weekly data based on your API structure
  const weeklyData = [
    { week: "W1", weekStart: "01/01", weekEnd: "07/01", totalCredit: 3000, totalDebit: 1153, net: 1847 },
    { week: "W2", weekStart: "08/01", weekEnd: "14/01", totalCredit: 0, totalDebit: 0, net: 0 },
    { week: "W3", weekStart: "15/01", weekEnd: "21/01", totalCredit: 0, totalDebit: 580, net: -580 },
    { week: "W4", weekStart: "22/01", weekEnd: "28/01", totalCredit: 2000, totalDebit: 1200, net: 800 },
    { week: "W5", weekStart: "29/01", weekEnd: "04/02", totalCredit: 1500, totalDebit: 800, net: 700 },
    { week: "W6", weekStart: "05/02", weekEnd: "11/02", totalCredit: 0, totalDebit: 900, net: -900 },
    { week: "W7", weekStart: "12/02", weekEnd: "18/02", totalCredit: 0, totalDebit: 1200, net: -1200 },
    { week: "W8", weekStart: "19/02", weekEnd: "25/02", totalCredit: 2000, totalDebit: 423, net: 1577 },
    { week: "W9", weekStart: "26/02", weekEnd: "04/03", totalCredit: 0, totalDebit: 900, net: -900 },
    { week: "W10", weekStart: "05/03", weekEnd: "11/03", totalCredit: 3000, totalDebit: 1500, net: 1500 },
    { week: "W11", weekStart: "12/03", weekEnd: "18/03", totalCredit: 2000, totalDebit: 1416, net: 584 },
    { week: "W12", weekStart: "19/03", weekEnd: "25/03", totalCredit: 0, totalDebit: 1300, net: -1300 },
  ]

  // Current month weekly breakdown
  const julyWeeklyData = [
    { week: "Week 1", days: "Jul 1-7", income: 3000, expenses: 1200, savings: 1800 },
    { week: "Week 2", days: "Jul 8-14", income: 0, expenses: 800, savings: -800 },
    { week: "Week 3", days: "Jul 15-21", income: 0, expenses: 900, savings: -900 },
    { week: "Week 4", days: "Jul 22-28", income: 0, expenses: 580, savings: -580 },
  ]

  const bestWeek = weeklyData.reduce((prev, current) => (prev.net > current.net ? prev : current))
  const worstWeek = weeklyData.reduce((prev, current) => (prev.net < current.net ? prev : current))
  const avgWeeklyNet = weeklyData.reduce((sum, week) => sum + week.net, 0) / weeklyData.length

  // Weekly patterns data
  const weeklyPatterns = [
    { pattern: "Income Weeks", count: 6, percentage: 50, color: "emerald" },
    { pattern: "Expense Only", count: 4, percentage: 33, color: "red" },
    { pattern: "Balanced Weeks", count: 2, percentage: 17, color: "blue" },
  ]

  return (
    <div className="space-y-6">
      {/* Weekly Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <TrendingUp className="h-5 w-5" />
              Best Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-800">{bestWeek.week}</div>
            <div className="text-sm text-emerald-600">
              {bestWeek.weekStart} - {bestWeek.weekEnd}
            </div>
            <Badge className="mt-2 bg-emerald-200 text-emerald-800">+₹{bestWeek.net.toLocaleString()}</Badge>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Activity className="h-5 w-5" />
              Challenging Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">{worstWeek.week}</div>
            <div className="text-sm text-red-600">
              {worstWeek.weekStart} - {worstWeek.weekEnd}
            </div>
            <Badge className="mt-2 bg-red-200 text-red-800">₹{Math.abs(worstWeek.net).toLocaleString()} deficit</Badge>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Target className="h-5 w-5" />
              Weekly Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">₹{Math.round(avgWeeklyNet).toLocaleString()}</div>
            <div className="text-sm text-purple-600">Average weekly net</div>
            <Badge className="mt-2 bg-purple-200 text-purple-800">
              {avgWeeklyNet > 0 ? "Positive" : "Negative"} trend
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Net Balance Trend */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-600" />
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

        {/* Weekly Patterns Analysis */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-600" />
              Weekly Patterns
            </CardTitle>
            <CardDescription>Analysis of your weekly financial patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {weeklyPatterns.map((pattern, index) => (
                <div key={pattern.pattern} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{pattern.pattern}</span>
                    <span className="text-sm text-slate-600">{pattern.count} weeks</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        pattern.color === "emerald"
                          ? "bg-emerald-500"
                          : pattern.color === "red"
                            ? "bg-red-500"
                            : "bg-blue-500"
                      }`}
                      style={{ width: `${pattern.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-slate-500">{pattern.percentage}% of total weeks</div>
                </div>
              ))}

              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-700 mb-2">Pattern Insights</h4>
                <p className="text-sm text-slate-600">
                  You have income in 50% of weeks. Consider establishing more consistent income streams.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Income vs Expenses */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle>Weekly Income vs Expenses</CardTitle>
            <CardDescription>Comparison of weekly income and expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                totalCredit: {
                  label: "Income",
                  color: "#10b981",
                },
                totalDebit: {
                  label: "Expenses",
                  color: "#ef4444",
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="totalCredit" fill="#10b981" radius={2} />
                <Bar dataKey="totalDebit" fill="#ef4444" radius={2} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Current Month Weekly Breakdown */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle>July 2025 - Weekly Breakdown</CardTitle>
            <CardDescription>Current month's weekly financial summary</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                savings: {
                  label: "Weekly Savings",
                  color: "#8b5cf6",
                },
              }}
              className="h-[300px]"
            >
              <LineChart data={julyWeeklyData}>
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
                          <p className="text-sm">{data.days}</p>
                          <p className="text-sm">Savings: ₹{data.savings.toLocaleString()}</p>
                          <p className="text-xs text-slate-600">
                            Income: ₹{data.income.toLocaleString()} | Expenses: ₹{data.expenses.toLocaleString()}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 5 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Insights */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-slate-50 to-slate-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            Weekly Insights
          </CardTitle>
          <CardDescription>Key patterns and recommendations from your weekly spending</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold text-emerald-700 mb-2">Positive Weeks</h4>
              <div className="text-2xl font-bold text-emerald-800">{weeklyData.filter((w) => w.net > 0).length}</div>
              <p className="text-sm text-slate-600">out of {weeklyData.length} weeks</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold text-orange-700 mb-2">Best Streak</h4>
              <div className="text-2xl font-bold text-orange-800">3</div>
              <p className="text-sm text-slate-600">consecutive positive weeks</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold text-purple-700 mb-2">Weekly Goal</h4>
              <div className="text-2xl font-bold text-purple-800">₹1,500</div>
              <p className="text-sm text-slate-600">recommended weekly savings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
