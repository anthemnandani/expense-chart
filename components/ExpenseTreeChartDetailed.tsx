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

export default function ExpenseTreeChartDetailed() {
    const [treeData, setTreeData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const chartRef = useRef<any>(null)
    const { user } = useAuth()
    const groupId = user?.groupId

    useEffect(() => {
        async function fetchData() {
            if (!groupId) return
            try {
                const data = await apiService.getTreeGraphData(groupId)
                const nested = buildTree(data)
                setTreeData(nested)
            } catch (err) {
                console.error("Failed to load tree data", err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    function buildTree(flat: TreeNode[]): any[] {
        const idMap: Record<string, any> = {}
        const roots: any[] = []

        flat.forEach((node) => {
            const level = node.id.split("-").length - 1
            let symbol = "circle"
            if (level === 0) symbol = "rect"
            else if (level === 1) symbol = "circle"
            else symbol = "diamond"

            idMap[node.id] = {
                ...node,
                children: [],
                symbol,
                symbolSize: 14,
                itemStyle: node.color ? { color: node.color } : undefined
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
        tooltip: {
            trigger: "item",
            triggerOn: "mousemove",
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
                    fontSize: 13
                },
                leaves: {
                    label: {
                        position: "right",
                        verticalAlign: "middle",
                        align: "left",
                        fontSize: 13
                    }
                },
                lineStyle: { color: "#ccc" },
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
