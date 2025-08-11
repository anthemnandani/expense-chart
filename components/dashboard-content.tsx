"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { apiService } from "@/lib/apiService";
import MonthlyRadarChart from "./MonthlyRadarChart";
import { DailyExpenseChart } from "./DailyExpenseChart";
import UniqueStatCards from "./UniqueStatCards";
import { FinancialInsight } from "@/lib/types";

const AreaYearlyExpenseChart = dynamic(() => import("./AreaYearlyExpenseChart"), { ssr: false });
const CategoryWiseExpenseChart = dynamic(() => import("./CategoryWiseExpenseChart"), { ssr: false });
const GaugeMultipleKPIChart = dynamic(() => import("./GaugeMultipleKPIChart"), { ssr: false });
const HighLevelPieChart = dynamic(() => import("./HighLevelPieChart"), { ssr: false });
const NetBalanceChart = dynamic(() => import("./NetBalanceChart"), { ssr: false });
const AnnualCategoryTrendsChart = dynamic(() => import("./AnnualCategoryTrendsChart"), { ssr: false });
const TreeGraphChart = dynamic(() => import("./ExpenseTreeChart"), { ssr: false });
const AdvancedPolarChart = dynamic(() => import("./AdvancedPolarChart"), { ssr: false });

export default function DashboardContent() {
  const { user } = useAuth();
  const groupId = user?.groupId;
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(8);
  const [financialInsights, setFinancialInsights] = useState<FinancialInsight | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) {
      setError("No group ID available. Please sign in.");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const insights = await apiService.getFinancialInsights(groupId, selectedYear, selectedMonth);
        setFinancialInsights(insights);
      } catch (error: any) {
        console.error("Error fetching financial insights:", error);
        setError(error.message || "Failed to load financial insights. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId, selectedYear, selectedMonth]);

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
            Financial Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Complete overview of your financial data</p>
        </div>
        <div className="flex gap-2 items-center">

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs rounded-md px-2 py-1"
          >
            {[2025, 2024, 2023].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comprehensive Dashboard */}
      <div className="space-y-6">
        <UniqueStatCards selectedYear={selectedYear} />
        {/* Financial Overview and Expense Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <AreaYearlyExpenseChart />
          <HighLevelPieChart />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NetBalanceChart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <TreeGraphChart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <MonthlyRadarChart />
          <CategoryWiseExpenseChart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <DailyExpenseChart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <AdvancedPolarChart />
          <GaugeMultipleKPIChart />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <AnnualCategoryTrendsChart />
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
            {financialInsights ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-emerald-700 mb-3">Best Performing Month</h4>
                  <div className="text-2xl font-bold text-emerald-800 mb-2">{financialInsights.bestPerformingMonth.month}</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Highest savings rate at <strong>{financialInsights.bestPerformingMonth.savingsRate}%</strong> with ₹{financialInsights.bestPerformingMonth.amountSaved.toLocaleString()} saved
                  </p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-sky-600 mb-3">Lowest Income Month</h4>
                  <div className="text-2xl font-bold text-sky-700 mb-2">{financialInsights.lowestIncomeMonth.month}</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Only ₹{financialInsights.lowestIncomeMonth.income.toLocaleString()} earned. Consider boosting income.
                  </p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-orange-700 mb-3">Top Spending Category</h4>
                  <div className="text-2xl font-bold text-orange-800 mb-2">{financialInsights.topSpendingCategory.category}</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Accounts for <strong>{financialInsights.topSpendingCategory.percentage}%</strong> of your total expenses
                  </p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-lime-600 mb-3">This Month’s Trend</h4>
                  <div className="text-2xl font-bold text-lime-700 mb-2">{financialInsights.thisMonthTrend.trend === "Downward" ? "📉 Downward" : "📈 Upward"}</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Spending is <strong>{financialInsights.thisMonthTrend.percentageChange}% {financialInsights.thisMonthTrend.trend.toLowerCase()}</strong> than last month.
                  </p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-red-600 mb-3">Avg. Transaction Size</h4>
                  <div className="text-2xl font-bold text-red-700 mb-2">₹{financialInsights.avgTransactionSize.amount.toLocaleString()}</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Across <strong>{financialInsights.avgTransactionSize.transactionCount}</strong> transactions this month.
                  </p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-green-600 mb-3">Income vs Expense</h4>
                  <div className="text-2xl font-bold text-green-700 mb-2">{financialInsights.incomeVsExpense.ratio}</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Income is <strong>{financialInsights.incomeVsExpense.percentageHigher}% higher</strong> than total expenses.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No financial insights available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
