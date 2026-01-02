"use client";
import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { apiService } from "@/lib/apiService";
import { useAuth } from "@/context/auth-context";
import { ArrowBigDown, X } from "lucide-react";
import AttendanceTimelineLineChart from "./AttendanceTimelineLineChart";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function YearlyLateMatrixChart({ years }) {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // New states for timeline chart
  const [timelineParams, setTimelineParams] = useState({ employeeId: null, month: null, year: null });
  const [showTimeline, setShowTimeline] = useState(false);

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

  // Handle click on scatter point
  const handleChartClick = (params: any) => {
    const { data } = params;
    const monthStr = data[0];
    const empName = data[1];
    const lateDays = data[2];

    if (lateDays === 0) return; // Optionally skip if no late days

    const monthNum = MONTHS.indexOf(monthStr) + 1;
    const emp = chartData.find(e => toTitleCase(e.Name) === empName);

    if (emp) {
      setTimelineParams({ employeeId: emp.EmployeeId, month: monthNum, year: selectedYear });
      setShowTimeline(true);
    }
  };

  /* ---------------- CHART OPTION ---------------- */
  const option = {
    grid: {
      top: 70,
      left: 20,
      right: 20,
      bottom: 15,
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: MONTHS,
      splitLine: { show: true },
      axisLabel: {
        fontSize: 11,
        rotate: 0,
        color: "#111"
      },
      axisTick: { show: false },
      axisLine: { show: false }
    },
    yAxis: {
      type: "category",
      data: employees,
      splitLine: { show: true },
      axisLabel: {
        fontSize: 11,
        color: "#111"
      },
      axisTick: { show: false },
      axisLine: { show: false }
    },
    tooltip: {
      backgroundColor: "#fff",
      borderWidth: 0,
      textStyle: { color: "#222" },
      formatter: (p: any) => `
        <div style="padding: 0px 5px">
      <div style="font-size:12px; font-weight:600;">
        ${p.value[1]}
      </div>
      <div style="font-size:11px;">
        ${p.value[0]}
      </div>
      <div style="font-size:11px;">
        Late Days: <b>${p.value[2]}
      </div>
    </div>
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

  return (
    <>
      <div className="w-full p-5 rounded-xl bg-white dark:bg-[#0b1220] shadow-md">
        <div className="pl-2 pt-1 flex justify-between lg:flex-row flex-col">
          <div className="text-gray-800 text-md font-semibold dark:text-white">
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
          <ReactECharts
            option={option}
            style={{ height: 550 }}
            onEvents={{ click: handleChartClick }}
          />
        )}
      </div>

      {/* Modal for Timeline Chart */}
      {showTimeline && timelineParams.employeeId && (
        <div className="fixed inset-0 z-50 top-[-20px] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-[#0b1220] rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            {/* <button
              onClick={() => setShowTimeline(false)}
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button> */}

            {/* Header with Arrow */}
            {/* <div className="flex justify-center py-4 border-b border-gray-200 dark:border-gray-700">
              <ArrowBigDown className="h-6 w-6 text-gray-500" />
            </div> */}

            {/* Timeline Chart */}
            <div className="">
              <AttendanceTimelineLineChart
                years={years}
                employeeId={timelineParams.employeeId}
                selectedYear={timelineParams.year}
                selectedMonth={timelineParams.month}
                onClose={() => setShowTimeline(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}