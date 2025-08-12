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
import { StackedBarCategoryChart } from "./StackedBarCategoryChart";

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
  const [years, setYears] = useState<number[]>([]);

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

  useEffect(() => {
    const fetchYears = async () => {
      if (!groupId) return;
      const fetchedYears = await apiService.getAvailableYears(groupId);
      setYears(fetchedYears);
      console.log("years: ", years);
      if (fetchedYears.length > 0) setSelectedYear(fetchedYears[fetchedYears.length - 1]); // default to latest year
    };
    fetchYears();
  }, [groupId]);

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
            {years.map((y) => (
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
          <AreaYearlyExpenseChart years={years} />
          <HighLevelPieChart years={years} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NetBalanceChart years={years} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <TreeGraphChart years={years} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <MonthlyRadarChart years={years} />
          <CategoryWiseExpenseChart years={years} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <DailyExpenseChart years={years} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <StackedBarCategoryChart years={years} />
          <AdvancedPolarChart years={years} />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <AnnualCategoryTrendsChart years={years} />
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
                {/* Highest Debit Month */}
                <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-3">Highest Debit Month</h4>
                  <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-500 mb-2">
                    {financialInsights.highestDebitMonth.month}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Highest expenses of ₹{parseFloat(financialInsights.highestDebitMonth.amount).toFixed(2)}
                  </p>
                </div>

                {/* Lowest Debit Month */}
                <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-sky-600 dark:text-sky-500 mb-3">Lowest Debit Month</h4>
                  <div className="text-2xl font-bold text-sky-700 dark:text-sky-500 mb-2">
                    {financialInsights.lowestDebitMonth.month}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Lowest expenses of ₹{parseFloat(financialInsights.lowestDebitMonth.amount).toFixed(2)}
                  </p>
                </div>

                {/* Avg Debit */}
                <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-red-600 mb-3">Avg. Debit</h4>
                  <div className="text-2xl font-bold text-red-600 mb-2">
                    ₹{parseFloat(financialInsights.avgDebit.amount).toFixed(2)}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Across <strong>{financialInsights.avgDebit.transactionCount}</strong> debit transactions this month.
                  </p>
                </div>

                {/* Highest Credit Month */}
                <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-purple-700 dark:text-purple-600 mb-3">Highest Credit Month</h4>
                  <div className="text-2xl font-bold text-purple-800 dark:text-purple-600 mb-2">
                    {financialInsights.highestCreditMonth.month}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Highest credit of ₹{parseFloat(financialInsights.highestCreditMonth.amount).toFixed(2)}
                  </p>
                </div>

                {/* Lowest Credit Month */}
                <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-orange-600 dark:text-orange-500 mb-3">Lowest Credit Month</h4>
                  <div className="text-2xl font-bold text-orange-700 dark:text-orange-500 mb-2">
                    {financialInsights.lowestCreditMonth.month}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Lowest credit of ₹{parseFloat(financialInsights.lowestCreditMonth.amount).toFixed(2)}
                  </p>
                </div>

                {/* Avg Credit */}
                <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-red-500 mb-3">Avg. Credit</h4>
                  <div className="text-2xl font-bold text-red-500 mb-2">
                    ₹{parseFloat(financialInsights.avgCredit.amount).toFixed(2)}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Across <strong>{financialInsights.avgCredit.transactionCount}</strong> credit transactions this month.
                  </p>
                </div>

                {/* This Month’s Trend */}
                <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-lime-600 dark:text-lime-500 mb-3">This Month’s Trend</h4>
                  <div className="text-2xl font-bold text-lime-700 dark:text-lime-500 mb-2">
                    {financialInsights.thisMonthTrend.trend === "Downward" ? "📉 Downward" : "📈 Upward"}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Spending is <strong>{parseFloat(financialInsights.thisMonthTrend.percentageChange).toFixed(2)}% {financialInsights.thisMonthTrend.trend.toLowerCase()}</strong> than last month.
                  </p>
                </div>

                {/* Top Spending Category */}
                <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-orange-700 dark:text-orange-500 mb-3">Top Spending Category</h4>
                  <div className="text-2xl font-bold text-orange-800 dark:text-orange-500 mb-2">
                    {financialInsights.topSpendingCategory.category}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Accounts for <strong>{parseFloat(financialInsights.topSpendingCategory.percentage).toFixed(2)}%</strong> of your total expenses
                  </p>
                </div>

                {/* Income vs Expense */}
                <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-green-600 dark:text-green-400 mb-3">Income vs Expense</h4>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
                    {financialInsights.incomeVsExpense.ratio}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Credits is <strong>{parseFloat(financialInsights.incomeVsExpense.percentageHigher).toFixed(2)}% higher</strong> than total debits.
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
