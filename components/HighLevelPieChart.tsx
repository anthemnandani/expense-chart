"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
interface ExpenseCategory {
    expenseDescType: string
    totalExpenses: number
}

interface HighLevelPieChartProps {
    categoryData: ExpenseCategory[]
}

const COLORS = [
    "#3b82f6", "#00b4d8", "#22c55e", "#60d394", "#", "#f4a261"
]

export default function HighLevelPieChart({ categoryData }: HighLevelPieChartProps) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.documentElement.classList.contains('dark'))
        })
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
        setIsDarkMode(document.documentElement.classList.contains('dark'))
        return () => observer.disconnect()
    }, [])
    useEffect(() => {
        const initializeHighcharts = async () => {
            const HighchartsMore = (await import('highcharts/highcharts-more')).default
            const Exporting = (await import('highcharts/modules/exporting')).default
            HighchartsMore(Highcharts)
            Exporting(Highcharts)
        }
        initializeHighcharts()
    }, [])

    interface ExpenseCategory {
        expenseDescType: string
        totalExpenses: number
    }

    interface HighLevelPieChartProps {
        categoryData: ExpenseCategory[]
    }

    const total = categoryData.reduce((sum, cat) => sum + cat.totalExpenses, 0)
    const data = categoryData.map((cat, index) => ({
        name: cat.expenseDescType,
        y: cat.totalExpenses,
        color: COLORS[index % COLORS.length],
    }))

    const options: Highcharts.Options = {
        chart: {
            type: "pie",
            backgroundColor: "transparent",
            animation: true,
        },
        title: {
            text: undefined,
            style: {
                color: isDarkMode ? '#f3f4f6' : '#111827'
            }
        },
        tooltip: {
            pointFormat: '<b>₹{point.y:,.0f}</b> ({point.percentage:.1f}%)',
            style: { fontSize: "13px", color: isDarkMode ? '#f3f4f6' : '#111827' },
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
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
                borderColor: isDarkMode ? '#1f2937' : '#ffffff',
                dataLabels: {
                    enabled: true,
                    format: "{point.name}: {point.percentage:.1f}%",
                    style: { fontSize: "11px" },
                },
                animation: {
                    duration: 1200,
                    easing: "linear",
                },
            },
        },
        legend: {
            layout: "horizontal",        
            align: "center",             
            verticalAlign: "bottom",      
            itemDistance: 20,             
            symbolRadius: 15,               
            symbolHeight: 15,             
            symbolWidth: 15,            
            itemMarginTop: 6,             
            itemMarginBottom: 6,         

            itemStyle: {
                color: "#444",             
                fontWeight: "500",         
                fontSize: "14px",     
            },
            itemHoverStyle: {
                color: "#1f2937",         
            },
            itemHiddenStyle: {
                color: "#ccc",            
            },
        },
        series: [
            {
                type: "pie",
                name: "Expenses",
                data: data,
            },
        ],
        credits: { enabled: false },
    }

    return (
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 col-span-2">
            <CardHeader className="flex justify-between flex-col lg:flex-row">
                <div>
                    <CardTitle className="flex items-center gap-2">
                    Expense Distribution
                </CardTitle>
                <CardDescription>
                    Animated pie chart showing category-wise expense shares
                </CardDescription>
                </div>
                 <div className="flex gap-2 flex-col-reverse">
                    <select
                        className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs text-gray-800 dark:text-white rounded-md px-1 py-1"
                        defaultValue="August"
                    >
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                            'September', 'October', 'November', 'December'].map((month) => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                    </select>

                    <select
                        className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs text-gray-800 dark:text-white rounded-md px-2 py-1"
                        defaultValue={2025}
                    >
                        {[2023, 2024, 2025].map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] min-h-fit">
                    <HighchartsReact highcharts={Highcharts} options={options} />
                </div>
            </CardContent>
        </Card>
    )
}