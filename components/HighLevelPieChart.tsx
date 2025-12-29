"use client";

import React, { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { useAuth } from "@/context/auth-context"
import { ExpenseCategory } from "@/lib/types"
import { apiService } from "@/lib/apiService"

interface HighLevelPieChart {
    years: number[];
    currency: string;
}

const COLORS = [
    "#3b82f6", "#00b4d8", "#22c55e", "#60d394", "#f59e0b", "#f4a261"
]

export const HighLevelPieChart: React.FC<HighLevelPieChart> = ({ years, currency }) => {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
    const [categoryData, setCategoryData] = useState<ExpenseCategory[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const groupId = user?.groupId

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.documentElement.classList.contains("dark"))
        })
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
        setIsDarkMode(document.documentElement.classList.contains("dark"))
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const initializeHighcharts = async () => {
            const HighchartsMore = (await import("highcharts/highcharts-more")).default
            const Exporting = (await import("highcharts/modules/exporting")).default
            HighchartsMore(Highcharts)
            Exporting(Highcharts)
        }
        initializeHighcharts()
    }, [])

    useEffect(() => {
        if (!groupId) return
        const fetchData = async () => {
            try {
                setLoading(true)
                const data = await apiService.getExpenseByMonth(groupId, selectedYear, selectedMonth);
                setCategoryData(data)
            } catch (err) {
                console.error("Error fetching category data:", err)
                setCategoryData([])
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [selectedYear, selectedMonth, groupId])

    const chartData = useMemo(() => {
        return categoryData.map((cat, index) => ({
            name: cat.expenseDescType,
            y: cat.totalExpenses,
            color: COLORS[index % COLORS.length],
        }))
    }, [categoryData])

    const options: Highcharts.Options = useMemo(() => ({
        accessibility: { enabled: false },
        chart: {
            type: "pie",
            backgroundColor: "transparent",
            animation: true,
        },
        title: {
            text: undefined,
            style: { color: isDarkMode ? "#f3f4f6" : "#111827" },
        },
        tooltip: {
            pointFormat: `<b>${currency}{point.y:,.0f}</b> ({point.percentage:.1f}%)`,
            backgroundColor: isDarkMode ? "#374151" : "#ffffff",
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                borderRadius: 5,
                cursor: "pointer",
                depth: 45,
                innerSize: "50%",
                showInLegend: true,
                borderWidth: 3,
                borderColor: isDarkMode ? "#1f2937" : "#ffffff",
                dataLabels: {
                    enabled: true,
                    format: "{point.name}: {point.percentage:.1f}%",
                    style: { fontSize: "11px" },
                },
                animation: { duration: 1200, easing: "linear" },
            },
        },
        legend: {
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom",
            itemStyle: {
                color: isDarkMode ? "#fff" : "#444",
                fontWeight: "500",
                fontSize: "14px",
            },
        },
        series: [
            {
                type: "pie",
                name: "Expenses",
                data: chartData,
            },
        ],
        credits: { enabled: false },
    }), [chartData, isDarkMode, currency])

    const monthOptions = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    return (
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 lg:col-span-2 col-span-1">
            <CardHeader className="flex justify-between mb-14 flex-col lg:flex-row">
                <CardTitle className="text-md font-semibold text-gray-800 dark:text-white">Expense Distribution</CardTitle>

                <div className="flex gap-2 flex-col lg:flex-row">
                    <select
                        className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs text-gray-800 dark:text-white rounded-md px-1 py-1"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    >
                        {monthOptions.map((month, idx) => (
                            <option key={month} value={idx + 1}>{month}</option>
                        ))}
                    </select>

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
                <div className="h-[300px] flex items-center justify-center">
                    {loading || categoryData.length === 0 ? (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Loading chart...
                        </div>
                    ) : (
                        <HighchartsReact highcharts={Highcharts} options={options} />
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default HighLevelPieChart