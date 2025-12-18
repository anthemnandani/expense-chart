"use client";
import React, { useEffect, useState, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { CardHeader, CardTitle } from "../ui/card";
import { useAuth } from "@/context/auth-context";

export default function LeaveChart({ years }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);
  const rootRef = useRef(null);

  const { user } = useAuth();

  // Fetch data dynamically
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://employee-dashboard-backend-api.vercel.app/api/leave-report/${selectedYear}?token=${encodeURIComponent(user?.token)}`
      );
      const fetchedData = await res.json();
      setData(fetchedData);
    } catch (err) {
      console.error("Error fetching leave data:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  useEffect(() => {
    if (!data || !chartRef.current || !data.employees.length) return;

    // Dispose previous root if exists
    if (rootRef.current) {
      rootRef.current.dispose();
    }

    // Create root
    let root = am5.Root.new(chartRef.current);
    rootRef.current = root;

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: false,
        wheelX: "panX",
        wheelY: "none",
        paddingLeft: 0,
        layout: root.verticalLayout,
      })
    );

    // Add scrollbar if needed
    // chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));

    // Create axes
    let xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 70,
      minorGridEnabled: true,
    });

    xRenderer.labels.template.setAll({
      rotation: -40,
      fontSize: 11,
      fontWeight: "500",
      fill: am5.color("#333"),
    });

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "category",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {
          themeTags: ["axis"],
          animationDuration: 200,
        }),
      })
    );

    xRenderer.grid.template.setAll({ location: 1 });

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0.1,
        }),
        title: am5.Label.new(root, { text: "Leaves Count" }),
      })
    );

    // Prepare data
    let chartData = data.employees.map((emp) => ({
      category: emp.name,
      fullLeaves: Math.min(emp.fullLeaves, emp.allowedLeaves),
      exceededLeaves: emp.fullLeaves > emp.allowedLeaves ? emp.fullLeaves - emp.allowedLeaves : 0,
      shortLeaves: emp.shortLeaves,
      allowed: emp.allowedLeaves,
    }));

    xAxis.data.setAll(chartData);

    // Full Leaves series (stacked)
    let seriesFull = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Full Leaves",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "fullLeaves",
        categoryXField: "category",
        stacked: true,
        tooltip: am5.Tooltip.new(root, {
          labelText: "Full: {valueY}",
        }),
      })
    );

    seriesFull.columns.template.setAll({
      width: am5.percent(80),
      tooltipY: 0,
      strokeOpacity: 0,
      fill: am5.color("#3b82f6"),
    });

    seriesFull.data.setAll(chartData);

    // Exceeded Leaves series (stacked on full)
    let seriesExceeded = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Exceeded Leaves",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "exceededLeaves",
        categoryXField: "category",
        stacked: true,
        tooltip: am5.Tooltip.new(root, {
          labelText: "Exceeded: {valueY}",
        }),
      })
    );

    seriesExceeded.columns.template.setAll({
      width: am5.percent(80),
      tooltipY: 0,
      strokeOpacity: 0,
      fill: am5.color("#ef4444"),
    });

    seriesExceeded.data.setAll(chartData);

    // Short Leaves series (not stacked)
    let seriesShort = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Short Leaves",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "shortLeaves",
        categoryXField: "category",
        clustered: false,
        tooltip: am5.Tooltip.new(root, {
          labelText: "Short: {valueY}",
        }),
      })
    );

    seriesShort.columns.template.setAll({
      width: am5.percent(50),
      tooltipY: 0,
      strokeOpacity: 0,
      fill: am5.color("#10b981"),
    });

    seriesShort.data.setAll(chartData);

    // Custom tooltip for shared info
    let tooltip = am5.Tooltip.new(root, {
      animationDuration: 200,
    });

    chart.set("tooltip", tooltip);

    // Cursor
    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    // Legend
    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 20,
      })
    );

    legend.data.setAll([seriesFull, seriesExceeded, seriesShort]);
    legend.labels.template.setAll({ fontWeight: "500", fill: am5.color("#111") });

    // Animate
    chart.appear(1000, 100);
    seriesFull.appear(1000);
    seriesExceeded.appear(1000);
    seriesShort.appear(1000);

    // Cleanup
    return () => {
      root.dispose();
    };
  }, [data, selectedYear]);

  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl shadow p-6 flex items-center justify-center h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full bg-white rounded-2xl shadow p-6 flex items-center justify-center h-[400px] text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow p-6">
      <CardHeader className="flex justify-between lg:flex-row flex-col">
        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
          Employees Yearly Leave Data (Allowed Leaves: {data.totalAllowedLeaves})
        </CardTitle>
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
      <div ref={chartRef} style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
}