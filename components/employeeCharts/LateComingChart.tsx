"use client";

import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { CardHeader, CardTitle } from "../ui/card";
import { useAuth } from "@/context/auth-context";

const monthNames = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

export default function LateComingChart({ years }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState([]);
  const [monthName, setMonthName] = useState(monthNames[selectedMonth - 1]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth()
  // 🔥 Fetch data dynamically
  const fetchLateData = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://employee-dashboard-backend-api.vercel.app/api/attendance/late?year=${selectedYear}&month=${selectedMonth}&token=${encodeURIComponent(user?.token)}`
      );

      const data = await res.json();

      setMonthName(data.monthName || monthNames[selectedMonth - 1]);
      setChartData(data.employees || []);
    } catch (err) {
      console.error("Error fetching late data:", err);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLateData();
  }, [selectedMonth, selectedYear]);

  const names = chartData.map((e) => e.name);
  const lateValues = chartData.map((e) => e.lateDays);

  const option = {
    title: {
      text: undefined,
      left: "center",
      top: 10,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#fff",
      borderColor: "#ddd",
      textStyle: { color: "#333" }
    },
    grid: {
      left: "3%",
      right: "3%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: names,
      axisLabel: {
        rotate: 30,
        fontSize: 11
      }
    },
    yAxis: {
      type: "value",
      name: "Late Days"
    },
    series: [
      {
        name: `Late Days (${monthName})`,
        type: "bar",
        data: lateValues,
        itemStyle: {
          color: "#3b82f6",
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: "45%"
      }
    ]
  };

  return (
    <div className="w-full p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      <CardHeader className="pb-2 flex justify-between lg:flex-row flex-col">
        <div>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
            Employees Monthly Late Coming ({monthName} {selectedYear})
          </CardTitle>
        </div>

        {/* Month / Year dropdowns */}
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs rounded-md px-1 py-1"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(0, m - 1).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

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
      </CardHeader>

      {/* Loader */}
      {loading ? (
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <ReactECharts option={option} style={{ height: 400 }} />
      )}
    </div>
  );
}
