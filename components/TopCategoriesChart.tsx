"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Activity } from "lucide-react"

const categoryData = [
  { category: "Food", amount: 98000 },
  { category: "Transport", amount: 75000 },
  { category: "Shopping", amount: 67000 },
  { category: "Utilities", amount: 43000 },
  { category: "Entertainment", amount: 39000 },
  { category: "Health", amount: 29000 },
  { category: "Travel", amount: 24000 },
]

// Gradient coloring logic based on value
function getGradientColor(value: number, max: number): string {
  const percent = value / max
  if (percent > 0.8) return "#1565c0"
  if (percent > 0.6) return "#1976d2"
  if (percent > 0.4) return "#1e88e5"
  if (percent > 0.2) return "#42a5f5"
  if (percent > 0.1) return "#90caf9"
  return "#ef4444"
}

export function TopCategoriesChart() {
  const maxAmount = Math.max(...categoryData.map(d => d.amount))

  return (
    <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {/* <Activity className="h-5 w-5 text-orange-600" /> */}
          Top Spending Categories
        </CardTitle>
        <CardDescription>Based on spending amount with heat scale</CardDescription>
      </CardHeader>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={categoryData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 80, bottom: 10 }}
          >
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis dataKey="category" type="category" tick={{ fontSize: 13 }} />
            <Tooltip
              formatter={(value: number) => [`₹${value}`, "Spent"]}
              labelStyle={{ fontWeight: 600 }}
            />
            <Legend />
            <Bar dataKey="amount" barSize={20}>
              {categoryData.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={getGradientColor(entry.amount, maxAmount)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
