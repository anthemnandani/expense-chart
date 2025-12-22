"use client";

import { useLayoutEffect, useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { CardHeader, CardTitle } from "../ui/card";
import { useAuth } from "@/context/auth-context";
import { apiService } from "@/lib/apiService";

export default function GenderChart({ years }) {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const { user } = useAuth()

    // Fetch data
    useEffect(() => {
        const fetchGenderStats = async () => {
            try {
                const result = await apiService.getGenderStats(
                    selectedYear,
                    selectedMonth,
                    user.token
                );

                if (result?.status) {
                    setData(result.data.map(item => ({
                        category: item.Gender,
                        value: item.Count
                    })));
                    setTotal(result.totalEmployees);
                }

                if (result.status) {
                    const formatted = result.data.map((item) => ({
                        category: item.Gender,
                        value: item.Count,
                    }));

                    setData(formatted);
                    setTotal(result.totalEmployees);
                }
            } catch (err) {
                console.error("Gender chart fetch error", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGenderStats();
    }, [selectedMonth, selectedYear, user?.token]);

    // Render chart
    useLayoutEffect(() => {
        if (data.length === 0) return;

        let root = am5.Root.new("genderPieChart");

        root.setThemes([am5themes_Animated.new(root)]);

        // Create chart
        let chart = root.container.children.push(
            am5percent.PieChart.new(root, {
                innerRadius: am5.percent(55),
            })
        );

        // Series
        let series = chart.series.push(
            am5percent.PieSeries.new(root, {
                valueField: "value",
                categoryField: "category",
                alignLabels: false,
            })
        );

        // Arc labels (circular)
        series.labels.template.setAll({
            textType: "circular",
            radius: 10,
            fontSize: 12,
        });

        // Slice styling
        series.slices.template.setAll({
            cornerRadius: 8,
            tooltipText: "{category}: {value} ({valuePercentTotal.formatNumber('0.00')}%)"
        });

        // Colors for Male/Female
        series.set("colors", am5.ColorSet.new(root, {
            colors: [
                am5.color("#3b82f6"), // blue → male
                am5.color("#ec4899"), // pink → female
                am5.color("#10b981"), // other → green
            ]
        }));

        // Legend with percentage
        const legend = chart.children.push(
            am5.Legend.new(root, {
                centerX: am5.percent(50),
                x: am5.percent(50),
                marginTop: 20,
                marginBottom: 10,
                layout: root.horizontalLayout,
                y: am5.percent(100),    // 👈 Bottom me rakhta hai
                centerY: am5.percent(100)
            })
        );

        // Custom legend label text (Category + Percentage)
        legend.itemContainers.template.adapters.add("text", (text, target) => {
            const dataItem = target.dataItem?.dataContext;
            if (dataItem) {
                const total = data.reduce((sum, item) => sum + item.value, 0);
                const percent = ((dataItem.value / total) * 100).toFixed(2);
                return `${dataItem.category} ${percent}%`;
            }
            return text;
        });


        // Set data
        series.data.setAll(data);

        series.appear(800, 80);

        legend.data.setAll(series.dataItems);

        return () => {
            root.dispose();
        };
    }, [data]);

    return (
        <div className="w-full bg-white rounded-lg shadow p-6 pt-1">
            <CardHeader className="flex justify-between lg:flex-row flex-col">
                <CardTitle className="text-gray-800 dark:text-white">
                    Employee Gender Distribution
                </CardTitle>

                {/* Month / Year dropdowns */}
                <div className="flex gap-2">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
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
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>
            </CardHeader>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading gender stats...</div>
            ) : (
                <>
                    <div id="genderPieChart" style={{ width: "100%", height: "410px" }}></div>
                    {/* 
                    <div className="mt-6 text-sm text-gray-600">
                        <b>Total Employees:</b> {total}
                    </div> */}
                </>
            )}
        </div>
    );
}
