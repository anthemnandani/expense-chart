"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function YearlyCategoryExpenseChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current!);

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const debitData = [3803, 3523, 4216, 3900, 9048, 5215, 3480, 0, 0, 0, 0, 0];
    const creditData = [6200, 2000, 5000, 4000, 9000, 4500, 3000, 0, 0, 0, 0, 0];

    chartInstance.setOption({
      title: {
        text: "Yearly Category-wise Expenses (INR)",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: "normal",
        },
      },
      tooltip: {
        trigger: "axis",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "5%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: months,
        boundaryGap: false,
        axisLine: { show: false },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        splitLine: { lineStyle: { type: "dashed" } },
      },
      series: [
        {
          name: "Debit",
          type: "line",
          data: debitData,
          smooth: true,
          lineStyle: {
            color: "#22c55e",
            width: 2,
          },
          itemStyle: {
            color: "#22c55e",
          },
          areaStyle: {
            color: "#22c55e78",
          },
        },
        {
          name: "Credit",
          type: "line",
          data: creditData,
          smooth: true,
          lineStyle: {
            color: "#3b82f6",
            width: 2,
          },
          itemStyle: {
            color: "#3b82f6",
          },
          areaStyle: {
            color: "#3b83f692",
          },
        },
      ],
    });

    return () => {
      chartInstance.dispose();
    };
  }, []);

  return (
    <div className="w-full bg-[#]">
      <div ref={chartRef} style={{ height: "400px", width: "100%" }} />
    </div>
  );
}
