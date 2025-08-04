"use client"

import Highcharts from "highcharts/highstock"
import HighchartsReact from "highcharts-react-official"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const monthlyExpenseData = [
  { month: "Jan", totalDebit: 3803, totalCredit: 6200 },
  { month: "Feb", totalDebit: 3523, totalCredit: 2000 },
  { month: "Mar", totalDebit: 4216, totalCredit: 5000 },
  { month: "Apr", totalDebit: 3900, totalCredit: 4000 },
  { month: "May", totalDebit: 9048, totalCredit: 9000 },
  { month: "Jun", totalDebit: 5215, totalCredit: 4500 },
  { month: "Jul", totalDebit: 3480, totalCredit: 3000 },
  { month: "Aug", totalDebit: 0, totalCredit: 0 },
  { month: "Sep", totalDebit: 0, totalCredit: 0 },
  { month: "Oct", totalDebit: 0, totalCredit: 0 },
  { month: "Nov", totalDebit: 0, totalCredit: 0 },
  { month: "Dec", totalDebit: 0, totalCredit: 0 },
]

const chartOptions: Highcharts.Options = {
  chart: {
    type: "areaspline", // Changed from "area" to "areaspline" for rounded connections
    backgroundColor: "transparent",
    style: {
      fontFamily: "'Inter', sans-serif",
    },
  },
  title: {
    text: undefined,
  },
  xAxis: {
    categories: monthlyExpenseData.map((d) => d.month),
    tickmarkPlacement: "on",
    lineColor: "#ccc",
    labels: {
      style: {
        color: "#888",
      },
    },
    title: { enabled: false },
  },
  yAxis: {
    title: { text: "Amount (₹)" },
    gridLineColor: "#eee",
    labels: {
      style: {
        color: "#888",
      },
      formatter: function () {
        return `₹${this.value}`;
      },
    },
  },
  tooltip: {
    shared: true,
    useHTML: true,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderRadius: 8,
    shadow: true,
    formatter: function () {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const points = this.points || [];
      const rows = points
        .map(
          (point) =>
            `<div style="margin-bottom:4px;"><span style="color:${point.color}; font-weight:600;">●</span> ${point.series.name}: ₹${point.y}</div>`
        )
        .join("");
      return `<strong style="padding-bottom:4px;">${months[this.point.index]}</strong><br/>${rows}`;
    },

  },
  legend: {
    itemStyle: {
      color: "#555",
      fontWeight: "500",
    },
    itemHoverStyle: {
      color: "#000",
    },
  },
  plotOptions: {
    areaspline: { // Changed from "area" to "areaspline"
      stacking: "normal",
      lineWidth: 2,
      marker: {
        radius: 4,
        symbol: "circle",
        states: {
          hover: {
            enabled: true,
            fillColor: "#fff",
            lineWidth: 2,
          },
        },
      },
      states: {
        inactive: {
          opacity: 0.2,
        },
        hover: {
          halo: {
            size: 0
          }
        }
      },
      events: {
        mouseOver: function () {
          this.chart.series.forEach(series => {
            if (series !== this) {
              series.setState('inactive');
            } else {
              series.setState('hover');
            }
          });
        },
        mouseOut: function () {
          this.chart.series.forEach(series => {
            series.setState('inactive', false);
          });
        }
      }
    },
    series: {
      marker: {
        enabled: false,
      },
      states: {
        hover: {
          enabled: true,
          brightness: 0
        }
      }
    }
  },
  series: [
    {
      name: "Expenses",
      type: "areaspline", // Changed from "area" to "areaspline"
      data: monthlyExpenseData.map((d) => d.totalDebit),
      color: {
        linearGradient: [0, 0, 0, 300],
        stops: [
          [0, "#f97316"],
          [1, "rgba(249, 115, 22, 0.1)"],
        ],
      },
    },
    {
      name: "Credits",
      type: "areaspline", // Changed from "area" to "areaspline"
      data: monthlyExpenseData.map((d) => d.totalCredit),
      color: {
        linearGradient: [0, 0, 0, 300],
        stops: [
          [0, "#10b981"],
          [1, "rgba(16, 185, 129, 0.1)"],
        ],
      },
    },
  ],
  credits: {
    enabled: false,
  },
}

export default function AreaYearlyExpenseChart() {
  return (
    <Card className="shadow-lg border-0 bg-white col-span-3 dark:bg-gray-800">
      <CardHeader className="flex justify-between lg:flex-row lex-col">
        <div>
          <CardTitle className="text-lg font-semibold">
            Yearly Expense & Income Overview
          </CardTitle>
          <CardDescription>
            Smooth area chart with rounded connections between points
          </CardDescription>
        </div>
        <div className="flex gap-2 items-center">
          <select
            className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs text-gray-800 dark:text-white rounded-md px-2 py-1"
            defaultValue={2025}
          >
            {[2025, 2024, 2023].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <HighchartsReact highcharts={Highcharts} constructorType="chart" options={chartOptions} />
      </CardContent>
    </Card>
  )
}