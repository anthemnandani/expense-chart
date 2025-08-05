"use client"

import dynamic from "next/dynamic";

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
import MonthlyRadarChart from "./MonthlyRadarChart"
import { TopCategoriesChart } from "./TopCategoriesChart"
import YearlyCategoryExpenseChart from "./YearlyCategoryExpenseChart"
import { DailyExpenseChart } from "./DailyExpenseChart"
import AreaNuclearStockpileChart from "./AreaNuclearStockpileChart"
import WeeklyExpenseChart from "./WeeklyExpenseChart"
// import AnnualCategoryTrendsChart from "./AnnualCategoryTrendsChart"

// ✅ Dynamically import Highcharts-based charts to disable SSR
const AreaYearlyExpenseChart = dynamic(() => import("./AreaNuclearStockpileChart"), { ssr: false });
const CategoryWiseExpenseChart = dynamic(() => import("./CategoryWiseExpenseChart"), { ssr: false });
const GaugeMultipleKPIChart = dynamic(() => import("./GaugeMultipleKPIChart"), { ssr: false });
const HighLevelPieChart = dynamic(() => import("./HighLevelPieChart"), { ssr: false });
const NetBalanceChart = dynamic(() => import("./NetBalanceChart"), { ssr: false });
const ScrollytellingChart = dynamic(() => import("./ScrollytellingChart"), { ssr: false });
// const AnnualCategoryTrendsChart = dynamic(() => import("./AnnualCategoryTrendsChart"), { ssr: false });
const AdvancedPolarChart = dynamic(() => import("./AdvancedPolarChart"), { ssr: false });


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
        <AreaNuclearStockpileChart />
        <HighLevelPieChart categoryData={categoryData} />
      </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Other cards */}
        <NetBalanceChart />
      </div>

      {/* Monthly Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <MonthlyRadarChart />
        <CategoryWiseExpenseChart />
      </div>

      {/* Net Balance and Weekly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <DailyExpenseChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* <TopCategoriesChart /> */}
        {/* <GaugeMultipleKPIChart /> */}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <AdvancedPolarChart />
        <GaugeMultipleKPIChart />
        {/* <AnnualCategoryTrendsChart/> */}
        {/* <ScrollytellingChart /> */}
      </div>

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

