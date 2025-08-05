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
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { useEffect, useState } from "react";

interface ExpenseRecord {
  month: string;
  expenseDescType: string;
  totalExpenses: number;
}

export default function MonthlyRadarChart() {

  const [selectedYear, setSelectedYear] = useState(2025);
  const [chartData, setChartData] = useState<any[]>([]);
  const groupId = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/category-expenses?groupId=${groupId}&year=${selectedYear}`
        );
        if (!res.ok) throw new Error("Failed to fetch category expenses");
        const data: ExpenseRecord[] = await res.json();

        // Prepare monthly income & expense mapping
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
          // Assumption: "income" means positive values for some categories
          // Here we put all into expenses (since API is category-wise expense)
          monthlyMap[monthName].expenses += item.totalExpenses;
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
  }, [selectedYear]);

  return (
    <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 col-span-4">
      <CardHeader className="pb-2 flex justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
            Monthly Income vs Expenses
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
            Analyze trends across the year in a clean radial format
          </CardDescription>
        </div>
        <div className="flex gap-2 items-center">
          <select
            className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs text-gray-800 dark:text-white rounded-md px-2 py-1"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {[2025, 2024, 2023].map((year) => (
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
              wrapperStyle={{ backgroundColor: "#fff", borderRadius: 8 }}
              contentStyle={{ fontSize: 12 }}
            />
            <Legend verticalAlign="bottom" iconType="circle" height={36} />
            <Radar
              name="Income"
              dataKey="income"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.4}
            />
            <Radar
              name="Expenses"
              dataKey="expenses"
              stroke="#60d394"
              fill="#60d394"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}