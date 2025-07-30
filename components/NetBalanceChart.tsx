"use client"

import ReactECharts from "echarts-for-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMemo } from "react"

// Sample data generation for one year
const generateYearlyData = () => {
  const startDate = new Date("2025-01-01")
  const data: { date: string; balance: number }[] = []

  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)

    data.push({
      date: date.toISOString().split("T")[0],
      balance: Math.round(Math.random() * 20000 - 10000),
    })
  }

  return data
}

const NetBalanceChart = () => {
  const data = useMemo(() => generateYearlyData(), [])

  const option = {
  title: {
    text: "Net Balance Visualization (Day-wise for 2025)",
    left: "center",
    textStyle: {
      fontSize: 16,
      fontWeight: 600,
      color: "#333",
    },
  },
  tooltip: {
    trigger: "axis",
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    textStyle: {
      color: "#000",
    },
    formatter: (params: any) => {
      const item = params[0]
      return `
        <strong>${item.name}</strong><br/>
        Net Balance: ₹${item.value.toLocaleString()}
      `
    },
  },
  grid: {
    left: "3%",
    right: "3%",
    bottom: "15%",
    top: "12%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: data.map(d => d.date),
    boundaryGap: false,
    axisLabel: {
      rotate: 45,
      interval: 29,
      color: "#666",
    },
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "₹{value}",
      color: "#666",
    },
    splitLine: {
      lineStyle: {
        type: "dashed",
        color: "#ddd",
      },
    },
  },
  dataZoom: [
    {
      type: "slider",
      start: 0,
      end: 10,
      height: 20,
      bottom: 5,
    },
    {
      type: "inside",
      start: 0,
      end: 10,
    },
  ],
  series: [
    {
      name: "Net Balance",
      type: "line",
      smooth: true,
      showSymbol: false,
      lineStyle: {
        width: 2,
        color: "#3b82f6", // Pink line
      },
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: "#3b82f6" },     // Top: pink
            { offset: 1, color: "#4b81da" },     // Bottom: light yellow
          ],
        },
      },
      emphasis: {
        focus: "series",
      },
      data: data.map(d => d.balance),
    },
  ],
}


  return (
    <Card className="col-span-full shadow-lg border-0 bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg">Net Balance Visualization</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
      </CardContent>
    </Card>
  )
}

export default NetBalanceChart