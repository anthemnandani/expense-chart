"use client";

import React, { useLayoutEffect, useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { apiService } from "@/lib/apiService";

export default function ProjectShowcaseChart() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const response = await apiService.getProjectChart(user.token);

        if (response?.success) {
          setChartData(response.data);
          if (response.data.length > 0) {
            setSelectedYear(response.data.at(-1).category);
          }
        }
        if (response.success) {
          setChartData(response.data);
          // Set initial selected year to the last one if data is available
          if (response.data.length > 0) {
            setSelectedYear(response.data[response.data.length - 1].category);
          }
        }
      } catch (err) {
        console.error("Failed to load projects data", err);
      }
    }

    if (user?.token) {
      loadData();
    }
  }, [user?.token]);

  useLayoutEffect(() => {
    if (chartData.length === 0) return () => { };

    const root = am5.Root.new("chartdiv");
    root.setThemes([am5themes_Animated.new(root)]);
    const container = root.container.children.push(
      am5.Container.new(root, {
        width: am5.p100,
        height: am5.p100,
        layout: root.horizontalLayout,
      })
    );
    const colors = [
      "#124e78",
      "#d0b49f",
      "#69140e",
      "#00cecb",
      "#606c38",
      "#ccd5ae",
      "#ff6d00",
      "#e9c46a",
      "#0052e0",
      "#f28482",
    ];
    /* ---------- MAIN PIE ---------- */
    const chart = container.children.push(
      am5percent.PieChart.new(root, {
        tooltip: am5.Tooltip.new(root, {
          labelText: "{category}: {value} projects",
        }),
      })
    );
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: false,
        colors: am5.ColorSet.new(root, { colors: colors.map((c) => am5.color(c)) }),
      })
    );
    series.labels.template.setAll({
      textType: "circular",
      radius: 6,
      fontSize: 9,
      fill: am5.color(0x000000),
      fontWeight: "400",
      text: "[fontSize:12 bold]{value}[/][fontSize:7] ({category})[/]",
    });
    series.slices.template.setAll({
      toggleKey: "none",
      cursorOverStyle: "pointer",
      tooltipText: "{category}: {value} projects",
    });
    series.slices.template.states.create("hover", {
      scale: 1.04,
    });
    series.ticks.template.set("visible", false);
    /* ---------- SUB PIE ---------- */
    const subChart = container.children.push(
      am5percent.PieChart.new(root, {
        radius: am5.percent(55),
        tooltip: am5.Tooltip.new(root, {
          labelText:
            "[bold]{category}[/]\nProjects: {value}\n\n{projectInfo}",
          maxWidth: 420,
          minWidth: 300,
          multiline: true,
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 8,
          paddingBottom: 0,
        }),
      })
    );
    const subSeries = subChart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        colors: am5.ColorSet.new(root, { colors: colors.map((c) => am5.color(c)) }),
      })
    );
    // Dynamically set max sub categories based on data (find global max)
    const maxSub = Math.max(...chartData.map(d => d.subData?.length || 0), 1);
    subSeries.data.setAll(
      new Array(maxSub).fill(0).map((_, i) => ({
        category: `Item ${i + 1}`,
        value: 0,
        projectInfo: "",
      }))
    );
    subSeries.labels.template.setAll({
      textType: "circular",
      radius: 6,
      fontSize: 9,
      fill: am5.color(0x000000),
      text: "{category}: {value}",
    });
    subSeries.ticks.template.set("visible", false);
    subSeries.slices.template.set("toggleKey", "none");
    /* ---------- LINES ---------- */
    const line0 = container.children.push(
      am5.Line.new(root, {
        position: "absolute",
        stroke: root.interfaceColors.get("text"),
        strokeDasharray: [3, 3],
        strokeOpacity: 0.5,
      })
    );
    const line1 = container.children.push(
      am5.Line.new(root, {
        position: "absolute",
        stroke: root.interfaceColors.get("text"),
        strokeDasharray: [3, 3],
        strokeOpacity: 0.5,
      })
    );
    let selectedSlice: am5percent.PieSlice | undefined;
    function updateLines() {
      if (!selectedSlice || subSeries.slices.length === 0) return;
      const startAngle = selectedSlice.get("startAngle");
      const arc = selectedSlice.get("arc");
      const radius = selectedSlice.get("radius");
      const x00 = radius * am5.math.cos(startAngle);
      const y00 = radius * am5.math.sin(startAngle);
      const x10 = radius * am5.math.cos(startAngle + arc);
      const y10 = radius * am5.math.sin(startAngle + arc);
      const subRadius = subSeries.slices.getIndex(0)?.get("radius") || 0;
      const point00 = series.toGlobal({ x: x00, y: y00 });
      const point10 = series.toGlobal({ x: x10, y: y10 });
      const point01 = subSeries.toGlobal({ x: 0, y: -subRadius });
      const point11 = subSeries.toGlobal({ x: 0, y: subRadius });
      line0.set("points", [point00, point01]);
      line1.set("points", [point10, point11]);
    }
    function selectSlice(slice: am5percent.PieSlice) {
      selectedSlice = slice;
      const ctx = slice.dataItem?.dataContext as any;
      if (!ctx) return;
      setSelectedYear(ctx.category);
      // Reset sub data
      for (let i = 0; i < maxSub; i++) {
        subSeries.dataItems[i]?.hide();
      }
      if (ctx.subData) {
        ctx.subData.forEach((sub: any, i: number) => {
          if (sub && sub.projects) {
            const projectInfo = sub.projects.map((p: any) => {
              let name = p.name;
              const wrapLength = 40;
              let wrapped = '';
              while (name.length > wrapLength) {
                let lastSpace = name.lastIndexOf(' ', wrapLength);
                if (lastSpace === -1) lastSpace = wrapLength;
                wrapped += name.substring(0, lastSpace) + '\n';
                name = name.substring(lastSpace + 1).trimStart();
              }
              wrapped += name;
              return wrapped;
            }).join('\n\n');
            const subWithInfo = { ...sub, projectInfo };
            if (subSeries.dataItems[i]) {
              subSeries.dataItems[i]?.show();
              subSeries.data.setIndex(i, subWithInfo);
            }
          }
        });
      }
      const middleAngle =
        slice.get("startAngle") + slice.get("arc") / 2;
      const firstSlice = series.dataItems[0]?.get("slice");
      if (!firstSlice) return;
      const firstAngle = firstSlice.get("startAngle");
      series.animate({
        key: "startAngle",
        to: firstAngle - middleAngle,
        duration: 800,
        easing: am5.ease.out(am5.ease.cubic),
      });
      series.animate({
        key: "endAngle",
        to: firstAngle - middleAngle + 360,
        duration: 800,
        easing: am5.ease.out(am5.ease.cubic),
      });
    }
    series.slices.template.events.on("click", (e) =>
      selectSlice(e.target)
    );
    series.on("startAngle", updateLines);
    container.events.on("boundschanged", () =>
      root.events.once("frameended", updateLines)
    );
    series.data.setAll(chartData);
    series.events.on("datavalidated", () => {
      const last = series.slices.getIndex(series.slices.length - 1);
      if (last) selectSlice(last);
    });
    container.appear(800, 20);
    return () => {
      root.dispose();
    };
  }, [chartData]);

  return (
    <Card className="w-full bg-white dark:bg-gray-900 shadow-xl border-0">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-md text-gray-800 dark:text-white font-bold">
          <span>Projects by Year</span>
          <span className="text-sm text-muted-foreground">
            Selected: {selectedYear || "Loading..."}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          id="chartdiv"
          className="w-full h-[520px] rounded-xl dark:from-gray-800 dark:to-gray-700"
        />
      </CardContent>
    </Card>
  );
}