"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { apiService } from "@/lib/apiService";

export default function EmployeeEXperienceChart() {
    const [chartData, setChartData] = useState([]);
    const { user } = useAuth()

    const scaleExperience = (years: number) => {
        if (years <= 3) return years;
        return 3 + (years - 3) / 4; // Compress >3 years
    };

    const toTitleCase = (name: string) => {
        return name
            .toLowerCase()
            .split(" ")
            .filter(Boolean)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    // ✅ New dynamic data fetch (same format, same keys)
    useEffect(() => {
        const fetchData = async () => {
            try {

                const json = await apiService.getAttendanceSummary(user.token);
                if (!json) return;

                const convertToYears = (exp: string) => {
                    let years = 0;

                    const yearMonthMatch = exp.match(/(\d+)\s*years?\s*(\d+)?\s*months?/);
                    if (yearMonthMatch) {
                        years =
                            Number(yearMonthMatch[1]) +
                            (Number(yearMonthMatch[2] || 0) / 12);
                    } else if (exp.includes("months")) {
                        const m = exp.match(/(\d+)/)?.[1];
                        years = Number(m || 0) / 12;
                    } else if (exp.includes("years")) {
                        const y = exp.match(/(\d+)/)?.[1];
                        years = Number(y || 0);
                    }

                    return Number(years.toFixed(1)); // 1 decimal
                };

                const formatted = json.activeEmployees.map((emp: any) => ({
                    name: emp.name,
                    role: emp.role, // 👈 real role from API
                    steps: scaleExperience(convertToYears(emp.experience)),
                    actualYears: convertToYears(emp.experience),
                    pictureSettings: {
                        src: emp.profileImage, // 👈 real profile image
                    },
                }));

                setChartData(formatted);
            } catch (err) {
                console.log("Experience fetch error:", err);
            }
        };

        fetchData();
    }, []);

    useLayoutEffect(() => {
        let root = am5.Root.new("chartexperiencediv");

        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        // Chart
        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                wheelY: "none",
                wheelX: "none",
                paddingTop: 60,
                paddingBottom: 10,
            })
        );

        // X Axis
        let xRenderer = am5xy.AxisRendererX.new(root, {
            minGridDistance: 60,
        });
        // label margin fix
        xRenderer.labels.template.setAll({
            paddingTop: 40,
            dy: 20,           // name ko neeche shift, image se overlap hat gayi
            fontSize: 10,
            textAlign: "center",
        });

        xRenderer.labels.template.adapters.add("text", (text, target) => {
            const d = target.dataItem?.dataContext;
            if (d?.role) {
                return `${toTitleCase(d.name)}\n(${d.role})`;  // 2 lines
                // return `${d.name} (${d.role})`;
            }
            return text;
        });

        xRenderer.grid.template.set("visible", false);

        let xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                categoryField: "name",
                renderer: xRenderer,
            })
        );

        // Y Axis
        let yRenderer = am5xy.AxisRendererY.new(root, {});
        yRenderer.grid.template.set("strokeDasharray", [3]);

        let yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                min: 0,
                baseInterval: 0.5,
                strictStepInterval: true,
                renderer: yRenderer,
            })
        );


        // 👇 ADD THIS
        yAxis.get("renderer").labels.template.setAll({
            fontSize: 11,
            fontWeight: "500",
            fill: am5.color("#111"), // gray-700 (optional)
        });

        yRenderer.labels.template.adapters.add("text", (text) => {
            const value = Number(text);
            if (value <= 3) {
                return value.toFixed(0); // 0.0, 0.5, 1.0, ...
            }
            const realValue = 3 + (value - 3) * 4;
            return Math.round(realValue).toString(); // 3, 5, 7, ...
        });

        // SERIES
        let series = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                name: "Income",
                xAxis,
                yAxis,
                valueYField: "steps",
                categoryXField: "name",
                sequencedInterpolation: true,
                maskBullets: false,
                tooltip: am5.Tooltip.new(root, {
                    dy: -30,
                    labelText: "{actualYears} years",
                }),
            })
        );

        series.columns.template.setAll({
            maxWidth: 40,
            strokeOpacity: 0,
            cornerRadiusTL: 10,
            cornerRadiusTR: 10,
            cornerRadiusBL: 10,
            cornerRadiusBR: 10,
            fillOpacity: 0.85,
        });

        let circleTemplate = am5.Template.new({});

        series.bullets.push((root, series, dataItem) => {
            let container = am5.Container.new(root, {});

            let circle = container.children.push(
                am5.Circle.new(root, {
                    radius: 30,
                }, circleTemplate)
            );

            let maskCircle = container.children.push(
                am5.Circle.new(root, { radius: 25 })
            );

            let imageContainer = container.children.push(
                am5.Container.new(root, {
                    mask: maskCircle,
                })
            );

            imageContainer.children.push(
                am5.Picture.new(root, {
                    templateField: "pictureSettings",
                    width: 50,
                    // height: 50,
                    centerX: am5.p50,
                    centerY: am5.p50,
                    stretch: "cover",
                })
            );

            return am5.Bullet.new(root, {
                sprite: container,
                locationY: 0,
            });
        });

        // Hover animation
        let currentlyHovered;

        function handleHover(item) {
            if (item && currentlyHovered !== item) {
                handleOut();

                currentlyHovered = item;

                let bullet = item.bullets[0];
                bullet.animate({
                    key: "locationY",
                    to: 1,
                    duration: 600,
                    easing: am5.ease.out(am5.ease.cubic),
                });
            }
        }

        function handleOut() {
            if (currentlyHovered) {
                let bullet = currentlyHovered.bullets[0];
                bullet.animate({
                    key: "locationY",
                    to: 0,
                    duration: 600,
                    easing: am5.ease.out(am5.ease.cubic),
                });
            }
        }

        series.columns.template.events.on("pointerover", (e) =>
            handleHover(e.target.dataItem)
        );
        series.columns.template.events.on("pointerout", handleOut);

        // Heat rule
        // Heat rule (Blue gradient)
        series.set("heatRules", [
            {
                target: series.columns.template,
                key: "fill",
                dataField: "valueY",
                min: am5.color(0x4a90e2), // Dark blue
                max: am5.color(0x1982c4), // Light blue
            },
            {
                target: circleTemplate,
                key: "fill",
                dataField: "valueY",
                min: am5.color(0x4a90e2), // Dark blue
                max: am5.color(0x1982c4), // Light blue
            },
        ]);

        series.data.setAll(chartData);
        xAxis.data.setAll(chartData);

        // Cursor
        let cursor = chart.set(
            "cursor",
            am5xy.XYCursor.new(root, {
                behavior: "none",
            })
        );

        cursor.lineY.set("visible", false);
        cursor.lineX.set("visible", false);

        cursor.events.on("cursormoved", () => {
            let item = series.get("tooltip")?.dataItem;
            if (item) handleHover(item);
            else handleOut();
        });

        series.appear(1000);
        chart.appear(1000, 100);

        return () => root.dispose();
    }, [chartData]);



    return (
        <Card className="w-full shadow-md bg-white dark:bg-gray-900 transition-colors duration-300">
            <div>
                <div className="pt-5 pl-5 text-md font-semibold text-gray-900 dark:text-gray-100">
                    Employee Experience Chart
                </div>
            </div>

            <CardContent className="pt-0">
                <div id="chartexperiencediv" className="w-full h-[550px]" />
            </CardContent>
        </Card>
    );
}