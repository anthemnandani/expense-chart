"use client";

import Image from "next/image";
import ReactECharts from "echarts-for-react";

export default function EmployeesDashboard() {
  const chartOptions = {
    title: { text: "Employees Growth (Last 6 Months)" },
    tooltip: {},
    xAxis: { data: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"] },
    yAxis: {},
    series: [
      {
        name: "Employees",
        type: "line",
        smooth: true,
        data: [20, 25, 28, 32, 36, 40],
      },
    ],
  };

  return (
    <div className="space-y-8 p-6">
      
      <h1 className="text-3xl font-bold">Employees Dashboard</h1>

      {/* Hero Section */}
      <div className="relative w-full h-64 rounded-xl overflow-hidden shadow">
        <Image
          src="/images/EmployeesManagement.jpg"
          alt="Employees"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h2 className="text-white text-3xl font-semibold">Manage Your Workforce Effectively</h2>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
        <ReactECharts option={chartOptions} style={{ height: 320 }} />
      </div>
    </div>
  );
}
