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

  useEffect(() => {
    if (!groupId) return;
    apiService.getYearlyCreditDebit(groupId, selectedYear).then(setData);
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
      title: { text: `${currency}` },
      labels: {
        style: {
          color: isDarkMode ? "#d1d5db" : "#374151",
        },
      },
      gridLineColor: isDarkMode ? "#1f2937" : "#e5e7eb",
    },
    tooltip: {
      shared: true,
      valuePrefix: currency,
      backgroundColor: isDarkMode ? "#111827" : "#ffffff",
      borderColor: isDarkMode ? "#374151" : "#d1d5db",
      style: {
        color: isDarkMode ? "#f3f4f6" : "#111827",
        fontSize: "13px",
      },
    },
    legend: {
      itemStyle: {
        color: isDarkMode ? "#f3f4f6" : "#111827",
        fontSize: "12px",
      },
      itemHoverStyle: {
        color: isDarkMode ? "#e5e7eb" : "#000000",
      },
    },
    series: [
      {
        name: "Credit",
        data: data.credit,
        type: "spline",
        color: "#10B981",
        lineWidth: 3,
      },
      {
        name: "Debit",
        data: data.debit,
        type: "spline",
        color: "#EF4444",
        lineWidth: 3,
      },
    ],
    credits: { enabled: false },
  };

  return (
    <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
      <CardHeader className="flex justify-between flex-col lg:flex-row">
        <CardTitle className="text-gray-800 dark:text-white">
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
        <HighchartsReact
          highcharts={Highcharts}
          constructorType="stockChart"
          options={options}
        />
      </CardContent>
    </Card>
  );
};

export default YearlyCreditDebitChart;
