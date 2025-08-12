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
  CardContent,
} from "@/components/ui/card"
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiService } from "@/lib/apiService";

interface MonthlyRadarChart {
  years: number[];
}

export const MonthlyRadarChart: React.FC<MonthlyRadarChart> = ({ years }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedYear, setSelectedYear] = useState(2025);
  const [chartData, setChartData] = useState<any[]>([]);
  const { user } = useAuth()
  const groupId = user?.groupId

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
    if (!groupId) return
    const fetchData = async () => {
      try {
        const data = await apiService.getYearlyExpense(groupId, selectedYear);
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const monthlyMap: Record<string, { income: number; expenses: number }> = {};
        months.forEach((m) => {
          monthlyMap[m] = { income: 0, expenses: 0 };
        });

        data.forEach((item) => {
          const monthName = months[parseInt(item.month) - 1];
          monthlyMap[monthName].income += Number(item.totalCredit || 0);
          monthlyMap[monthName].expenses += Number(item.totalDebit || 0);
        });


        const transformedData = months.map((month) => ({
          month,
          income: monthlyMap[month].income,
          expenses: monthlyMap[month].expenses,
        }));

        setChartData(transformedData);
      } catch (err) {
        console.error("Error loading radar chart data:", err);
      }
    };

    fetchData();
  }, [selectedYear, groupId]);

  return (
    <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 lg:col-span-4 col-span-1">
      <CardHeader className="pb-2 flex flex-col lg:flex-row justify-between gap-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
            Monthly Credit vs Debit
          </CardTitle>
        </div>
        <div className="flex gap-2 items-center">
          <select
            className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs text-gray-800 dark:text-white rounded-md px-2 py-1"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent className="h-[450px] p-6">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="75%"
            data={chartData}
          >
            <PolarGrid strokeDasharray="4 4" />
            <PolarAngleAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 11000]} tick={{ fill: "#9ca3af", fontSize: 11 }} />
            <Tooltip
              wrapperStyle={{
                backgroundColor: isDarkMode ? "#1f2937" : "#fff",
                borderRadius: 8,
                color: isDarkMode ? "#f9fafb" : "#111827"
              }}
              contentStyle={{
                fontSize: 12,
                backgroundColor: isDarkMode ? "#1f2937" : "#fff",
                border: "none"
              }}
            />
            <Legend verticalAlign="bottom" iconType="circle" height={36} formatter={(value) => (
              <span style={{ color: isDarkMode ? "#f9fafb" : "#111827" }}>
                {value}
              </span>
            )} />
            <Radar
              name="Credit"
              dataKey="income"
              stroke="#60d394"
              fill="#60d394"
              fillOpacity={0.4}
            />
            <Radar
              name="Debit"
              dataKey="expenses"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default MonthlyRadarChart;