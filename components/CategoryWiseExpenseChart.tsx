"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useAuth } from "@/context/auth-context";
import { apiService } from "@/lib/apiService";

interface CategoryWiseExpenseChart {
  years: number[];
  currency: string;
}

const dashStyles = [
    "Solid"
];

const monthLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const CategoryWiseExpenseChart: React.FC<CategoryWiseExpenseChart> = ({years, currency}) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [chartSeries, setChartSeries] = useState<Highcharts.SeriesOptionsType[]>([]);
    const { user } = useAuth()
    const groupId = user?.groupId

    // Dark mode listener
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        setIsDarkMode(document.documentElement.classList.contains("dark"));
        return () => observer.disconnect();
    }, []);

    // Fetch API Data
    useEffect(() => {
        const fetchData = async () => {
            if (!groupId) return
            try {
                 const data = await apiService.getCategoryExpenses(groupId, selectedYear)
                const categories = [...new Set(
                    data
                        .map((d) => d.expenseDescType.trim())
                        .filter((name) => name !== "") // remove empty categories
                )];
                const seriesData = categories.map((category, index) => {
                    const monthlyData: (number | null)[] = new Array(12).fill(null);
                    data.forEach((entry) => {
                        if (entry.expenseDescType.trim() === category) {
                            const monthIndex = parseInt(entry.month, 10) - 1;
                            monthlyData[monthIndex] = entry.totalExpenses;
                        }
                    });
                    return {
                        name: category || "Unknown",
                        data: monthlyData,
                        dashStyle: dashStyles[index % dashStyles.length],
                    };
                });

                setChartSeries(seriesData as Highcharts.SeriesOptionsType[]);
            } catch (err) {
                console.error("Error loading category-wise expenses:", err);
            }
        };

        fetchData();
    }, [selectedYear, groupId]);

    // Chart Options
    const options: Highcharts.Options = {
        accessibility: { enabled: false },
        chart: { type: "spline", backgroundColor: "transparent" },
        title: {
            text: undefined,
            style: { color: isDarkMode ? "#f9fafb" : "#1f2937" },
        },
        xAxis: {
            categories: monthLabels,
            title: { text: "Month", style: { color: isDarkMode ? "#d1d5db" : "#4b5563" } },
            labels: { style: { color: isDarkMode ? "#d1d5db" : "#4b5563" } },
            gridLineColor: isDarkMode ? "#374151" : "#e5e7eb",
        },
        yAxis: {
            title: { text: `Total Expenses (${currency})`, style: { color: isDarkMode ? "#d1d5db" : "#4b5563" } },
            labels: { style: { color: isDarkMode ? "#d1d5db" : "#4b5563" } },
            gridLineColor: isDarkMode ? "#374151" : "#e5e7eb",
        },
        legend: {
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",
            backgroundColor: isDarkMode ? "#111827" : "#ffffff",
            itemStyle: {
                color: isDarkMode ? "#f9fafb" : "#1f2937",
                fontWeight: "500",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
            },
            borderColor: isDarkMode ? "#374151" : "#e5e7eb",
            symbolWidth: 40,
        },
        tooltip: {
            shared: true,
            valuePrefix: `${currency}`,
            stickOnContact: true,
            backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
            style: { color: isDarkMode ? "#f9fafb" : "#1f2937" },
        },
        plotOptions: {
            series: {
                connectNulls: true,
                marker: { enabled: true, radius: 4 },
                cursor: "pointer",
                lineWidth: 2,
            },
        },
        series: chartSeries,
        credits: { enabled: false },
    };

    return (
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 lg:col-span-8 col-span-1">
            <CardHeader className="flex justify-between flex-col lg:flex-row">
                <div>
                    <CardTitle className="text-lg font-bold text-gray-800 dark:text-white">
                        Category-wise Monthly Expenses
                    </CardTitle>
                </div>
                <div className="flex gap-2 items-center">
                    <select
                        className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs text-gray-800 dark:text-white rounded-md px-2 py-1"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                        {years.map((year) => (
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

export default CategoryWiseExpenseChart;