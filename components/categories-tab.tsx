"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { PieChartIcon, Target, TrendingUp, Coffee, Droplets, PartyPopper, MoreHorizontal } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface CategoriesTabProps {
  categoryData: Array<{
    expenseDescType: string
    totalExpenses: number
  }>
}

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

const categoryIcons = {
  Tea: Coffee,
  Water: Droplets,
  Party: PartyPopper,
  Other: MoreHorizontal,
}

export default function CategoriesTab({ categoryData }: CategoriesTabProps) {
  const totalExpenses = categoryData.reduce((sum, item) => sum + item.totalExpenses, 0)

  const enhancedCategoryData = categoryData
    .map((item, index) => ({
      ...item,
      percentage: (item.totalExpenses / totalExpenses) * 100,
      color: COLORS[index % COLORS.length],
      icon: categoryIcons[item.expenseDescType as keyof typeof categoryIcons] || MoreHorizontal,
    }))
    .sort((a, b) => b.totalExpenses - a.totalExpenses)

  // Monthly category breakdown (sample data)
  const monthlyCategoryData = [
    { month: "Jan", Tea: 2530, Water: 520, Party: 753, Other: 0 },
    { month: "Feb", Tea: 3275, Water: 0, Party: 248, Other: 0 },
    { month: "Mar", Tea: 0, Water: 0, Party: 0, Other: 300 },
    { month: "Apr", Tea: 0, Water: 0, Party: 0, Other: 0 },
    { month: "May", Tea: 0, Water: 0, Party: 0, Other: 0 },
    { month: "Jun", Tea: 0, Water: 0, Party: 0, Other: 0 },
    { month: "Jul", Tea: 0, Water: 0, Party: 0, Other: 0 },
  ]

  return (
    <div className="space-y-6">
      {/* Category Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {enhancedCategoryData.map((category, index) => {
          const IconComponent = category.icon
          return (
            <Card
              key={category.expenseDescType}
              className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow"
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${category.color}20` }}>
                    <IconComponent className="h-5 w-5" style={{ color: category.color }} />
                  </div>
                  {category.expenseDescType}
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                  <div className="text-sm text-slate-600">{category.percentage.toFixed(1)}% of total expenses</div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution Pie Chart */}
        <Card className="shadow-lg border-0 bg-white">
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
          </CardContent>
        </Card>

        {/* Category Comparison Bar Chart */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-600" />
              Category Comparison
            </CardTitle>
            <CardDescription>Spending amounts by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                totalExpenses: {
                  label: "Total Expenses",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={enhancedCategoryData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" />
                <YAxis dataKey="expenseDescType" type="category" width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="totalExpenses" radius={4}>
                  {enhancedCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Category Trends */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            Monthly Category Trends
          </CardTitle>
          <CardDescription>How spending in each category changes over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              Tea: { label: "Tea", color: "#10b981" },
              Water: { label: "Water", color: "#f59e0b" },
              Party: { label: "Party", color: "#ef4444" },
              Other: { label: "Other", color: "#8b5cf6" },
            }}
            className="h-[400px]"
          >
            <BarChart data={monthlyCategoryData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="Tea" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Water" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Party" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Other" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Category Insights */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-slate-50 to-slate-100">
        <CardHeader>
          <CardTitle>Category Insights</CardTitle>
          <CardDescription>Smart recommendations based on your spending patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold text-emerald-700 mb-2">Top Spending Category</h4>
              <p className="text-sm text-slate-600">
                <strong>{enhancedCategoryData[0]?.expenseDescType}</strong> accounts for{" "}
                <strong>{enhancedCategoryData[0]?.percentage.toFixed(1)}%</strong> of your total expenses
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold text-orange-700 mb-2">Optimization Opportunity</h4>
              <p className="text-sm text-slate-600">
                Consider setting a monthly budget of{" "}
                <strong>₹{Math.round(enhancedCategoryData[0]?.totalExpenses * 0.8).toLocaleString()}</strong> for{" "}
                {enhancedCategoryData[0]?.expenseDescType} to save 20%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
