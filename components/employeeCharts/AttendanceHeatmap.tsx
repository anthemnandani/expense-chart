"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { apiService } from "@/lib/apiService";

const HighchartsReact = dynamic(() => import("highcharts-react-official"), { ssr: false });

const AttendanceHeatmap = () => {
  const [Highcharts, setHighcharts] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [days, setDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [chartData, setChartData] = useState([]);
  const { user } = useAuth()
  // -----------------------------
  // Load Highcharts modules
  // -----------------------------
  useEffect(() => {
    (async () => {
      const HC = (await import("highcharts")).default;
      const HCHeatmap = (await import("highcharts/modules/heatmap")).default;
      HCHeatmap(HC);
      setHighcharts(HC);
    })();
  }, []);

  // -----------------------------
  // Detect Dark Mode
  // -----------------------------
  useEffect(() => {
    const check = () => document.documentElement.classList.contains("dark");
    setIsDarkMode(check());
    const observer = new MutationObserver(() => setIsDarkMode(check()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // -----------------------------
  // Fetch & Remap Data
  // -----------------------------
  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        if (!user?.token) return;

        const json = await apiService.getAttendanceHeatmap(
          user.token,
          2025,
          12
        );

        if (!json) return;

        setDays(json.days);
        setTimeSlots(json.timeSlots);

        // Sort by date DESC
        const sortedByDate = [...json.data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        const uniqueSortedDates = [...new Set(sortedByDate.map(item => item.date))];
        const dateToX = Object.fromEntries(
          uniqueSortedDates.map((d, idx) => [d, idx])
        );

        const remapped = sortedByDate.map(item => ({
          ...item,
          x: dateToX[item.date],
        }));

        setChartData(remapped);
      } catch (err) {
        console.error("Heatmap Fetch Error:", err);
      }
    };

    fetchHeatmap();
  }, [user?.token]);

  const formatDateDMY = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const uniqueDates = chartData.length
    ? [...new Set(chartData.map(d => d.date))]
    : [];

  // -----------------------------
  // Highcharts Options (Expenses-style UI)
  // -----------------------------
  const options = {
    chart: {
      type: "heatmap",
      backgroundColor: "transparent",
      marginBottom: 50,
    },
    title: { text: "" },
    xAxis: {
      // categories: chartData.length ? [...new Set(chartData.map(d => d.date))] : [],
      categories: uniqueDates.map(d => formatDateDMY(d)),
      title: "",
      lineColor: isDarkMode ? "#444" : "#e2e8f0",
      labels: {
        style: {
          color: isDarkMode ? "#e2e8f0" : "#1f2937",
          fontWeight: "500",
          fontSize: "12px",
        },
      },
      tickLength: 0,
    },
    yAxis: {
      categories: timeSlots,
      title: "",
      reversed: true,
      lineColor: isDarkMode ? "#444" : "#e2e8f0",
      labels: {
        style: {
          color: isDarkMode ? "#e2e8f0" : "#1f2937",
          fontWeight: "500",
          fontSize: "12px",
        },
      },
      tickLength: 0,
    },
    colorAxis: {
      min: 0,
      max: 10,
      stops: [
        [0, isDarkMode ? "#0f172a" : "#e8f3ff"], // very low
        [0.10, isDarkMode ? "#264fa3" : "#a6ceff"], // small
        [0.20, isDarkMode ? "#2962d0" : "#85b7ff"], // low-medium
        [0.40, isDarkMode ? "#3b82f6" : "#78b3ff"], // medium
        [0.55, isDarkMode ? "#4a90ff" : "#559fff"], // medium-high
        [0.70, isDarkMode ? "#4e9bff" : "#468cff"], // high-medium
        [0.85, isDarkMode ? "#57b0ff" : "#1f6ed8"], // high
        [1, isDarkMode ? "#60a5fa" : "#1d4ed8"] // max → strong blue
      ]
    },
    legend: { enabled: false },
    tooltip: {
      useHTML: true,
      backgroundColor: isDarkMode ? "#1f2937" : "#fff",
      borderColor: isDarkMode ? "#4b5563" : "#ccc",
      style: { color: isDarkMode ? "#f9fafb" : "#111827" },
      formatter: function () {
        const point = this.point;
        const dates = [...new Set(chartData.map(d => d.date))];

        return `
    <div style="padding:6px 8px;">
      <b>${formatDateDMY(dates[point.x])}</b><br/>
      Time: ${timeSlots[point.y]}<br/>
      Attendance Count: <b>${point.value}</b>
    </div>`;
      },
    },
    series: [
      {
        name: "Attendance Heatmap",
        borderWidth: 2,
        borderColor: isDarkMode ? "#111827" : "#fff",
        data: chartData,
        dataLabels: {
          enabled: true,
          color: isDarkMode ? "#fff" : "#000",
          style: { textOutline: "none", fontWeight: "500" },
          formatter: function () {
            // Show value only if > 0
            return this.point.value > 0 ? this.point.value : "";
          }
        },
      },
    ],
  };

  // -----------------------------
  // Render Card
  // -----------------------------
  if (!Highcharts || chartData.length === 0) {
    return (
      <Card className="w-full shadow-md bg-white dark:bg-gray-900 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Attendance Heatmap
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Employee presence intensity based on 30-minute intervals
          </p>
        </CardHeader>
        <CardContent className="pt-2 flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-blue-600 border-dashed rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-md bg-white dark:bg-gray-900 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Attendance Heatmap
        </CardTitle>
        {/* <p className="text-sm text-gray-500 dark:text-gray-400">
          Employee presence intensity based on 30-minute intervals
        </p> */}
      </CardHeader>
      <CardContent className="pt-2">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>
    </Card>
  );
};

export default AttendanceHeatmap;