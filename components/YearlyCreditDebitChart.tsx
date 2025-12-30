"use client";

import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { apiService } from "@/lib/apiService";

export const YearlyCreditDebitChart = ({
  years,
  currency,
}: {
  years: number[];
  currency: string;
}) => {
  const { user } = useAuth();
  const groupId = user?.groupId;
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<{ credit: [number, number][], debit: [number, number][] }>({ credit: [], debit: [] });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () =>
      document.documentElement.classList.contains("dark");
    setIsDarkMode(checkDarkMode());

    const observer = new MutationObserver(() => {
      setIsDarkMode(checkDarkMode());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Fetch data
  useEffect(() => {
    if (!groupId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await apiService.getYearlyCreditDebit(groupId, selectedYear);
        setData(res);
      } catch (err) {
        console.error(err);
        setData({ credit: [], debit: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear, groupId]);

  const latestTimestamp = Math.max(
    ...(data.credit.map((d) => d[0])),
    ...(data.debit.map((d) => d[0]))
  );

  const baseDate =
    latestTimestamp > 0
      ? new Date(latestTimestamp)
      : new Date(selectedYear, 11, 1);
  const threeMonthsAgo = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth() - 2,
    1
  ).getTime();

  const options: Highcharts.Options = {
    chart: {
      height: 450,
      backgroundColor: "transparent",
      style: {
        color: isDarkMode ? "#f3f4f6" : "#111827",
      },
    },
    title: { text: undefined },
    xAxis: {
      type: "datetime",
      min: threeMonthsAgo,
      labels: {
        style: {
          color: isDarkMode ? "#d1d5db" : "#374151",
        },
      },
      lineColor: isDarkMode ? "#374151" : "#d1d5db",
      tickColor: isDarkMode ? "#374151" : "#d1d5db",
    },
    yAxis: {
      opposite: false,
      title: { text: `Amount(${currency})` },
      // labels: {
      //   formatter() {
      //     return `${currency}${this.value}`;
      //   },
      //   style: {
      //     color: isDarkMode ? "#d1d5db" : "#374151",
      //   },
      // },
      labels: {
        formatter() {
          return `${currency}${Highcharts.numberFormat(this.value as number, 0, '.', ',')}`;
        },
        style: {
          color: isDarkMode ? "#d1d5db" : "#374151",
        },
      },
      gridLineColor: isDarkMode ? "#1f2937" : "#e5e7eb",
    },
    tooltip: {
      shared: true,
      pointFormatter() {
        return `<span style="color:${this.color}">\u25CF</span> <b>
  ${this.series.name}: 
  ${currency}${Highcharts.numberFormat(this.y as number, 0, '.', ',')}
</b><br/>
<br/>`;
      },
      backgroundColor: isDarkMode ? "#111827" : "#ffffff",
      borderColor: isDarkMode ? "#374151" : "#d1d5db",
      style: {
        color: isDarkMode ? "#f3f4f6" : "#111827",
        fontSize: "13px",
      },
    },
    plotOptions: {
      series: {
        marker: {
          enabled: true,
          radius: 3,
          states: {
            hover: { radius: 5 },
          },
          // Show marker only if value > 0
          symbol: 'circle',
          fillColor: undefined, // default will be series color
        },
        dataLabels: {
          enabled: false,
        },
      },
      spline: {
        states: {
          hover: {
            lineWidth: 4,
          },
        },
        marker: {
          enabled: true,
          radius: 3,
          symbol: 'circle',
          fillColor: undefined,
        },
      },
    },
    series: [
      {
        name: "Credit",
        data: data.credit.map(([x, y]) => ({
          x,
          y,
          marker: { enabled: y > 0 },
        })),
        type: "spline",
        color: "#10B981",
        lineWidth: 2,
      },
      {
        name: "Debit",
        data: data.debit.map(([x, y]) => ({
          x,
          y,
          marker: { enabled: y > 0 },
        })),
        type: "spline",
        color: "#EF4444",
        lineWidth: 2,
      },
    ],
    credits: { enabled: false },
    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        color: isDarkMode ? "#f3f4f6" : "#111827",
        fontSize: "13px",
      },
      itemHoverStyle: {
        color: isDarkMode ? "#10B981" : "#10B981", // hover highlight
      },
    },
  };

  return (
    <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
      <CardHeader className="flex justify-between flex-col lg:flex-row">
        <CardTitle className="text-gray-800 dark:text-white text-md">
          Yearly Credit vs Debit ({selectedYear})
        </CardTitle>
        <div className="flex gap-2 items-center">
          <select
            className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs text-gray-800 dark:text-white rounded-md px-2 py-1"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          // 🔹 Selection-style loading UI (chart ki jagah)
          <div className="h-[450px] flex flex-col items-center justify-center">
            <div className="w-full h-full rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        ) : (
          <>
            <HighchartsReact
              highcharts={Highcharts}
              constructorType="stockChart"
              options={options}
            />

            {/* Legend */}
            <div className="flex justify-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                Credit
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                Debit
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default YearlyCreditDebitChart;