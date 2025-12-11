"use client";

import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";

export const DepartmentTreeChart = () => {
    const [treeData, setTreeData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDark, setIsDark] = useState(false);
    const [roamEnabled, setRoamEnabled] = useState(false);
  const { user } = useAuth()

    // WATCH TAILWIND DARK MODE
    useEffect(() => {
        const obs = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
        });
        obs.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        setIsDark(document.documentElement.classList.contains("dark"));
        return () => obs.disconnect();
    }, []);

    // ----------- FETCH TREE DATA (USING YOUR FORMAT) -----------
    const fetchTreeData = async () => {
        try {
            setLoading(true);

            const res = await fetch(
                `https://employee-dashboard-backend-api.vercel.app/api/dashboard-charts/employee-tree?token=${encodeURIComponent(user?.token)}`
            );
            const fetchedData = await res.json();

            if (!fetchedData.status) {
                console.error("Invalid response:", fetchedData);
                return;
            }

            // ⭐ CUSTOM ORDER HERE
            const order = [
                "CEO",
                "Project Manager",
                "Team Leader",
                "Senior Developer",
                "Developer",
                "Junior Developer",
                "BDE",
            ];

            fetchedData.designations.sort(
                (a, b) => order.indexOf(a.designation) - order.indexOf(b.designation)
            );

            // Build ECharts tree
            const builtTree = buildTree(fetchedData, isDark);
            setTreeData([builtTree]);

        } catch (err) {
            console.error("Error fetching employee tree:", err);
            setTreeData([]);
        } finally {
            setLoading(false);
        }
    };

    // Trigger fetch when theme changes
    useEffect(() => {
        fetchTreeData();
    }, [isDark]);

    // BUILD TREE (ROOT > DESIGNATIONS > EMPLOYEES)
    function buildTree(apiData: any, isDark: boolean) {
        const rootNode = {
            name: `Employees (${apiData.totalEmployees})`,
            symbol: "diamond",
            symbolSize: 18,
            itemStyle: { color: isDark ? "#fb8b24" : "#e36414" },
            children: [],
        };

        apiData.designations.forEach((desig: any) => {
            const desigNode = {
                name: `${desig.designation} (${desig.count})`,
                symbol: "rect",
                symbolSize: 14,
                itemStyle: { color: isDark ? "#48cae4" : "#0077b6" },
                children: desig.employees.map((emp: string) => ({
                    name: emp,
                    symbol: "circle",
                    symbolSize: 10,
                    itemStyle: { color: isDark ? "#a7c957" : "#6a994e" },
                })),
            };

            rootNode.children.push(desigNode);
        });

        return rootNode;
    }

    const option = {
        backgroundColor: isDark ? "#1f2937" : "#ffffff",
        tooltip: {
            trigger: "item",
            backgroundColor: isDark ? "#374151" : "#f9fafb",
            borderColor: isDark ? "#4b5563" : "#e5e7eb",
            textStyle: { color: isDark ? "#f9fafb" : "#111827" },
            formatter: (p: any) => `<b>${p.data.name}</b>`,
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
                right: "15%",
                symbolSize: 14,
                label: {
                    position: "left",
                    verticalAlign: "middle",
                    align: "right",
                    fontSize: 13,
                    color: isDark ? "#f9fafb" : "#111827",
                },
                leaves: {
                    label: {
                        position: "right",
                        verticalAlign: "middle",
                        align: "left",
                        fontSize: 13,
                        color: isDark ? "#f9fafb" : "#111827",
                    },
                },

                // 📌 GAP BETWEEN LEVELS (increase here)
                nodePadding: 60,
                lineStyle: { color: isDark ? "#6b7280" : "#d1d5db" },
                expandAndCollapse: true,
                initialTreeDepth: 5,
                emphasis: { focus: "descendant" },
                animationDuration: 350,
                animationDurationUpdate: 350,
                roam: roamEnabled,
            },
        ],
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 pt-2 pl-2">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Designation-wise Employee Tree
                </CardTitle>
            </CardHeader>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <ReactECharts style={{ height: "600px" }} option={option} />
            )}
        </div>
    );
};
