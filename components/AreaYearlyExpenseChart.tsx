"use client";

import React, { useEffect, useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { apiService } from "@/lib/apiService";
import { ExpenseData } from "@/lib/types";

interface AreaYearlyExpenseChart {
  years: number[];
  currency: string;
}

export const AreaYearlyExpenseChart: React.FC<AreaYearlyExpenseChart> = ({
  years,
  currency
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyExpenseData, setMonthlyExpenseData] = useState<ExpenseData[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // track loading
  const { user } = useAuth();
  const groupId = user?.groupId;

  useEffect(() => {
    const checkDarkMode = () =>
      document.documentElement.classList.contains("dark");

    setIsDarkMode(checkDarkMode());

    const observer = new MutationObserver(() => {
      setIsDarkMode(checkDarkMode());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!groupId) {
        setLoading(false);
        setMonthlyExpenseData([]);
        setCategoryData([]);
        return;
      }
      setLoading(true);
      try {
        const data = await apiService.getYearlyExpense(groupId, selectedYear);
        const categoryExpenses = await apiService.getCategoryExpenses(groupId, selectedYear);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Transform monthly expense data
        const transformed = months.map((m, idx) => {
          const found = data.find((item: any) => parseInt(item.month, 10) - 1 === idx);
          return {
            month: m,
            totalDebit: found?.totalDebit || 0,
            totalCredit: found?.totalCredit || 0,
            netBalance: (found?.totalCredit || 0) - (found?.totalDebit || 0),
          };
        });

        // Optimized category mapping: Group by month once
        const groupedByMonth: Record<number, Record<string, number>> = categoryExpenses.reduce((acc, e: any) => {
          const monthIdx = parseInt(e.month, 10) - 1;
          if (!acc[monthIdx]) acc[monthIdx] = {};
          if (!acc[monthIdx][e.expenseDescType]) acc[monthIdx][e.expenseDescType] = 0;
          acc[monthIdx][e.expenseDescType] += e.totalExpenses;
          return acc;
        }, {} as Record<number, Record<string, number>>);

        const uniqueCategories = Array.from(
          new Set(categoryExpenses.map((e: any) => e.expenseDescType).filter(Boolean))
        );

        const categoryMap = months.map((month, idx) => {
          const monthCats = groupedByMonth[idx] || {};
          return uniqueCategories.reduce(
            (acc, cat) => ({
              ...acc,
              [cat]: monthCats[cat] || 0,
            }),
            { month }
          );
        });

        setMonthlyExpenseData(transformed);
        setCategoryData(categoryMap);
      } catch (err) {
        console.error("Error fetching yearly expense data:", err);
        setMonthlyExpenseData([]);
        setCategoryData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear, groupId]);

  // Memoize the formatter function to avoid recreating it on every render
  const tooltipFormatter = useMemo(() => {
    return (params: any) => {
      if (!params || !params.length) return "";
      const monthIndex = params[0]?.dataIndex ?? 0;
      if (!monthlyExpenseData[monthIndex]) return "";

      const catInfo = categoryData[monthIndex]
        ? Object.entries(categoryData[monthIndex])
            .filter(([key]) => key !== "month")
            .map(([cat, val]) => `<div style="color:${isDarkMode ? "#d1d5db" : "#666"};">${cat}: ${currency}${val}</div>`)
            .join("")
        : "";

      const seriesInfo = params
        .map(
          (p: any) =>
            `<div><span style="color:${p.color};font-weight:600;">●</span> ${p.seriesName}: ${currency}${p.value}</div>`
        )
        .join("");

      return `<strong>${monthlyExpenseData[monthIndex].month}</strong><br/>${seriesInfo}<hr/>${catInfo}`;
    };
  }, [monthlyExpenseData, categoryData, isDarkMode, currency]);

  // Memoize series data to avoid recomputing on every render
  const expensesData = useMemo(() => monthlyExpenseData.map((d) => d.totalDebit), [monthlyExpenseData]);
  const creditsData = useMemo(() => monthlyExpenseData.map((d) => d.totalCredit), [monthlyExpenseData]);
  const netBalanceData = useMemo(() => monthlyExpenseData.map((d) => d.netBalance), [monthlyExpenseData]);
  const xAxisData = useMemo(() => monthlyExpenseData.map((d) => d.month), [monthlyExpenseData]);

  // Memoize the entire option object
  const option = useMemo(() => ({
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross", crossStyle: { color: "#999" } },
      backgroundColor: isDarkMode ? "#374151" : "#fff",
      borderColor: isDarkMode ? "#4b5563" : "#e5e7eb",
      textStyle: { color: isDarkMode ? "#f9fafb" : "#111827" },
      formatter: tooltipFormatter,
    },
    legend: {
      data: ["Expenses", "Credits", "Net Balance"],
      textStyle: { color: isDarkMode ? "#e5e7eb" : "#374151" },
      align: "right",
      layout: "vertical",
      margin: 0,
      verticalAlign: "middle",
    },
    xAxis: [
      {
        type: "category",
        data: xAxisData,
        axisPointer: { type: "shadow" },
        axisLabel: { color: isDarkMode ? "#d1d5db" : "#374151" },
        axisLine: { lineStyle: { color: isDarkMode ? "#6b7280" : "#9ca3af" } },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: `Amount (${currency})`,
        axisLabel: { formatter: (value: number) => `${currency}${value}`, color: isDarkMode ? "#d1d5db" : "#374151" },
        splitLine: { lineStyle: { color: isDarkMode ? "#4b5563" : "#e5e7eb" } },
      },
      {
        type: "value",
        name: "Net Balance",
        axisLabel: { formatter: (value: number) => `${currency}${value}`, color: isDarkMode ? "#d1d5db" : "#374151" },
        splitLine: { lineStyle: { color: isDarkMode ? "#4b5563" : "#e5e7eb" } },
      },
    ],
    series: [
      {
        name: "Expenses",
        type: "bar",
        tooltip: { valueFormatter: (v: any) => `${currency}${v}` },
        data: expensesData,
        itemStyle: { color: "#2563eb" },
      },
      {
        name: "Credits",
        type: "bar",
        tooltip: { valueFormatter: (v: any) => `${currency}${v}` },
        data: creditsData,
        itemStyle: { color: "#22c55e" },
      },
      {
        name: "Net Balance",
        type: "line",
        yAxisIndex: 1,
        tooltip: { valueFormatter: (v: any) => `${currency}${v}` },
        data: netBalanceData,
        itemStyle: { color: "#f59e0b" },
        smooth: true,
      },
    ],
  }), [tooltipFormatter, xAxisData, expensesData, creditsData, netBalanceData, isDarkMode, currency]);

  return (
    <Card className="shadow-lg border-0 bg-white col-span-1 lg:col-span-3 dark:bg-gray-800">
      <CardHeader className="flex justify-between lg:flex-row flex-col">
        <CardTitle className="text-lg font-semibold">Yearly Credit, Debit & Net Balance</CardTitle>
        <select
          className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs text-gray-800 dark:text-white rounded-md px-2 py-1"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[400px] flex items-center justify-center text-gray-500 dark:text-gray-400">
            Loading chart...
          </div>
        ) : monthlyExpenseData.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center text-gray-500 dark:text-gray-400">
            No data available for selected year.
          </div>
        ) : (
          <ReactECharts option={option} style={{ height: "400px" }} />
        )}
      </CardContent>
    </Card>
  );
}

export default AreaYearlyExpenseChart;