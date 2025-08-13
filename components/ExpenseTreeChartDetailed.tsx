"use client"

import React, { useEffect, useState, useRef } from "react"
import ReactECharts from "echarts-for-react"
import { apiService } from "@/lib/apiService"
import { useAuth } from "@/context/auth-context"

type TreeNode = {
    id: string
    parent?: string
    name: string
    color?: string
}

interface ExpenseTreeChartDetailed {
  currency: string;
}

export const ExpenseTreeChartDetailed: React.FC<ExpenseTreeChartDetailed> = ({
  currency
}) => {
    const [isDark, setIsDark] = useState(false)
    const [treeData, setTreeData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [years, setYears] = useState<number[]>([]);
    const chartRef = useRef<any>(null)
    const { user } = useAuth()
    const groupId = user?.groupId

    // Watch Tailwind's dark mode
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"))
        })
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"]
        })
        setIsDark(document.documentElement.classList.contains("dark"))
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const fetchYears = async () => {
            if (!groupId) return;
            const fetchedYears = await apiService.getAvailableYears(groupId);
            setYears(fetchedYears);
            console.log("years: ", years);
        };
        fetchYears();
    }, [groupId]);

    useEffect(() => {
        async function fetchData() {
            if (!groupId || years.length === 0) return
            try {
                const data = await apiService.getTreeGraphData(groupId, years, currency)
                const nested = buildTree(data)
                setTreeData(nested)
            } catch (err) {
                console.error("Failed to load tree data", err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [years, groupId])

    function buildTree(flat: TreeNode[], isDark: boolean): any[] {
        const idMap: Record<string, any> = {}
        const roots: any[] = []

        flat.forEach((node) => {
            const parts = node.id.split("-")
            const level = parts.length - 1

            let symbol = "circle"
            let customColor = "#9ca3af"

            if (node.id === "root") {
                symbol = "diamond"
                customColor = isDark ? "#fb8b24" : "#e36414"
            } else if (node.parent === "root") {
                symbol = "rect"
                customColor = isDark ? "#48cae4" : "#0077b6"
            } else if (level === 1) {
                symbol = "circle"
                customColor = isDark ? "#a7c957" : "#6a994e"
            } else {
                symbol = "diamond"
                customColor = isDark ? "#89c2d9" : "#02c39a"
            }

            idMap[node.id] = {
                ...node,
                children: [],
                symbol,
                symbolSize: 14,
                itemStyle: { color: customColor }
            }
        })

        flat.forEach((node) => {
            if (node.parent && idMap[node.parent]) {
                idMap[node.parent].children.push(idMap[node.id])
            } else {
                roots.push(idMap[node.id])
            }
        })

        return roots
    }

    const option = {
        backgroundColor: isDark ? "#1f2937" : "#ffffff",
        tooltip: {
            trigger: "item",
            triggerOn: "mousemove",
            backgroundColor: isDark ? "#374151" : "#f9fafb",
            borderColor: isDark ? "#4b5563" : "#e5e7eb",
            textStyle: { color: isDark ? "#f9fafb" : "#111827" },
            formatter: (params: any) => `<b>${params.data.name}</b>`
        },
        series: [
            {
                type: "tree",
                data: treeData,
                layout: "orthogonal",
                orient: "LR",
                top: "5%",
                left: "15%",
                bottom: "5%",
                right: "20%",
                symbolSize: 14,
                label: {
                    position: "left",
                    verticalAlign: "middle",
                    align: "right",
                    fontSize: 13,
                    color: isDark ? "#f9fafb" : "#111827"
                },
                leaves: {
                    label: {
                        position: "right",
                        verticalAlign: "middle",
                        align: "left",
                        fontSize: 13,
                        color: isDark ? "#f9fafb" : "#111827"
                    }
                },
                lineStyle: { color: isDark ? "#6b7280" : "#d1d5db" },
                expandAndCollapse: true,
                initialTreeDepth: 999,
                animationDuration: 350,
                animationDurationUpdate: 350,
                roam: false,
                emphasis: {
                    focus: 'descendant'
                },
                nodePadding: 25
            }
        ]
    }

    const onChartReady = (chart: any) => {
        chartRef.current = chart
    }

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded-md w-[90%] h-[80%]" />
            </div>
        )
    }

    return (
        <div className="w-full h-[1700px]">
            <ReactECharts
                option={option}
                style={{ height: "100%", width: "100%" }}
                onChartReady={onChartReady}
            />
        </div>
    )
}

export default ExpenseTreeChartDetailed;