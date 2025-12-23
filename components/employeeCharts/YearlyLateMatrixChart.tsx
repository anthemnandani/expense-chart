"use client";

import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { apiService } from "@/lib/apiService";
import { useAuth } from "@/context/auth-context";
import { CardHeader, CardTitle } from "../ui/card";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function YearlyLateMatrixChart({ years }) {
    const { user } = useAuth();

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const toTitleCase = (name: string) =>
        name
            .toLowerCase()
            .split(" ")
            .filter(Boolean)
            .map(w => w[0].toUpperCase() + w.slice(1))
            .join(" ");

    /* ---------------- FETCH API HERE ---------------- */
    const fetchYearlyLateData = async () => {
        try {
            setLoading(true);

            const data = await apiService.getYealyLateEmployees(
                selectedYear,
                user.token
            );

            setChartData(data?.employees || []);
        } catch (err) {
            console.error("Yearly late error:", err);
            setChartData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.token) {
            fetchYearlyLateData();
        }
    }, [selectedYear, user?.token]);

    /* ---------------- PREPARE MATRIX DATA ---------------- */

    const employees = chartData.map(e => toTitleCase(e.Name));

    const matrixData: any[] = [];

    chartData.forEach(emp => {
        MONTHS.forEach(month => {
            matrixData.push([
                month,
                toTitleCase(emp.Name),
                emp.monthlyLateDays?.[month] ?? 0
            ]);
        });
    });

    /* ---------------- CHART OPTION ---------------- */

   const option = {
  grid: {
    top: 80,
    left: 30,
    right: 30,
    bottom: 20,
    containLabel: true
  },

  xAxis: {
    type: "category",
    data: MONTHS,
    splitLine: { show: true },
    axisLabel: {
      fontSize: 11,
      rotate: 30,
      color: "#94a3b8"
    },
    axisTick: { show: false },
    axisLine: { show: false }
  },

  yAxis: {
    type: "category",
    data: employees,
    splitLine: { show: true },
    axisLabel: {
      fontSize: 12,
      color: "#94a3b8"
    },
    axisTick: { show: false },
    axisLine: { show: false }
  },

  tooltip: {
    backgroundColor: "#fff",
    borderWidth: 0,
    textStyle: { color: "#222" },
    formatter: (p: any) => `
      <b>${p.value[1]}</b><br/>
      ${p.value[0]}<br/>
      Late Days: <b>${p.value[2]}</b>
    `
  },

  visualMap: {
    min: 0,
    max: 20,
    orient: "horizontal",
    left: "center",
    top: 15,
    calculable: true,
    dimension: 2,
    text: ["High", "Low"],
    textStyle: {
      color: "#94a3b8"
    },
    inRange: {
      color: [
        "#e0f3f8",
        "#abd9e9",
        "#74add1",
        "#fdae61",
        "#f46d43",
        "#d73027"
      ],
      symbolSize: [14, 40]
    }
  },

  series: [
    {
      type: "scatter",
      data: matrixData,
      coordinateSystem: "cartesian2d",

      symbolSize: (val: number[]) => {
        if (val[2] === 0) return 10;
        return Math.min(val[2] * 3, 42);
      },

      itemStyle: {
        opacity: 0.95,
        borderColor: "#fff",
        borderWidth: 1
      },

      label: {
        show: true,
        formatter: (p: any) => (p.value[2] > 0 ? p.value[2] : ""),
        color: "#111",
        fontSize: 11,
        fontWeight: 500
      }
    }
  ]
};

    if (loading) {
        return <div className="h-[550px] flex items-center justify-center">Loading...</div>;
    }

    // return <ReactECharts option={option} style={{ height: 550 }} />;
    return <div className="w-full p-5 rounded-xl bg-white dark:bg-[#0b1220] shadow-md">
        <div className="pl-2 pt-1 flex justify-between lg:flex-row flex-col">
            <div className="text-gray-800 text-lg font-semibold dark:text-white">
                Employees Yearly Late Coming Summary
            </div>

            <div className="flex gap-2">
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
        </div>

        {loading ? (
            <div className="h-[350px] flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        ) : (
            <ReactECharts option={option} style={{ height: 550 }} />
        )}
    </div>;
}