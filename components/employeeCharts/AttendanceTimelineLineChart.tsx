"use client";
import React, { useLayoutEffect, useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { apiService } from "@/lib/apiService";
import { useAuth } from "@/context/auth-context";

interface AttendanceRecord {
    EmployeeId: string;
    EmployeeName: string;
    AttendanceDate: string;
    CheckInTime: string;
    CheckOutTime: string;
    WorkReport: string;
    IsLeave: boolean;
    Reason: string | null;
}

interface ProcessedData {
    date: string;
    dateTime: number;
    in: number;
    out: number;
    inStr: string;
    outStr: string;
}

interface Props {
    years: number[];
    employeeId: string | number;
    selectedYear: number;
    selectedMonth: number;
    onClose: () => void;
}

export default function AttendanceTimelineLineChart({ years, employeeId, selectedYear, selectedMonth, onClose }: Props) {
    const [rawData, setRawData] = useState<ProcessedData[]>([]);
    const [employeeName, setEmployeeName] = useState<string>("");
    const { user } = useAuth();
    const token = user.token;

    // Helper to parse time string like "09:00" to decimal hours (e.g., 9.0)
    const parseTime = (timeStr: string): number => {
        if (!timeStr) return 0;
        const [h, m] = timeStr.split(":").map(Number);
        return h + m / 60;
    };

    // Format time string to AM/PM display
    const formatTimeStr = (timeStr: string): string => {
        if (!timeStr) return "";
        const [h, m] = timeStr.split(":").map(Number);
        const hours = h;
        let displayHours = hours % 12;
        if (displayHours === 0) displayHours = 12;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        return `${displayHours.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!employeeId || !selectedYear || !selectedMonth) return;

            try {
                const json = await apiService.getEmployeeMonthlyAttendance(token, {
                    employeeId,
                    year: selectedYear,
                    month: selectedMonth,
                });
                if (!json || !json.attendance) {
                    setRawData([]);
                    setEmployeeName("");
                    return;
                }
                setEmployeeName(json.employeeName || "Unknown Employee");
                // Filter out leaves and process only working days
                const processed = json.attendance
                    .filter((a: AttendanceRecord) => !a.IsLeave)
                    .map((a: AttendanceRecord) => {
                        const date = new Date(a.AttendanceDate).toISOString().split("T")[0];
                        const dateTime = new Date(date).getTime();
                        return {
                            date,
                            dateTime,
                            in: parseTime(a.CheckInTime),
                            out: parseTime(a.CheckOutTime),
                            inStr: a.CheckInTime,
                            outStr: a.CheckOutTime,
                        };
                    })
                    .sort((a, b) => a.dateTime - b.dateTime);
                setRawData(processed);
            } catch (error) {
                console.error("Attendance fetch error:", error);
                setRawData([]);
                setEmployeeName("");
            }
        };
        fetchData();
    }, [token, selectedYear, selectedMonth, employeeId]);

    useLayoutEffect(() => {
        if (rawData.length === 0) return;
        const root = am5.Root.new("lineTimelineChart");
        root.setThemes([am5themes_Animated.new(root)]);
        const chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                paddingLeft: 20,
            })
        );
        /* -------------------- X AXIS -------------------- */
        const xAxis = chart.xAxes.push(
            am5xy.GaplessDateAxis.new(root, {
                baseInterval: { timeUnit: "day", count: 1 },
                renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }),
            })
        );
        const xRenderer = xAxis.get("renderer");
        xRenderer.labels.template.setAll({ rotation: -30, centerX: am5.percent(50), textAlign: "middle", fontSize: 12, });
        xRenderer.labels.template.adapters.add("text", (text, target) => {
            const value = target.dataItem?.get("value");
            if (!value) return text;
            const d = new Date(value);
            const day = d.getDate().toString().padStart(2, "0");
            const month = (d.getMonth() + 1).toString().padStart(2, "0");
            const year = d.getFullYear();
            return `${day}-${month}-${year}`;
        });
        /* -------------------- Y AXIS -------------------- */
        // Dynamic min/max based on data
        const allTimes = rawData.flatMap(d => [d.in, d.out]).filter(Boolean);
        const minTime = Math.floor(Math.min(...allTimes));
        const maxTime = Math.ceil(Math.max(...allTimes));
        const yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                min: minTime - 1, // add small buffer
                max: maxTime + 1,
                strictMinMax: true,
                renderer: am5xy.AxisRendererY.new(root, { minGridDistance: 20 }),
            })
        );
        yAxis.get("renderer").labels.template.adapters.add("text", (_, target) => {
            const v = target.dataItem?.get("value");
            if (typeof v === "number") {
                const h = Math.floor(v);
                const m = Math.round((v - h) * 60);
                return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
            }
            return "";
        });
        // Set font size for Y-axis labels
        yAxis.get("renderer").labels.template.setAll({
            fontSize: 12,
            fill: am5.color(0x374151), // optional: gray-700
        });
        /* -------------------- SERIES -------------------- */
        const series = chart.series.push(
            am5xy.LineSeries.new(root, {
                xAxis,
                yAxis,
                valueXField: "dateTime",
                valueYField: "time",
                stroke: am5.color(0x111827),
                strokeWidth: 2,
                connect: false,
            })
        );
        series.bullets.push((root, _, dataItem) => {
            const ctx: any = dataItem.dataContext;
            if (!ctx?.type) return;
            const circle = am5.Circle.new(root, {
                radius: 6,
                fill: ctx.type === "in" ? am5.color(0x2563eb) : am5.color(0xf97316),
            });
            // Show label above (Check-Out) or below (Check-In)
            if (ctx.inStr || ctx.outStr) {
                const label = am5.Label.new(root, {
                    text: ctx.type === "in" ? ctx.inStr : ctx.outStr,
                    fontSize: 10,
                    centerX: am5.percent(50),
                    centerY: ctx.type === "in" ? am5.percent(30) : am5.percent(70),
                    dy: ctx.type === "in" ? 10 : -10,
                    fill: am5.color(0x374151),
                });
                const container = am5.Container.new(root, {});
                container.children.push(circle);
                container.children.push(label);
                return am5.Bullet.new(root, { sprite: container });
            }
            return am5.Bullet.new(root, { sprite: circle });
        });
        /* -------------------- DATA -------------------- */
        const chartData: any[] = [];
        rawData.forEach((d) => {
            chartData.push({
                dateTime: d.dateTime,
                time: d.in,
                type: "in",
                inStr: d.inStr,
            });
            chartData.push({
                dateTime: d.dateTime,
                time: d.out,
                type: "out",
                outStr: d.outStr,
            });
            chartData.push({
                dateTime: d.dateTime,
                time: null,
            });
        });
        series.data.setAll(chartData);
        chart.appear(800, 100);
        return () => root.dispose();
    }, [rawData]);

    return (
        <Card>
            <CardHeader className="pb-4 px-5 flex justify-between lg:flex-row flex-col gap-2">
                <div>
                    <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white text-md">
                        {employeeName ? `${employeeName}'s ` : ""}Employee Check-In / Check-Out Timeline
                    </CardTitle>

                    {/* LEGEND */}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                            <span>Check-In</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                            <span>Check-Out</span>
                        </div>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-6 w-6 p-0 self-start"
                >
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>

            <CardContent>
                <div id="lineTimelineChart" className="h-[400px] w-full" />
            </CardContent>
        </Card>
    );
}