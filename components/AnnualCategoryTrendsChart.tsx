"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HighchartsReact = dynamic(() => import("highcharts-react-official"), { ssr: false });

const categories = ["Party", "Tea", "Water", "Other"];
const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const generateMockData = () => {
  const data: [number, number, number][] = [];
  for (let y = 0; y < categories.length; y++) {
    for (let x = 0; x < 12; x++) {
      let value = Math.floor(Math.random() * 1000);
      if (categories[y] === "Tea" && (x === 0 || x === 1)) value += 500;
      data.push([x, y, value]);
    }
  }
  return data;
};

export default function AnnualCategoryTrendsChart() {
  const [Highcharts, setHighcharts] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load Highcharts & required modules in the browser
  useEffect(() => {
    (async () => {
      const HC = (await import("highcharts")).default;
      const HCHeatmap = (await import("highcharts/modules/heatmap")).default;
      const HCAccessibility = (await import("highcharts/modules/accessibility")).default;
      const HCExporting = (await import("highcharts/modules/exporting")).default;

      HCHeatmap(HC);
      HCAccessibility(HC);
      HCExporting(HC);

      setHighcharts(HC);
    })();
  }, []);

  // Dark mode detection
  useEffect(() => {
    const check = () => document.documentElement.classList.contains("dark");
    setIsDarkMode(check());
    const observer = new MutationObserver(() => setIsDarkMode(check()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  if (!Highcharts) return <div>Loading chart...</div>;

  const options: Highcharts.Options = {
    chart: {
      type: "heatmap",
      plotBorderWidth: 1,
      backgroundColor: "transparent",
      height: 400,
    },
    title: {
      text: "Annual Category Trends (Heatmap)",
      style: {
        color: isDarkMode ? "#fff" : "#000",
        fontSize: "16px",
      },
    },
    xAxis: {
      categories: months,
      labels: { style: { color: isDarkMode ? "#ddd" : "#333" } },
      title: { text: "Months", style: { color: isDarkMode ? "#aaa" : "#444" } },
    },
    yAxis: {
      categories,
      title: { text: "Expense Categories", style: { color: isDarkMode ? "#aaa" : "#444" } },
      labels: { style: { color: isDarkMode ? "#ddd" : "#333" } },
    },
    colorAxis: {
      min: 0,
      minColor: isDarkMode ? "#1e3a8a" : "#dbeafe",
      maxColor: isDarkMode ? "#60a5fa" : "#1d4ed8",
    },
    legend: {
      align: "right",
      layout: "vertical",
      margin: 0,
      verticalAlign: "middle",
      symbolHeight: 200,
      itemStyle: { color: isDarkMode ? "#eee" : "#333" },
    },
    tooltip: {
      formatter: function () {
        const point = this.point as any;
        return `<b>${categories[point.y]}</b><br>${months[point.x]}: ₹${point.value}`;
      },
    },
    series: [
      {
        name: "Expenses",
        borderWidth: 1,
        borderColor: isDarkMode ? "#444" : "#fff",
        data: generateMockData(),
        dataLabels: { enabled: true, color: isDarkMode ? "#fff" : "#000" },
        type: "heatmap",
      },
    ],
    credits: { enabled: false },
  };

  return (
    <Card className="col-span-full shadow-md border-0 bg-white dark:bg-gray-800">
      <CardHeader className="flex justify-between lg:flex-row flex-col">
        <CardTitle className="text-lg">Expense Heatmap</CardTitle>
        <div>
          <select
            className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs text-gray-800 dark:text-white rounded-md px-2 py-1"
            defaultValue={2025}
          >
            {[2023, 2024, 2025].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>
    </Card>
  );
}
