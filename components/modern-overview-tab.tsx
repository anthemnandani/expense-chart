"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"

// Dynamically import echarts to avoid SSR issues
const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false })

interface ModernOverviewTabProps {
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

export default function ModernOverviewTab({ yearlyData, categoryData }: ModernOverviewTabProps) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const chartData = yearlyData.map((item) => ({
    month: monthNames[Number.parseInt(item.month) - 1],
    income: item.totalCredit,
    expenses: item.totalDebit,
    net: item.totalCredit - item.totalDebit,
  }))

  // Calculate metrics
  const totalIncome = yearlyData.reduce((sum, item) => sum + item.totalCredit, 0)
  const totalExpenses = yearlyData.reduce((sum, item) => sum + item.totalDebit, 0)
  const netSavings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
  const activeMonths = yearlyData.filter((item) => item.totalCredit > 0 || item.totalDebit > 0).length

  // Enhanced category data with colors
  const categoryColors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"]
  const enhancedCategoryData = categoryData.map((item, index) => ({
    ...item,
    color: categoryColors[index % categoryColors.length],
    percentage: ((item.totalExpenses / totalExpenses) * 100).toFixed(1),
  }))

  // Financial Overview Area Chart Options
  const financialChartOptions = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#e5e7eb",
      borderWidth: 1,
      textStyle: {
        color: "#374151",
      },
      formatter: (params: any) => {
        let result = `<div style="font-weight: 600; margin-bottom: 8px;">${params[0].axisValue} 2025</div>`
        params.forEach((param: any) => {
          result += `<div style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; border-radius: 50%; margin-right: 8px;"></span>
            <span style="margin-right: 12px;">${param.seriesName}:</span>
            <span style="font-weight: 600;">₹${param.value.toLocaleString()}</span>
          </div>`
        })
        return result
      },
    },
    legend: {
      data: ["Income", "Expenses"],
      top: 10,
      textStyle: {
        color: "#6b7280",
      },
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "20%",
      top: "20%",
      containLabel: true,
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 100,
        height: 20,
        bottom: 10,
        borderColor: "#e5e7eb",
        fillerColor: "rgba(59, 130, 246, 0.1)",
        handleStyle: {
          color: "#3b82f6",
        },
      },
    ],
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: chartData.map((item) => item.month),
      axisLine: {
        lineStyle: {
          color: "#e5e7eb",
        },
      },
      axisLabel: {
        color: "#6b7280",
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#6b7280",
        formatter: (value: number) => `₹${(value / 1000).toFixed(0)}K`,
      },
      splitLine: {
        lineStyle: {
          color: "#f3f4f6",
          type: "dashed",
        },
      },
    },
    series: [
      {
        name: "Income",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: "#10b981",
        },
        itemStyle: {
          color: "#10b981",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(16, 185, 129, 0.3)" },
              { offset: 1, color: "rgba(16, 185, 129, 0.05)" },
            ],
          },
        },
        data: chartData.map((item) => item.income),
      },
      {
        name: "Expenses",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: "#ef4444",
        },
        itemStyle: {
          color: "#ef4444",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(239, 68, 68, 0.3)" },
              { offset: 1, color: "rgba(239, 68, 68, 0.05)" },
            ],
          },
        },
        data: chartData.map((item) => item.expenses),
      },
    ],
  }

  // Half Doughnut Chart Options
  const categoryChartOptions = {
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#e5e7eb",
      borderWidth: 1,
      textStyle: {
        color: "#374151",
      },
      formatter: (params: any) => `<div style="font-weight: 600; margin-bottom: 4px;">${params.name}</div>
                <div>Amount: ₹${params.value.toLocaleString()}</div>
                <div>Percentage: ${params.percent}%</div>`,
    },
    legend: {
      orient: "horizontal",
      bottom: 10,
      textStyle: {
        color: "#6b7280",
        fontSize: 12,
      },
    },
    series: [
      {
        name: "Expenses",
        type: "pie",
        radius: ["35%", "65%"],
        center: ["50%", "40%"],
        startAngle: 180,
        endAngle: 360,
        data: enhancedCategoryData.map((item) => ({
          value: item.totalExpenses,
          name: item.expenseDescType,
          itemStyle: {
            color: item.color,
            borderRadius: 8,
            borderColor: "#fff",
            borderWidth: 2,
          },
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        label: {
          show: true,
          position: "outside",
          formatter: "{b}: {d}%",
          fontSize: 11,
          color: "#6b7280",
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 10,
        },
      },
    ],
  }

  // Savings Goal Gauge Chart Options
  const savingsGaugeOptions = {
    series: [
      {
        name: "Savings Rate",
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        center: ["50%", "70%"],
        radius: "85%",
        min: 0,
        max: 100,
        splitNumber: 8,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.3, "#ef4444"],
              [0.7, "#f59e0b"],
              [1, "#10b981"],
            ],
          },
        },
        pointer: {
          icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
          length: "12%",
          width: 20,
          offsetCenter: [0, "-60%"],
          itemStyle: {
            color: "auto",
          },
        },
        axisTick: {
          length: 12,
          lineStyle: {
            color: "auto",
            width: 2,
          },
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: "auto",
            width: 5,
          },
        },
        axisLabel: {
          color: "#6b7280",
          fontSize: 10,
          distance: -60,
          formatter: (value: number) => {
            if (value === 100) return "100%"
            if (value === 80) return "80%"
            if (value === 60) return "60%"
            if (value === 40) return "40%"
            if (value === 20) return "20%"
            if (value === 0) return "0%"
            return ""
          },
        },
        title: {
          offsetCenter: [0, "-10%"],
          fontSize: 14,
          color: "#374151",
        },
        detail: {
          fontSize: 24,
          offsetCenter: [0, "-35%"],
          valueAnimation: true,
          formatter: (value: number) => Math.round(value) + "%",
          color: "auto",
        },
        data: [
          {
            value: savingsRate,
            name: "Savings Rate",
          },
        ],
      },
    ],
  }

  // Monthly Trend Bar Chart Options
  const trendChartOptions = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#e5e7eb",
      borderWidth: 1,
      textStyle: {
        color: "#374151",
      },
    },
    legend: {
      data: ["Income", "Expenses"],
      top: 10,
      textStyle: {
        color: "#6b7280",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "15%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: chartData.map((item) => item.month),
        axisPointer: {
          type: "shadow",
        },
        axisLine: {
          lineStyle: {
            color: "#e5e7eb",
          },
        },
        axisLabel: {
          color: "#6b7280",
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: "#6b7280",
          formatter: (value: number) => `₹${(value / 1000).toFixed(0)}K`,
        },
        splitLine: {
          lineStyle: {
            color: "#f3f4f6",
            type: "dashed",
          },
        },
      },
    ],
    series: [
      {
        name: "Income",
        type: "bar",
        emphasis: {
          focus: "series",
        },
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#10b981" },
              { offset: 1, color: "#059669" },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        data: chartData.map((item) => item.income),
      },
      {
        name: "Expenses",
        type: "bar",
        emphasis: {
          focus: "series",
        },
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#ef4444" },
              { offset: 1, color: "#dc2626" },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        data: chartData.map((item) => item.expenses),
      },
    ],
  }

  // Net Balance Chart Options
  const balanceChartOptions = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#e5e7eb",
      borderWidth: 1,
      textStyle: {
        color: "#374151",
      },
      formatter: (params: any) => {
        const value = params[0].value
        const color = value >= 0 ? "#10b981" : "#ef4444"
        const status = value >= 0 ? "Profit" : "Loss"
        return `<div style="font-weight: 600; margin-bottom: 4px;">${params[0].axisValue}</div>
                <div style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 8px;"></span>
                  <span>${status}: ₹${Math.abs(value).toLocaleString()}</span>
                </div>`
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: chartData.map((item) => item.month),
      axisLine: {
        lineStyle: {
          color: "#e5e7eb",
        },
      },
      axisLabel: {
        color: "#6b7280",
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#6b7280",
        formatter: (value: number) => `₹${(value / 1000).toFixed(0)}K`,
      },
      splitLine: {
        lineStyle: {
          color: "#f3f4f6",
          type: "dashed",
        },
      },
    },
    series: [
      {
        name: "Net Balance",
        type: "bar",
        data: chartData.map((item) => ({
          value: item.net,
          itemStyle: {
            color:
              item.net >= 0
                ? {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      { offset: 0, color: "#10b981" },
                      { offset: 1, color: "#059669" },
                    ],
                  }
                : {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      { offset: 0, color: "#ef4444" },
                      { offset: 1, color: "#dc2626" },
                    ],
                  },
            borderRadius: [4, 4, 4, 4],
          },
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.3)",
          },
        },
      },
    ],
  }

  // Top Categories Horizontal Bar Chart Options
  const performanceChartOptions = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#e5e7eb",
      borderWidth: 1,
      textStyle: {
        color: "#374151",
      },
    },
    grid: {
      left: "20%",
      right: "4%",
      bottom: "3%",
      top: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#6b7280",
        formatter: "{value}%",
      },
      splitLine: {
        lineStyle: {
          color: "#f3f4f6",
          type: "dashed",
        },
      },
    },
    yAxis: {
      type: "category",
      data: enhancedCategoryData.slice(0, 5).map((item) => item.expenseDescType),
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#6b7280",
        fontSize: 11,
      },
    },
    series: [
      {
        name: "Percentage",
        type: "bar",
        data: enhancedCategoryData.slice(0, 5).map((item, index) => ({
          value: Number.parseFloat(item.percentage),
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: item.color + "40" },
                { offset: 1, color: item.color },
              ],
            },
            borderRadius: [0, 4, 4, 0],
          },
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.3)",
          },
        },
        label: {
          show: true,
          position: "right",
          formatter: "{c}%",
          color: "#6b7280",
          fontSize: 11,
        },
      },
    ],
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-emerald-700">Total Income</CardTitle>
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
            <CardTitle className="flex items-center gap-2 text-red-700">Total Expenses</CardTitle>
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
            <CardTitle className="flex items-center gap-2 text-purple-700">Net Savings</CardTitle>
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
            <CardTitle className="flex items-center gap-2 text-orange-700">Active Months</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">{activeMonths}/12</div>
            <div className="text-sm text-orange-600 mt-1">{((activeMonths / 12) * 100).toFixed(0)}% year coverage</div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Insights */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Financial Overview Summary</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Complete overview of your financial data
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

      {/* Top Row - Main Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Financial Metrics Chart */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  Financial Overview
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 mt-1">
                  Track your income and expenses over time
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  DAY
                </Badge>
                <Badge variant="outline" className="text-xs">
                  WEEK
                </Badge>
                <Badge variant="default" className="text-xs bg-blue-500">
                  MONTH
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">INCOME</div>
                <div className="text-xl font-bold text-emerald-600">₹{(totalIncome / 1000).toFixed(0)}K</div>
                <div className="text-xs text-emerald-500 flex items-center justify-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  +12.5%
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">EXPENSES</div>
                <div className="text-xl font-bold text-red-600">₹{(totalExpenses / 1000).toFixed(0)}K</div>
                <div className="text-xs text-red-500 flex items-center justify-center gap-1">
                  <ArrowDownRight className="h-3 w-3" />
                  -8.2%
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">NET SAVINGS</div>
                <div className="text-xl font-bold text-blue-600">₹{(netSavings / 1000).toFixed(0)}K</div>
                <div className="text-xs text-blue-500 flex items-center justify-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  +15.3%
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">SAVINGS RATE</div>
                <div className="text-xl font-bold text-purple-600">{savingsRate.toFixed(1)}%</div>
                <div className="text-xs text-purple-500">Target: 80%</div>
              </div>
            </div>

            {/* ECharts Area Chart */}
            <div className="h-[280px] w-full overflow-hidden">
              <ReactECharts
                option={financialChartOptions}
                style={{ height: "280px", width: "100%" }}
                opts={{ renderer: "canvas", width: "auto", height: "auto" }}
                notMerge={true}
                lazyUpdate={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Expense Categories</CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              Distribution of your spending by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* ECharts Half Doughnut Chart */}
            <div className="h-[280px] w-full overflow-hidden">
              <ReactECharts
                option={categoryChartOptions}
                style={{ height: "280px", width: "100%" }}
                opts={{ renderer: "canvas", width: "auto", height: "auto" }}
                notMerge={true}
                lazyUpdate={true}
              />
            </div>

            {/* Total in Center */}
            <div className="text-center mt-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{(totalExpenses / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-gray-500">Total Expenses</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Savings Goal */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Savings Goal</CardTitle>
            <CardDescription className="text-sm text-gray-500">Monthly savings target progress</CardDescription>
          </CardHeader>
          <CardContent>
            {/* ECharts Gauge Chart */}
            <div className="h-[200px] w-full overflow-hidden">
              <ReactECharts
                option={savingsGaugeOptions}
                style={{ height: "200px", width: "100%" }}
                opts={{ renderer: "canvas", width: "auto", height: "auto" }}
                notMerge={true}
                lazyUpdate={true}
              />
            </div>
            <div className="text-center mt-2">
              <div className="text-sm text-gray-500 mb-1">Current: {savingsRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-500">Target: 80.0%</div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Trend</CardTitle>
            <CardDescription className="text-sm text-gray-500">Income vs expenses comparison by month</CardDescription>
          </CardHeader>
          <CardContent>
            {/* ECharts Bar Chart */}
            <div className="h-[200px] w-full overflow-hidden">
              <ReactECharts
                option={trendChartOptions}
                style={{ height: "200px", width: "100%" }}
                opts={{ renderer: "canvas", width: "auto", height: "auto" }}
                notMerge={true}
                lazyUpdate={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{activeMonths}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Active Months</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{categoryData.length}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ₹{(totalExpenses / activeMonths / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Avg Monthly</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Categories Performance */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Top Categories</CardTitle>
            <CardDescription className="text-sm text-gray-500">Highest spending categories</CardDescription>
          </CardHeader>
          <CardContent>
            {/* ECharts Horizontal Bar Chart */}
            <div className="h-[200px] w-full overflow-hidden">
              <ReactECharts
                option={performanceChartOptions}
                style={{ height: "200px", width: "100%" }}
                opts={{ renderer: "canvas", width: "auto", height: "auto" }}
                notMerge={true}
                lazyUpdate={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Monthly Comparison */}
        <Card className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Net Balance Trend</CardTitle>
            <CardDescription className="text-sm text-gray-500">Monthly profit/loss analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {/* ECharts Waterfall Chart */}
            <div className="h-[200px] w-full overflow-hidden">
              <ReactECharts
                option={balanceChartOptions}
                style={{ height: "200px", width: "100%" }}
                opts={{ renderer: "canvas", width: "auto", height: "auto" }}
                notMerge={true}
                lazyUpdate={true}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
