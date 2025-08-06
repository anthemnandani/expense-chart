"use client";

import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

if (typeof HighchartsMore === "function") HighchartsMore(Highcharts);
if (typeof SolidGauge === "function") SolidGauge(Highcharts);

type CategoryData = {
  expenseDescType: string;
  totalExpenses: number;
};

export default function GaugeMultipleKPIChart() {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("8"); // August
  const [selectedYear, setSelectedYear] = useState(2025);
  const groupId = 4;

  const colors = ["#0088fe", "#00c49f", "#a259ff", "#ff7300"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/expense-monthswise?groupId=${groupId}&year=${selectedYear}&months=${selectedMonth}`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        // Filter out empty category names
        setCategoryData(json.filter((d: CategoryData) => d.expenseDescType?.trim() !== ""));
      } catch (error) {
        console.error("Error loading category data:", error);
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear]);

  const maxValue = Math.max(...categoryData.map((item) => item.totalExpenses), 1);
  const trackColors = colors.map((color) => Highcharts.color(color).setOpacity(0.15).get());

  const chartOptions: Highcharts.Options = {
     accessibility: { enabled: false },
    chart: {
      type: "solidgauge",
      height: "110%",
      backgroundColor: "transparent",
      spacingBottom: 60,
    },
    title: { text: undefined },
    tooltip: {
      borderWidth: 0,
      backgroundColor: "#fff",
      borderRadius: 5,
      shadow: true,
      useHTML: true,
      pointFormatter: function () {
        const percent = ((this.y / maxValue) * 100).toFixed(1);
        return `
          <div style="text-align: center;">
            <div style="display: flex; justify-content: space-between;">
              <div style="font-weight: bold; color: ${this.color}">${this.series.name}</div>
              <div>₹${this.y.toLocaleString()}</div>
            </div>
            <div style="color: #666;">${percent}% of max</div>
          </div>
        `;
      },
      positioner: function () {
        return {
          x: this.chart.chartWidth / 2 - this.label.width / 2,
          y: this.chart.plotHeight / 2 - 50,
        };
      },
    },
    pane: {
      startAngle: 0,
      endAngle: 360,
      background: categoryData.map((_, i) => ({
        outerRadius: `${105 - i * 22}%`,
        innerRadius: `${85 - i * 22}%`,
        backgroundColor: trackColors[i % trackColors.length],
        borderWidth: 0,
      })),
    },
    yAxis: {
      min: 0,
      max: maxValue,
      lineWidth: 0,
      tickPositions: [],
    },
    plotOptions: {
      solidgauge: {
        dataLabels: { enabled: false },
        linecap: "round",
        stickyTracking: true,
        rounded: true,
      },
    },
    series: categoryData.map((item, i) => ({
      type: "solidgauge",
      name: item.expenseDescType,
      data: [
        {
          color: colors[i % colors.length],
          radius: `${105 - i * 22}%`,
          innerRadius: `${85 - i * 22}%`,
          y: item.totalExpenses,
        },
      ],
    })),
    credits: {
      enabled: true,
      position: { align: "center", verticalAlign: "bottom", y: -30 },
      text: `Total: ₹${categoryData.reduce((sum, d) => sum + d.totalExpenses, 0).toLocaleString()}`,
    },
  };

  return (
    <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 col-span-6">
      <CardHeader className="pb-2 flex justify-between flex-col lg:flex-row">
        <div>
          <CardTitle className="text-gray-800 dark:text-white">Monthly Expenses by Category</CardTitle>
          {/* <CardDescription className="text-gray-500 dark:text-gray-400">Analyze trends</CardDescription> */}
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
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
            {[2023, 2024, 2025].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-4 grid grid-cols-5">
        <div className="col-span-4">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
        <div className="col-span-1 flex flex-col items-center justify-center gap-6">
          {categoryData.map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colors[i] }}></div>
              <span className="text-xs text-gray-600 dark:text-gray-300">{item.expenseDescType}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}