"use client";
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { apiService } from "@/lib/apiService";

interface EmployeeData {
    month: string;
    total: number;
    resigned: number;
    joined: number;
    resignedEmployees: { name: string; date: string }[];
    joinedEmployees: { name: string; date: string }[];
}

export default function EmployeeYearlyJoiningResignedChart({ years }) {
    const chartRef = useRef<HTMLDivElement>(null);
    const [data, setData] = useState<EmployeeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const { user } = useAuth()

    const fetchData = async () => {
        try {
            const result = await apiService.getEmployeeMonthlySummary(
                user.token,
                selectedYear
            );

            setData(result?.data || []);
            setData(result.data || []);
        } catch (error) {
            console.error("Error fetching employee data:", error);
            setData([]); // Fallback to empty array
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user?.token, selectedYear]);

    useLayoutEffect(() => {
        if (!chartRef.current || loading || data.length === 0) return;

        chartRef.current.innerHTML = "";
        let root = am5.Root.new(chartRef.current);
        root.setThemes([am5themes_Animated.new(root)]);

        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                wheelY: "none"
            })
        );

        chart.zoomOutButton.set("forceHidden", true);
        chart.get("colors").set("step", 2);

        let xRenderer = am5xy.AxisRendererX.new(root, {
            minGridDistance: 30
        });
        xRenderer.labels.template.setAll({
            rotation: -45,
            centerY: am5.p50,
            centerX: am5.p100
        });
        let xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                categoryField: "month",
                renderer: xRenderer,
                tooltip: am5.Tooltip.new(root, {})
            })
        );

        let yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {})
            })
        );

        // Column series
        let totalSeries = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                name: "Total Employees",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "total",
                categoryXField: "month",
                tooltip: am5.Tooltip.new(root, {
                    labelText: "Total Employees: {valueY}",
                })
            })
        );
        totalSeries.columns.template.setAll({
            fill: am5.color(0x00b4d8),
            stroke: am5.color(0x00b4d8),
            tooltipY: 0
        });

        // Tooltip style for total employees: white text
        totalSeries.get("tooltip").setAll({
            getFillFromSprite: false,
            getStrokeFromSprite: false,
            autoTextColor: false
        });
        totalSeries.get("tooltip").get("background").setAll({
            fill: am5.color(0x00b4d8),
            stroke: am5.color(0x00b4d8),
            fillOpacity: 1,
            strokeOpacity: 1,
            cornerRadiusTL: 6,
            cornerRadiusTR: 6,
            cornerRadiusBL: 6,
            cornerRadiusBR: 6
        });
        totalSeries.get("tooltip").label.setAll({
            fill: am5.color(0xffffff),
            fontWeight: "400"
        });

        // -----------------------------------------
        // RESIGNED SERIES (UPDATED WITH NEW COLOR)
        // -----------------------------------------
        let resignedColor = am5.color(0x5465ff);
        let resignedSeries = chart.series.push(
            am5xy.LineSeries.new(root, {
                name: "Resigned",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "resigned",
                categoryXField: "month",
                tooltip: am5.Tooltip.new(root, {})
            })
        );
        // Force color everywhere (important fix)
        resignedSeries.strokes.template.setAll({
            stroke: resignedColor,
            strokeWidth: 2
        });
        resignedSeries.set("stroke", resignedColor); // override series main color
        resignedSeries.strokes.template.set("stroke", resignedColor); // override theme
        resignedSeries.appear(0); // redraw the line
        // Custom tooltip
        resignedSeries.get("tooltip").adapters.add("labelText", (labelText, target) => {
            if (target.dataItem) {
                let d = target.dataItem.dataContext;
                let txt = `Resigned: ${d.resigned}`;
                if (d.resigned > 0) {
                    txt += `\nNames: ${d.resignedEmployees
                        .map(e => `${e.name} (${e.date})`)
                        .join(", ")}`;
                }
                return txt;
            }
            return labelText;
        });
        // Bullets
        resignedSeries.bullets.push(() =>
            am5.Bullet.new(root, {
                sprite: am5.Circle.new(root, {
                    radius: 8,
                    fill: am5.color(0xffffff),
                    stroke: resignedColor,
                    strokeWidth: 2
                })
            })
        );
        // Tooltip style
        resignedSeries.get("tooltip").setAll({
            getFillFromSprite: false,
            getStrokeFromSprite: false,
            autoTextColor: false
        });
        resignedSeries.get("tooltip").get("background").setAll({
            fill: resignedColor,
            stroke: resignedColor,
            fillOpacity: 1,
            strokeOpacity: 1,
            cornerRadiusTL: 6,
            cornerRadiusTR: 6,
            cornerRadiusBL: 6,
            cornerRadiusBR: 6
        });
        resignedSeries.get("tooltip").label.setAll({
            fill: am5.color(0xffffff),
            fontWeight: "400"
        });

        // -----------------------------------------
        // JOINED SERIES (same as before)
        // -----------------------------------------
        let joinedColor = am5.color(0x9d4edd);
        let joinedSeries = chart.series.push(
            am5xy.LineSeries.new(root, {
                name: "Joined",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "joined",
                categoryXField: "month",
                tooltip: am5.Tooltip.new(root, {})
            })
        );
        chart.get("colors").set("colors", [joinedColor]);
        joinedSeries.strokes.template.setAll({
            stroke: joinedColor,
            strokeWidth: 2
        });
        joinedSeries.events.on("datavalidated", () => {
            joinedSeries.set("stroke", joinedColor);
        });
        joinedSeries.get("tooltip").adapters.add("labelText", (labelText, target) => {
            if (target.dataItem) {
                let d = target.dataItem.dataContext;
                let txt = `Joined: ${d.joined}`;
                if (d.joined > 0) {
                    txt += `\nNames: ${d.joinedEmployees
                        .map(e => `${e.name} (${e.date})`)
                        .join(", ")}`;
                }
                return txt;
            }
            return labelText;
        });
        joinedSeries.bullets.push(() =>
            am5.Bullet.new(root, {
                sprite: am5.Rectangle.new(root, {
                    width: 12,
                    height: 12,
                    fill: joinedColor,
                    stroke: joinedColor
                })
            })
        );
        joinedSeries.get("tooltip").setAll({
            getFillFromSprite: false,
            getStrokeFromSprite: false,
            autoTextColor: false
        });
        joinedSeries.get("tooltip").get("background").setAll({
            fill: joinedColor,
            stroke: joinedColor,
            fillOpacity: 1,
            strokeOpacity: 1,
            cornerRadiusTL: 6,
            cornerRadiusTR: 6,
            cornerRadiusBL: 6,
            cornerRadiusBR: 6
        });
        joinedSeries.get("tooltip").label.setAll({
            fill: am5.color(0xffffff),
            fontWeight: "400",
            oversizedBehavior: "none",
            populateText: true
        });

        // set data
        totalSeries.data.setAll(data);
        resignedSeries.data.setAll(data);
        joinedSeries.data.setAll(data);
        xAxis.data.setAll(data);

        chart.set("cursor", am5xy.XYCursor.new(root, {
            xAxis: xAxis,
            yAxis: yAxis
        }));

        totalSeries.appear(1000);
        resignedSeries.appear(1000);
        joinedSeries.appear(1000);
        chart.appear(1000, 100);

        return () => root.dispose();
    }, [data, loading]);

    if (loading) {
        return <div style={{ width: "100%", height: "500px", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading chart...</div>;
    }

    return <>
        <Card className="w-full shadow-md bg-white dark:bg-gray-900 transition-colors duration-300">
            <CardHeader className="flex justify-between lg:flex-row flex-col">
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white text-md">
                    Hiring vs Resignation Overview
                </CardTitle>
                <select
                    className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs text-gray-800 dark:text-white rounded-md px-2 py-1"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </CardHeader>

            <CardContent className="pt-0">
                <div ref={chartRef} style={{ width: "100%", height: "500px" }} />
            </CardContent>
        </Card>
    </>;
}