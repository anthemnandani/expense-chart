"use client";
import React, { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { useAuth } from "@/context/auth-context";
import { apiService } from "@/lib/apiService";

const COLORS = [
    "#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#06b6d4", "#f97316", "#ec4899"
]

interface FetchedEmployeeData {
    activeEmployees: Array<{ name: string; experience: string }>;
    dailyReport: { checkedIn: number; notCheckedIn: number };
    previousDayReport: { date: string; checkedIn: number; notCheckedIn: number };
}

interface ProcessedEmployeeData {
    activeEmployees: Array<{ name: string; years: number }>;
    dailyReport: { checkedIn: number; notCheckedIn: number };
    previousDayReport: { date: string; checkedIn: number; notCheckedIn: number };
}

export const ActiveEmployeeCharts: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [data, setData] = useState<ProcessedEmployeeData | null>(null)
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    // Fetch data dynamically
    const fetchData = async () => {
        try {
            if (!user?.token) return;

            setLoading(true);

            const fetchedData = await apiService.getAttendanceSummary(user.token);

            if (!fetchedData) {
                setData(null);
                return;
            }

            // Process experience strings to years (decimal)
            const processedActiveEmployees = fetchedData.activeEmployees.map(emp => {
                const match = emp.experience.match(/(\d+) years? (\d+) months?/);
                let years = 0;

                if (match) {
                    years = Number(match[1]) + Number(match[2]) / 12;
                } else if (emp.experience.includes("months")) {
                    const months = Number(emp.experience.match(/(\d+)/)?.[1] || 0);
                    years = months / 12;
                } else {
                    years = Number(emp.experience.match(/(\d+)/)?.[1] || 0);
                }

                return {
                    name: emp.name,
                    years: Number(years.toFixed(1)), // ✅ 1 decimal
                };
            });

            setData({
                activeEmployees: processedActiveEmployees,
                dailyReport: fetchedData.dailyReport,
                previousDayReport: fetchedData.previousDayReport,
            });
        } catch (err) {
            console.error("Error fetching attendance summary:", err);
            setData(null);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, [user?.token]);

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

    // Sort active employees by years descending for better visual hierarchy
    const sortedActiveEmployees = useMemo(() => {
        if (!data?.activeEmployees) return []
        return [...data.activeEmployees].sort((a, b) => b.years - a.years)
    }, [data])

    // Active Employees Pie Chart Options
    const activeEmployeesOptions: Highcharts.Options = useMemo(() => ({
        accessibility: { enabled: false },
        chart: {
            type: "pie",
            backgroundColor: "transparent",
            animation: true,
            spacing: [5, 5, 15, 5], // Increased bottom spacing for horizontal legend
        },
        title: {
            text: undefined,
            style: {
                color: isDarkMode ? "#f3f4f6" : "#111827",
                fontSize: "16px",
                fontWeight: "600",
                textAlign: "center"
            },
            align: "center"
        },
        tooltip: {
            headerFormat: "",
            pointFormat: `<b>{point.name}</b><br/>Years: <b>{point.y}</b>`,
            backgroundColor: isDarkMode ? "#374151" : "#ffffff",
            borderColor: isDarkMode ? "#4b5563" : "#e5e7eb",
            borderRadius: 5, // Softer tooltip corners
            style: { fontSize: "12px" }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                borderRadius: 5, // Softer slice borders
                cursor: "pointer",
                depth: 45,
                innerSize: "0%", // Full pie
                showInLegend: true, // Enable legend
                borderWidth: 1, // Thinner border for cleaner look
                borderColor: isDarkMode ? "#1f2937" : "#f8fafc",
                dataLabels: {
                    enabled: true,
                    distance: -45, // Adjusted for better positioning with larger innerSize
                    formatter: function (this: Highcharts.Point) {
                        if (this.y > 3) {
                            return '<br/><span style="font-size: 14px; color: #fff; font-weight: 700;">' + this.y + '</span>';
                        }
                        return '';
                    },
                    style: {
                        fontSize: "12px",
                        fontWeight: "600",
                        textOutline: "none",
                        color: isDarkMode ? "#f9fafb" : "#111827"
                    },
                    connectorColor: "transparent" // No connectors
                },
                animation: { duration: 1200, easing: "easeInOutQuad" }, // Smoother easing
                size: "100%", // Ensure pie fills the plot area
            },
        },
        legend: {
            enabled: true,
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom",
            itemStyle: {
                color: isDarkMode ? "#f9fafb" : "#374151",
                fontWeight: "500",
                fontSize: "11px",
                padding: "2px 8px", // Horizontal padding for better spacing in row
                lineHeight: 1.2
            },
            itemHoverStyle: {
                color: "#3b82f6"
            },
            symbolHeight: 8,
            symbolWidth: 8,
            symbolRadius: 0,
            useHTML: false,
            itemWidth: undefined, // Auto width for single row
            maxHeight: 60, // Limit to one row height
            itemMarginBottom: 0, // No spacing between rows since only one row
            backgroundColor: "transparent",
            borderRadius: 4
        },
        exporting: {
            enabled: true,
            buttons: {
                contextButton: {
                    enabled: false // Disable hamburger menu
                }
            }
        },
        credits: { enabled: false },
        series: [
            {
                type: "pie",
                name: "Years of Service",
                data: sortedActiveEmployees.map((emp, index) => ({
                    name: emp.name,
                    y: emp.years,
                    color: COLORS[index % COLORS.length],
                })),
            },
        ],
    }), [isDarkMode, sortedActiveEmployees])

    // Daily Report Pie Chart Options
    const dailyReportOptions: Highcharts.Options = useMemo(() => ({
        accessibility: { enabled: false },
        chart: {
            type: "pie",
            backgroundColor: "transparent",
            animation: true,
            spacing: [1, 1, 10, 1], // Bottom spacing for legend
        },
        title: {
            text: undefined,
            style: {
                color: isDarkMode ? "#f3f4f6" : "#111827",
                fontSize: "16px",
                fontWeight: "600",
                textAlign: "center"
            },
            align: "center"
        },
        tooltip: {
            headerFormat: "",
            pointFormat: `<b>{point.name}</b>: <b>{point.y}</b> ({point.percentage:.1f}%)`,
            backgroundColor: isDarkMode ? "#374151" : "#ffffff",
            borderColor: isDarkMode ? "#4b5563" : "#e5e7eb",
            borderRadius: 5, // Softer corners
            style: { fontSize: "12px" }
        },
        plotOptions: {
            pie: {
                allowPointSelect: false,
                borderRadius: 5, // Softer borders
                cursor: "default",
                depth: 35,
                innerSize: "0%", // Slightly larger inner circle for more emphasis on labels
                showInLegend: true, // Enable legend
                borderWidth: 1, // Thinner border
                borderColor: isDarkMode ? "#1f2937" : "#f8fafc",
                dataLabels: {
                    enabled: true,
                    distance: -45, // Adjusted for better positioning with larger innerSize
                    format: "<br/><span style='font-size: 14px; color: #fff; font-weight: 700;'>{point.y}</span>", // Bolder number emphasis
                    style: {
                        fontSize: "12px",
                        fontWeight: "600",
                        textOutline: "none",
                        color: isDarkMode ? "#f9fafb" : "#111827"
                    },
                    connectorColor: "transparent" // No connectors
                },
                colors: ["#3b82f6", "#ef4444"],
                animation: { duration: 800, easing: "easeInOutQuad" }, // Smoother easing
                size: "100%", // Ensure pie fills the plot area
            },
        },
        legend: {
            enabled: true,
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom",
            itemStyle: {
                color: isDarkMode ? "#f9fafb" : "#374151",
                fontWeight: "500",
                fontSize: "11px",
                padding: "2px 8px",
                lineHeight: 1.2
            },
            itemHoverStyle: {
                color: "#3b82f6"
            },
            symbolHeight: 8,
            symbolWidth: 8,
            symbolRadius: 0,
            useHTML: false,
            itemMarginBottom: 0,
            backgroundColor: "transparent",
            borderRadius: 4
        },
        exporting: {
            enabled: true,
            buttons: {
                contextButton: {
                    enabled: false // Disable hamburger menu
                }
            }
        },
        credits: { enabled: false },
        series: [
            {
                type: "pie",
                name: "Attendance",
                data: [
                    { name: "Checked In", y: data?.dailyReport?.checkedIn || 0, color: "#3b82f6" },
                    { name: "Not Checked In", y: data?.dailyReport?.notCheckedIn || 0, color: "#ef4444" }
                ],
            },
        ],
    }), [isDarkMode, data])

    // Previous Day Report Pie Chart Options
    const previousDayOptions: Highcharts.Options = useMemo(() => ({
        accessibility: { enabled: false },
        chart: {
            type: "pie",
            backgroundColor: "transparent",
            animation: true,
            spacing: [1, 1, 10, 1], // Bottom spacing for legend
        },
        title: {
            text: undefined,
            style: {
                color: isDarkMode ? "#f3f4f6" : "#111827",
                fontSize: "14px",
                fontWeight: "600",
                textAlign: "center"
            },
            align: "center"
        },
        tooltip: {
            headerFormat: "",
            pointFormat: `<b>{point.name}</b>: <b>{point.y}</b> ({point.percentage:.1f}%)`,
            backgroundColor: isDarkMode ? "#374151" : "#ffffff",
            borderColor: isDarkMode ? "#4b5563" : "#e5e7eb",
            borderRadius: 5, // Softer corners
            style: { fontSize: "12px" }
        },
        plotOptions: {
            pie: {
                allowPointSelect: false,
                borderRadius: 5, // Softer borders
                cursor: "default",
                depth: 35,
                innerSize: "0%", // Consistent with daily report
                showInLegend: true, // Enable legend
                borderWidth: 1, // Thinner border
                borderColor: isDarkMode ? "#1f2937" : "#f8fafc",
                dataLabels: {
                    enabled: true,
                    distance: -45, // Adjusted
                    format: "<br/><span style='font-size: 14px; color: #fff; font-weight: 700;'>{point.y}</span>", // Bolder numbers
                    style: {
                        fontSize: "12px",
                        fontWeight: "600",
                        textOutline: "none",
                        color: isDarkMode ? "#f9fafb" : "#111827"
                    },
                    connectorColor: "transparent"
                },
                colors: ["#3b82f6", "#ef4444"],
                animation: { duration: 800, easing: "easeInOutQuad" }, // Smoother easing
                size: "100%", // Ensure pie fills the plot area
            },
        },
        legend: {
            enabled: true,
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom",
            itemStyle: {
                color: isDarkMode ? "#f9fafb" : "#374151",
                fontWeight: "500",
                fontSize: "11px",
                padding: "2px 8px",
                lineHeight: 1.2
            },
            itemHoverStyle: {
                color: "#3b82f6"
            },
            symbolHeight: 8,
            symbolWidth: 8,
            symbolRadius: 0,
            useHTML: false,
            itemMarginBottom: 0,
            backgroundColor: "transparent",
            borderRadius: 4
        },
        exporting: {
            enabled: true,
            buttons: {
                contextButton: {
                    enabled: false // Disable hamburger menu
                }
            }
        },
        credits: { enabled: false },
        series: [
            {
                type: "pie",
                name: "Attendance",
                data: [
                    { name: "Checked In", y: data?.previousDayReport?.checkedIn || 0, color: "#3b82f6" },
                    { name: "Not Checked In", y: data?.previousDayReport?.notCheckedIn || 0, color: "#ef4444" }
                ],
            },
        ],
    }), [isDarkMode, data])

    if (loading) {
        return (
            <div className="w-full min-h-[420px] bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="w-full min-h-[420px] bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-center text-gray-500">
                No data available
            </div>
        )
    }

    return (
        <div className="w-full min-h-[420px] bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2 h-full">
                {/* Active Employees Chart */}
                <div className="col-span-1 md:col-span-3">
                    <Card className="flex-1 border-0 bg-transparent shadow-none h-full">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100 text-left">
                                Active Employees (Years)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex items-center justify-center pt-2">
                            <div className="w-full h-[380px]"> {/* Slightly increased height to accommodate bottom legend */}
                                <HighchartsReact highcharts={Highcharts} options={activeEmployeesOptions} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Daily Report Chart */}
                <div className="col-span-1 md:col-span-2 flex flex-col">
                    <Card className="flex-1 border-0 bg-transparent shadow-none h-full">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100 text-left">
                                Daily Employees Report
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex items-center justify-center pt-2">
                            <div className="w-full h-[280px]"> {/* Increased for consistency */}
                                <HighchartsReact highcharts={Highcharts} options={dailyReportOptions} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Previous Day Report Chart */}
                <div className="col-span-1 md:col-span-2 flex flex-col">
                    <Card className="flex-1 border-0 bg-transparent shadow-none h-full">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-gray-100 text-left leading-tight">
                                Previous Day Report ({data.previousDayReport.date})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex items-center justify-center pt-2">
                            <div className="w-full h-[280px]"> {/* Matching increased height */}
                                <HighchartsReact highcharts={Highcharts} options={previousDayOptions} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ActiveEmployeeCharts