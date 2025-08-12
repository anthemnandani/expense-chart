"use client";

import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { apiService } from "@/lib/apiService";
import { ExpenseData } from "@/lib/types";

interface AreaYearlyExpenseChart {
  years: number[];
}

export const AreaYearlyExpenseChart: React.FC<AreaYearlyExpenseChart> = ({
  years
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedYear, setSelectedYear] = useState(2025);
  const [monthlyExpenseData, setMonthlyExpenseData] = useState<ExpenseData[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const { user } = useAuth();
  const groupId = user?.groupId;

  useEffect(() => {
    const checkDarkMode = () =>
      document.documentElement.classList.contains("dark")

    setIsDarkMode(checkDarkMode())

    const observer = new MutationObserver(() => {
      setIsDarkMode(checkDarkMode())
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!groupId) return;
      try {
        const data = await apiService.getYearlyExpense(groupId, selectedYear);
        const categoryExpenses = await apiService.getCategoryExpenses(groupId, selectedYear);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // ✅ Ensure all 12 months exist, filling missing with zeros
        const transformed = months.map((m, idx) => {
          const found = data.find((item: any) => parseInt(item.month, 10) - 1 === idx);
          return {
            month: m,
            totalDebit: found?.totalDebit || 0,
            totalCredit: found?.totalCredit || 0,
            netBalance: (found?.totalCredit || 0) - (found?.totalDebit || 0),
          };
        });

        // ✅ Get unique categories, filter out empty/undefined
        const uniqueCategories = Array.from(
          new Set(categoryExpenses.map((e: any) => e.expenseDescType).filter(Boolean))
        );

        // ✅ Month-wise category map with dynamic categories
        const categoryMap = months.map((month, idx) => {
          const monthData = categoryExpenses.filter(
            (e: any) => parseInt(e.month, 10) - 1 === idx
          );
          return uniqueCategories.reduce(
            (acc, cat) => ({
              ...acc,
              [cat]: monthData.find((d: any) => d.expenseDescType === cat)?.totalExpenses || 0,
            }),
            { month }
          );
        });

        setMonthlyExpenseData(transformed);
        setCategoryData(categoryMap);
      } catch (err) {
        console.error("Error fetching yearly expense data:", err);
      }
    };

    fetchData();
  }, [selectedYear, groupId]);

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross", crossStyle: { color: "#999" } },
      backgroundColor: isDarkMode ? "#374151" : "#fff",
      borderColor: isDarkMode ? "#4b5563" : "#e5e7eb",
      textStyle: { color: isDarkMode ? "#f9fafb" : "#111827" },
      formatter: (params: any) => {
        if (!params || !params.length) return "";
        const monthIndex = params[0]?.dataIndex ?? 0;

        if (!monthlyExpenseData[monthIndex]) return "";

        const catInfo = categoryData[monthIndex]
          ? Object.entries(categoryData[monthIndex])
            .filter(([key]) => key !== "month")
            .map(([cat, val]) => `<div style=color:${isDarkMode ? "#d1d5db" : "#666"};>${cat}: ₹${val}</div>`)
            .join("")
          : "";

        const seriesInfo = params
          .map(
            (p: any) =>
              `<div><span style="color:${p.color};font-weight:600;">●</span> ${p.seriesName}: ₹${p.value}</div>`
          )
          .join("");

        return `<strong>${monthlyExpenseData[monthIndex].month}</strong><br/>${seriesInfo}<hr/>${catInfo}`;
      },
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
        data: monthlyExpenseData.map((d) => d.month),
        axisPointer: { type: "shadow" },
        axisLabel: { color: isDarkMode ? "#d1d5db" : "#374151" },
        axisLine: { lineStyle: { color: isDarkMode ? "#6b7280" : "#9ca3af" } },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "Amount (₹)",
        axisLabel: { formatter: "₹{value}", color: isDarkMode ? "#d1d5db" : "#374151" },
        splitLine: { lineStyle: { color: isDarkMode ? "#4b5563" : "#e5e7eb" } },
      },
      {
        type: "value",
        name: "Net Balance",
        axisLabel: { formatter: "₹{value}", color: isDarkMode ? "#d1d5db" : "#374151" },
        splitLine: { lineStyle: { color: isDarkMode ? "#4b5563" : "#e5e7eb" } },
      },
    ],
    series: [
      {
        name: "Expenses",
        type: "bar",
        tooltip: { valueFormatter: (v: any) => `₹${v}` },
        data: monthlyExpenseData.map((d) => d.totalDebit),
        itemStyle: { color: "#2563eb" },
      },
      {
        name: "Credits",
        type: "bar",
        tooltip: { valueFormatter: (v: any) => `₹${v}` },
        data: monthlyExpenseData.map((d) => d.totalCredit),
        itemStyle: { color: "#22c55e" },
      },
      {
        name: "Net Balance",
        type: "line",
        yAxisIndex: 1,
        tooltip: { valueFormatter: (v: any) => `₹${v}` },
        data: monthlyExpenseData.map((d) => d.netBalance),
        itemStyle: { color: "#f59e0b" },
        smooth: true,
      },
    ],
  };

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
        <ReactECharts option={option} style={{ height: "400px" }} />
      </CardContent>
    </Card>
  );
}

export default AreaYearlyExpenseChart;