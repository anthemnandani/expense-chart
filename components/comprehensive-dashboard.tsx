"use client"

import dynamic from "next/dynamic";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import MonthlyRadarChart from "./MonthlyRadarChart"
import { DailyExpenseChart } from "./DailyExpenseChart"
import UniqueStatCards from "./UniqueStatCards";
const AreaYearlyExpenseChart = dynamic(() => import("./AreaYearlyExpenseChart"), { ssr: false });
const CategoryWiseExpenseChart = dynamic(() => import("./CategoryWiseExpenseChart"), { ssr: false });
const GaugeMultipleKPIChart = dynamic(() => import("./GaugeMultipleKPIChart"), { ssr: false });
const HighLevelPieChart = dynamic(() => import("./HighLevelPieChart"), { ssr: false });
const NetBalanceChart = dynamic(() => import("./NetBalanceChart"), { ssr: false });
const AnnualCategoryTrendsChart = dynamic(() => import("./AnnualCategoryTrendsChart"), { ssr: false });
const TreeGraphChart = dynamic(() => import("./ExpenseTreeChart"), { ssr: false });
const AdvancedPolarChart = dynamic(() => import("./AdvancedPolarChart"), { ssr: false });

export default function ComprehensiveDashboard() {
  return (
    <div className="space-y-6">
      <UniqueStatCards />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Best Performing Month */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h4 className="font-semibold text-emerald-700 mb-3">Best Performing Month</h4>
              <div className="text-2xl font-bold text-emerald-800 mb-2">January</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Highest savings rate at <strong>39.7%</strong> with ₹2,397 saved
              </p>
            </div>

            {/* Lowest Income Month */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h4 className="font-semibold text-sky-600 mb-3">Lowest Income Month</h4>
              <div className="text-2xl font-bold text-sky-700 mb-2">July</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Only ₹3,000 earned. Consider boosting income.
              </p>
            </div>

            {/* Top Spending Category */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h4 className="font-semibold text-orange-700 mb-3">Top Spending Category</h4>
              <div className="text-2xl font-bold text-orange-800 mb-2">Tea</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Accounts for <strong>74.5%</strong> of your total expenses
              </p>
            </div>

            {/* Monthly Trend Indicator */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h4 className="font-semibold text-lime-600 mb-3">This Month’s Trend</h4>
              <div className="text-2xl font-bold text-lime-700 mb-2">📉 Downward</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Spending is <strong>18% lower</strong> than last month.
              </p>
            </div>

            {/* Average Transaction Size */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h4 className="font-semibold text-red-600 mb-3">Avg. Transaction Size</h4>
              <div className="text-2xl font-bold text-red-700 mb-2">₹212</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Across <strong>145</strong> transactions this month.
              </p>
            </div>

            {/* Income-to-Expense Ratio */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h4 className="font-semibold text-green-600 mb-3">Income vs Expense</h4>
              <div className="text-2xl font-bold text-green-700 mb-2">1.3 : 1</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Income is <strong>30% higher</strong> than total expenses.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

