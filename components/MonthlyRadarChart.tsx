"use client"

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

const radarChartData = [
  { month: "Jan", income: 8000, expenses: 6500 },
  { month: "Feb", income: 7500, expenses: 5000 },
  { month: "Mar", income: 8200, expenses: 6200 },
  { month: "Apr", income: 9000, expenses: 7000 },
  { month: "May", income: 9500, expenses: 7200 },
  { month: "Jun", income: 9800, expenses: 7400 },
  { month: "Jul", income: 8500, expenses: 6900 },
  { month: "Aug", income: 8700, expenses: 7100 },
  { month: "Sep", income: 9100, expenses: 7300 },
  { month: "Oct", income: 9400, expenses: 7800 },
  { month: "Nov", income: 8800, expenses: 6600 },
  { month: "Dec", income: 10000, expenses: 8200 },
]

export default function MonthlyRadarChart() {
  return (
    <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 col-span-5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
          <BarChart3 className="h-5 w-5 text-green-600" />
          Monthly Income vs Expenses
        </CardTitle>
        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
          Analyze trends across the year in a clean radial format
        </CardDescription>
      </CardHeader>

      <CardContent className="h-[480px] p-6">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="75%"
            data={radarChartData}
          >
            <PolarGrid strokeDasharray="4 4" />
            <PolarAngleAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 11000]} tick={{ fill: "#9ca3af", fontSize: 11 }} />
            <Tooltip
              wrapperStyle={{ backgroundColor: "#fff", borderRadius: 8 }}
              contentStyle={{ fontSize: 12 }}
            />
            <Legend verticalAlign="bottom" iconType="circle" height={36} />
            <Radar
              name="Income"
              dataKey="income"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.4}
            />
            <Radar
              name="Expenses"
              dataKey="expenses"
              stroke="#60d394"
              fill="#60d394"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}