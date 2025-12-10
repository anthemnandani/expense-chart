"use client";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo, useState, useEffect } from "react";
import { CardHeader, CardTitle } from "../ui/card";

const LeaveChart = ({ years }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch data dynamically
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`https://employee-dashboard-backend-api.vercel.app/api/leave-report/${selectedYear}`);
            const fetchedData = await res.json();
            setData(fetchedData);
        } catch (err) {
            console.error("Error fetching leave data:", err);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedYear]);

    const categories = useMemo(
        () => (data?.employees || []).map(e => e.name),
        [data]
    );

    const fullLeaves = useMemo(
        () => (data?.employees || []).map(e => Math.min(e.fullLeaves, e.allowedLeaves)),
        [data]
    );

    const exceededLeaves = useMemo(
        () => (data?.employees || []).map(e => e.fullLeaves > e.allowedLeaves ? e.fullLeaves - e.allowedLeaves : 0),
        [data]
    );

    const shortLeaves = useMemo(
        () => (data?.employees || []).map(e => e.shortLeaves),
        [data]
    );

    const options = useMemo(
        () => ({
            chart: {
                type: "column",
                backgroundColor: "#ffffff",
                borderRadius: 14
            },
            title: {
                text: undefined,
                style: {
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#111"
                }
            },
            xAxis: {
                categories,
                labels: {
                    rotation: -40,
                    style: { fontSize: "11px", fontWeight: "500", color: "#333" }
                }
            },
            yAxis: {
                min: 0,
                title: { text: "Leaves Count" },
                gridLineColor: "#e5e7eb",
                reversedStacks: false
            },
            tooltip: {
                shared: true,
                useHTML: true,
                formatter: function () {
                    const index = this.points[0].point.index;
                    const emp = (data?.employees || [])[index] || {};
                    const totalTaken = emp.fullLeaves;
                    const allowed = emp.allowedLeaves;
                    const short = emp.shortLeaves;
                    const exceeded = emp.fullLeaves > emp.allowedLeaves ? emp.fullLeaves - emp.allowedLeaves : 0;
                    return `
                        <div style="padding:6px 8px;">
                            <div style="margin-bottom: 8px; font-weight: bold;">${this.x}</div>
                            <div style="margin-bottom: 6px;">Total Taken Leave: <b>${totalTaken}</b></div>
                            <div style="margin-bottom: 6px;">Total Allowed Leave: <b>${allowed}</b></div>
                            <div style="margin-bottom: 6px;">Exceeded Leaves: <b style="color:#dc2626">${exceeded}</b></div>
                            <div style="margin-bottom: 6px;">Short Leave: <b style="color:#059669">${short}</b></div>
                        </div>
                    `;
                }
            },
            plotOptions: {
                column: {
                    borderRadius: 4,
                    grouping: true
                }
            },
            series: [
                {
                    name: "Full Leaves",
                    data: fullLeaves,
                    color: "#3b82f6",
                    stacking: "normal",
                    stack: "leaveStack"
                },
                {
                    name: "Exceeded Leaves",
                    data: exceededLeaves,
                    color: "#ef4444",
                    stacking: "normal",
                    stack: "leaveStack"
                },
                {
                    name: "Short Leaves",
                    data: shortLeaves,
                    color: "#10b981",
                    stacking: null
                }
            ],
            legend: {
                itemStyle: { fontWeight: "500", color: "#111" }
            },
            credits: { enabled: false }
        }),
        [categories, fullLeaves, exceededLeaves, shortLeaves, data]
    );

    if (loading) {
        return (
            <div className="w-full bg-white rounded-2xl shadow p-6 flex items-center justify-center h-[400px]">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="w-full bg-white rounded-2xl shadow p-6 flex items-center justify-center h-[400px] text-gray-500">
                No data available
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-2xl shadow p-6">
            <CardHeader className="flex justify-between lg:flex-row flex-col">
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                    Employees Yearly Leave Data (Allowed Leaves: {data.totalAllowedLeaves})
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
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default LeaveChart;