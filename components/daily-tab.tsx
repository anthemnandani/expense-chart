"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Calendar, Clock, TrendingUp, Activity } from "lucide-react"

export default function DailyTab() {
  // Sample daily data for July 2025
  const dailyData = [
    { date: "01", day: "Mon", credit: 0, debit: 0, net: 0 },
    { date: "02", day: "Tue", credit: 0, debit: 0, net: 0 },
    { date: "03", day: "Wed", credit: 5000, debit: 200, net: 4800 },
    { date: "04", day: "Thu", credit: 400, debit: 0, net: 400 },
    { date: "05", day: "Fri", credit: 0, debit: 1000, net: -1000 },
    { date: "06", day: "Sat", credit: 0, debit: 0, net: 0 },
    { date: "07", day: "Sun", credit: 0, debit: 0, net: 0 },
    { date: "08", day: "Mon", credit: 0, debit: 300, net: -300 },
    { date: "09", day: "Tue", credit: 0, debit: 150, net: -150 },
    { date: "10", day: "Wed", credit: 0, debit: 0, net: 0 },
    { date: "11", day: "Thu", credit: 0, debit: 0, net: 0 },
    { date: "12", day: "Fri", credit: 0, debit: 250, net: -250 },
    { date: "13", day: "Sat", credit: 0, debit: 0, net: 0 },
    { date: "14", day: "Sun", credit: 0, debit: 0, net: 0 },
    { date: "15", day: "Mon", credit: 0, debit: 180, net: -180 },
    { date: "16", day: "Tue", credit: 0, debit: 0, net: 0 },
    { date: "17", day: "Wed", credit: 0, debit: 0, net: 0 },
    { date: "18", day: "Thu", credit: 0, debit: 0, net: 0 },
    { date: "19", day: "Fri", credit: 0, debit: 0, net: 0 },
    { date: "20", day: "Sat", credit: 0, debit: 0, net: 0 },
    { date: "21", day: "Sun", credit: 0, debit: 0, net: 0 },
    { date: "22", day: "Mon", credit: 0, debit: 0, net: 0 },
    { date: "23", day: "Tue", credit: 0, debit: 0, net: 0 },
    { date: "24", day: "Wed", credit: 0, debit: 0, net: 0 },
    { date: "25", day: "Thu", credit: 0, debit: 0, net: 0 },
    { date: "26", day: "Fri", credit: 0, debit: 0, net: 0 },
    { date: "27", day: "Sat", credit: 0, debit: 0, net: 0 },
    { date: "28", day: "Sun", credit: 0, debit: 0, net: 0 },
    { date: "29", day: "Mon", credit: 0, debit: 0, net: 0 },
    { date: "30", day: "Tue", credit: 0, debit: 0, net: 0 },
    { date: "31", day: "Wed", credit: 0, debit: 0, net: 0 },
  ]

  const totalDailyCredit = dailyData.reduce((sum, day) => sum + day.credit, 0)
  const totalDailyDebit = dailyData.reduce((sum, day) => sum + day.debit, 0)
  const activeDays = dailyData.filter((day) => day.credit > 0 || day.debit > 0).length

  return (
    <div className="space-y-6">
      {/* Daily Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <TrendingUp className="h-5 w-5" />
              Daily Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-800">₹{totalDailyCredit.toLocaleString()}</div>
            <div className="text-sm text-emerald-600">This month</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Activity className="h-5 w-5" />
              Daily Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">₹{totalDailyDebit.toLocaleString()}</div>
            <div className="text-sm text-red-600">This month</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Calendar className="h-5 w-5" />
              Active Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">{activeDays}</div>
            <div className="text-sm text-purple-600">out of 31 days</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Clock className="h-5 w-5" />
              Daily Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">
              ₹{Math.round(totalDailyDebit / activeDays).toLocaleString()}
            </div>
            <div className="text-sm text-orange-600">per active day</div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Credit vs Debit Chart */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader>
          <CardTitle>Daily Credit vs Debit - July 2025</CardTitle>
          <CardDescription>Daily financial transactions with clear day range visibility</CardDescription>
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
            <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} interval={0} fontSize={12} />
              <YAxis />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length > 0) {
                    const data = dailyData.find((d) => d.date === label)
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-semibold">
                          July {label}, 2025 ({data?.day})
                        </p>
                        <p className="text-sm text-emerald-600">Credit: ₹{data?.credit.toLocaleString()}</p>
                        <p className="text-sm text-red-600">Debit: ₹{data?.debit.toLocaleString()}</p>
                        <p className="text-sm font-medium">Net: ₹{data?.net.toLocaleString()}</p>
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

      {/* Daily Net Balance Trend */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader>
          <CardTitle>Daily Net Balance Trend</CardTitle>
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
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="net"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Daily Insights */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-slate-50 to-slate-100">
        <CardHeader>
          <CardTitle>Daily Insights</CardTitle>
          <CardDescription>Key patterns from your daily spending</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold text-emerald-700 mb-2">Most Active Day</h4>
              <div className="text-2xl font-bold text-emerald-800">Wednesday</div>
              <p className="text-sm text-slate-600">July 3rd - ₹5,200 total activity</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold text-orange-700 mb-2">Average Daily Spend</h4>
              <div className="text-2xl font-bold text-orange-800">₹{Math.round(totalDailyDebit / 31)}</div>
              <p className="text-sm text-slate-600">across all days in July</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold text-purple-700 mb-2">Activity Rate</h4>
              <div className="text-2xl font-bold text-purple-800">{((activeDays / 31) * 100).toFixed(0)}%</div>
              <p className="text-sm text-slate-600">days with transactions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
