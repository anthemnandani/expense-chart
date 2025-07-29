"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Calendar, Clock, TrendingUp, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function DailyTab() {
  // Daily data for July 2025 (based on your API structure)
  const dailyData = [
    { date: "01", day: "Tue", credit: 0, debit: 0, net: 0 },
    { date: "02", day: "Wed", credit: 0, debit: 0, net: 0 },
    { date: "03", day: "Thu", credit: 5000, debit: 200, net: 4800 },
    { date: "04", day: "Fri", credit: 400, debit: 0, net: 400 },
    { date: "05", day: "Sat", credit: 0, debit: 1000, net: -1000 },
    { date: "06", day: "Sun", credit: 0, debit: 0, net: 0 },
    { date: "07", day: "Mon", credit: 0, debit: 0, net: 0 },
    { date: "08", day: "Tue", credit: 0, debit: 0, net: 0 },
    { date: "09", day: "Wed", credit: 0, debit: 0, net: 0 },
    { date: "10", day: "Thu", credit: 0, debit: 0, net: 0 },
    { date: "11", day: "Fri", credit: 0, debit: 0, net: 0 },
    { date: "12", day: "Sat", credit: 0, debit: 0, net: 0 },
    { date: "13", day: "Sun", credit: 0, debit: 0, net: 0 },
    { date: "14", day: "Mon", credit: 0, debit: 0, net: 0 },
    { date: "15", day: "Tue", credit: 0, debit: 0, net: 0 },
    { date: "16", day: "Wed", credit: 0, debit: 0, net: 0 },
    { date: "17", day: "Thu", credit: 0, debit: 0, net: 0 },
    { date: "18", day: "Fri", credit: 0, debit: 0, net: 0 },
    { date: "19", day: "Sat", credit: 0, debit: 0, net: 0 },
    { date: "20", day: "Sun", credit: 0, debit: 0, net: 0 },
    { date: "21", day: "Mon", credit: 0, debit: 0, net: 0 },
    { date: "22", day: "Tue", credit: 0, debit: 0, net: 0 },
    { date: "23", day: "Wed", credit: 0, debit: 0, net: 0 },
    { date: "24", day: "Thu", credit: 0, debit: 0, net: 0 },
    { date: "25", day: "Fri", credit: 0, debit: 0, net: 0 },
    { date: "26", day: "Sat", credit: 0, debit: 0, net: 0 },
    { date: "27", day: "Sun", credit: 0, debit: 0, net: 0 },
    { date: "28", day: "Mon", credit: 0, debit: 0, net: 0 },
    { date: "29", day: "Tue", credit: 0, debit: 0, net: 0 },
    { date: "30", day: "Wed", credit: 0, debit: 0, net: 0 },
    { date: "31", day: "Thu", credit: 30, debit: 0, net: 30 },
  ]

  // Weekly pattern analysis
  const weeklyPattern = [
    { day: "Monday", avgCredit: 0, avgDebit: 0, transactions: 0 },
    { day: "Tuesday", avgCredit: 0, avgDebit: 0, transactions: 0 },
    { day: "Wednesday", avgCredit: 10, avgDebit: 0, transactions: 1 },
    { day: "Thursday", avgCredit: 2715, avgDebit: 100, transactions: 2 },
    { day: "Friday", avgCredit: 400, avgDebit: 0, transactions: 1 },
    { day: "Saturday", avgCredit: 0, avgDebit: 1000, transactions: 1 },
    { day: "Sunday", avgCredit: 0, avgDebit: 0, transactions: 0 },
  ]

  // Recent transactions (last 7 days with activity)
  const recentTransactions = [
    { date: "Jul 31", type: "Credit", amount: 30, category: "Other", description: "Miscellaneous income" },
    { date: "Jul 05", type: "Debit", amount: 1000, category: "Other", description: "General expense" },
    { date: "Jul 04", type: "Credit", amount: 400, category: "Income", description: "Additional income" },
    { date: "Jul 03", type: "Credit", amount: 5000, category: "Income", description: "Primary income" },
    { date: "Jul 03", type: "Debit", amount: 200, category: "Other", description: "Daily expense" },
  ]

  const activeDays = dailyData.filter((d) => d.credit > 0 || d.debit > 0).length
  const bestDay = dailyData.reduce((prev, current) => (prev.net > current.net ? prev : current))
  const totalDailyCredit = dailyData.reduce((sum, day) => sum + day.credit, 0)
  const totalDailyDebit = dailyData.reduce((sum, day) => sum + day.debit, 0)

  return (
    <div className="space-y-6">
      {/* Daily Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <Calendar className="h-5 w-5" />
              Active Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-800">{activeDays}</div>
            <div className="text-sm text-emerald-600">out of 31 days</div>
            <Badge className="mt-2 bg-emerald-200 text-emerald-800">
              {((activeDays / 31) * 100).toFixed(0)}% activity
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <TrendingUp className="h-5 w-5" />
              Best Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">Jul {bestDay.date}</div>
            <div className="text-sm text-purple-600">{bestDay.day}</div>
            <Badge className="mt-2 bg-purple-200 text-purple-800">+₹{bestDay.net.toLocaleString()}</Badge>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Zap className="h-5 w-5" />
              Daily Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">
              ₹{Math.round((totalDailyCredit - totalDailyDebit) / 31).toLocaleString()}
            </div>
            <div className="text-sm text-orange-600">net per day</div>
            <Badge className="mt-2 bg-orange-200 text-orange-800">July 2025</Badge>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Clock className="h-5 w-5" />
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">{recentTransactions.length}</div>
            <div className="text-sm text-red-600">this month</div>
            <Badge className="mt-2 bg-red-200 text-red-800">
              {Math.round(recentTransactions.length / activeDays)} per active day
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Daily Credit vs Debit Chart */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            Daily Credit vs Debit - July 2025
          </CardTitle>
          <CardDescription>Daily financial activity throughout the month</CardDescription>
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
            className="h-[400px]"
          >
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-semibold">July {label}, 2025</p>
                        <p className="text-sm">{data.day}</p>
                        <p className="text-sm">Credit: ₹{data.credit.toLocaleString()}</p>
                        <p className="text-sm">Debit: ₹{data.debit.toLocaleString()}</p>
                        <p className="text-sm font-semibold">Net: ₹{data.net.toLocaleString()}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="credit" fill="#10b981" radius={2} />
              <Bar dataKey="debit" fill="#ef4444" radius={2} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Net Balance Trend */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle>Daily Net Balance</CardTitle>
            <CardDescription>Track daily profit/loss patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                net: {
                  label: "Net Balance",
                  color: "#8b5cf6",
                },
              }}
              className="h-[300px]"
            >
              <AreaChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="net" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Weekly Pattern Analysis */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle>Weekly Spending Pattern</CardTitle>
            <CardDescription>Average spending by day of the week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                avgCredit: {
                  label: "Avg Credit",
                  color: "#10b981",
                },
                avgDebit: {
                  label: "Avg Debit",
                  color: "#ef4444",
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={weeklyPattern}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="avgCredit" fill="#10b981" radius={2} />
                <Bar dataKey="avgDebit" fill="#ef4444" radius={2} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Recent Transactions
          </CardTitle>
          <CardDescription>Latest financial activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      transaction.type === "Credit" ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  <div>
                    <div className="font-semibold">{transaction.description}</div>
                    <div className="text-sm text-slate-600">
                      {transaction.date} • {transaction.category}
                    </div>
                  </div>
                </div>
                <div className={`font-bold ${transaction.type === "Credit" ? "text-emerald-600" : "text-red-600"}`}>
                  {transaction.type === "Credit" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Insights */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-slate-50 to-slate-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Daily Insights
          </CardTitle>
          <CardDescription>Smart observations from your daily spending habits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold text-emerald-700 mb-2">Most Active Day</h4>
              <div className="text-2xl font-bold text-emerald-800">Thursday</div>
              <p className="text-sm text-slate-600">Highest transaction volume</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold text-orange-700 mb-2">Spending Peak</h4>
              <div className="text-2xl font-bold text-orange-800">Weekend</div>
              <p className="text-sm text-slate-600">Saturday shows highest expenses</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold text-purple-700 mb-2">Income Days</h4>
              <div className="text-2xl font-bold text-purple-800">3</div>
              <p className="text-sm text-slate-600">days with income this month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
