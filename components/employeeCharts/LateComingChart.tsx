"use client";

import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { CardHeader, CardTitle } from "../ui/card";
import { useAuth } from "@/context/auth-context";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function LateComingLollipopChart({ years }) {
  const { user } = useAuth();

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );
  const [chartData, setChartData] = useState([]);
  const [monthName, setMonthName] = useState(
    monthNames[selectedMonth - 1]
  );
  const [loading, setLoading] = useState(true);

  const fetchLateData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://employee-dashboard-backend-api.vercel.app/api/attendance/late?year=${selectedYear}&month=${selectedMonth}&token=${encodeURIComponent(
          user?.token
        )}`
      );
      const data = await res.json();
      setChartData(data.employees || []);
      setMonthName(data.monthName || monthNames[selectedMonth - 1]);
    } catch (err) {
      console.error(err);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLateData();
  }, [selectedMonth, selectedYear]);

  // const names = chartData.map((e) => e.name);
  // const lateValues = chartData.map((e) => e.lateDays);
  const names = chartData.map((e) => e.Name);
  const lateValues = chartData.map((e) => e.LateDays);

  const option = {
    grid: {
      left: "7%",
      right: "7%",
      top: "10%",
      bottom: "0%",
      containLabel: true
    },

    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line", // changed from "shadow" to "line"
        lineStyle: {
          color: "#777",
          width: 0.8,
          type: "dashed" // optional: makes it dashed like a guide line
        }
      },
      backgroundColor: "#ffffff",
      // borderColor: "#6EC1F5",
      borderWidth: 1,
      padding: 10,
      textStyle: { color: "#111827", fontWeight: "bold" },
      formatter: function (params) {
        if (params.length === 0) return "";
        const dataIndex = params[0].dataIndex;
        const name = names[dataIndex];
        const value = lateValues[dataIndex];
        return `
      <div style="min-width:120px">
        <div style="font-weight:bold; margin-bottom:4px;">${name}</div>
        <div style="color:#6EC1F5; font-weight:normal;">Late Days: ${value}</div>
      </div>
    `;
      },
      extraCssText: "box-shadow: 0 4px 10px rgba(0,0,0,0.15); border-radius: 6px;"
    },

    xAxis: {
      type: "category",
      data: names,
      axisLabel: {
        rotate: 35,
        fontSize: 11,
        color: "#111827"
      },
      axisLine: {
        lineStyle: { color: "#e5e7eb" }
      },
      axisTick: { show: false }
    },

    yAxis: {
      type: "value",
      axisLabel: { color: "#6b7280" },
      splitLine: {
        lineStyle: { color: "#e5e7eb" }
      }
    },

    series: [
      // 🟦 STICK (vertical thin bar)
      {
        type: "bar",
        data: lateValues,
        barWidth: 2,
        itemStyle: {
          color: "#6EC1F5"
        },
        z: 1
      },

      // 🔵 LOLLIPOP HEAD (circle)
      {
        type: "scatter",
        data: lateValues,
        symbolSize: 10,
        itemStyle: {
          color: "#6EC1F5"
        },
        z: 2
      }
    ]
  };


  return (
    <div className="w-full p-5 rounded-2xl bg-white dark:bg-[#0b1220] shadow-xl">
      <CardHeader className="pb-3 flex justify-between lg:flex-row flex-col">
        <CardTitle className="text-gray-800 dark:text-white">
          Employees Monthly Late Coming
        </CardTitle>

        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(Number(e.target.value))}
            className="bg-gray-100 dark:bg-gray-800 text-xs rounded-md px-2 py-1"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="bg-gray-100 dark:bg-gray-800 text-xs rounded-md px-2 py-1"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </CardHeader>

      {loading ? (
        <div className="h-[350px] flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <ReactECharts option={option} style={{ height: 400 }} />
      )}
    </div>
  );
}
