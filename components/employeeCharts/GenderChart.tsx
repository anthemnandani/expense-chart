"use client";

import { useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { CardHeader, CardTitle } from "../ui/card";

const GenderChart = ({ year = 2025 }) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch API
    useEffect(() => {
        const fetchGenderStats = async () => {
            try {
                const response = await fetch(
                    `https://employee-dashboard-backend-api.vercel.app/api/dashboard-charts/gender-stats?year=${year}`
                );

                const result = await response.json();

                if (result.status) {
                    setData(
                        result.data.map((item) => ({
                            gender: item.Gender,
                            count: item.Count,
                        }))
                    );
                    setTotal(result.totalEmployees);
                }
            } catch (error) {
                console.error("Error fetching gender stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGenderStats();
    }, [year]);

    // Generate chart data
    const chartData = useMemo(() => {
        const sum = data.reduce((a, b) => a + b.count, 0) || 1;

        return data.map((item) => ({
            name: item.gender,
            y: item.count,
            percentage: ((item.count / sum) * 100).toFixed(1),
        }));
    }, [data]);

    // Highcharts configuration
    const options = useMemo(
        () => ({
            chart: {
                type: "pie",
                backgroundColor: "#ffffff",
                borderRadius: 16,
            },

            title: { text: undefined },

            tooltip: {
                useHTML: true,
                formatter: function () {
                    const pct = Number(this.point.percentage).toFixed(2); // FIXED 2 decimal

                    return `
        <div style='padding:6px 8px;'>
            <b>${this.point.name}</b><br/>
            Count: ${this.y}<br/>
            Percentage: ${pct}%
        </div>`;
                },
            },

            plotOptions: {
                pie: {
                    innerSize: "55%",
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            const pct = Number(this.point.percentage).toFixed(2); // FIXED 2 decimal
                            return `${this.point.name}: ${pct}%`;
                        },
                        style: {
                            fontWeight: "600",
                            color: "#333",
                            textOutline: "none",
                        },
                    },
                },
            },

            colors: ["#3b82f6", "#ec4899", "#10b981"],

            series: [
                {
                    name: "Gender Ratio",
                    data: chartData,
                },
            ],

            legend: {
                layout: "horizontal",
                align: "center",
                verticalAlign: "bottom",
                itemStyle: { fontWeight: "500", color: "#111" },
            },

            credits: { enabled: false },
        }),
        [chartData]
    );

    return (
        <div className="w-full bg-white rounded-2xl shadow p-6 pt-1">
            <CardHeader className="pb-4 pl-0 pr-0 flex justify-between lg:flex-row flex-col">
                <CardTitle className="text-gray-800 dark:text-white">
                    Employee Gender Distribution
                </CardTitle>
            </CardHeader>

            {loading ? (
                <div className="text-center py-10 text-gray-500">
                    Loading gender stats...
                </div>
            ) : (
                <>
                    <div className="w-full">
                        <HighchartsReact highcharts={Highcharts} options={options} />
                    </div>

                    <div className="mt-6 text-sm text-gray-600">
                        <b>Total Employees:</b> {total}
                    </div>
                </>
            )}
        </div>
    );
};

export default GenderChart;