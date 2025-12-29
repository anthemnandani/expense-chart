"use client";

import React, { useState, useEffect } from "react";
import { CardHeader, CardTitle } from "../ui/card";
import { useAuth } from "@/context/auth-context";
import { apiService } from "@/lib/apiService";

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface MonthlyData {
    leaves: number;
    shortLeaves: number;
}

interface EmployeeData {
    name: string;
    monthly: Record<string, MonthlyData>;
    totalShortLeaves: number;
    totalLeaves: number;
}

interface ApiResponse {
    year: number;
    employees: Array<{
        id: string;
        name: string;
        leaves: Record<string, number>;
        shortLeaves: Record<string, number>;
        totalLeaves: number;
        totalShortLeaves: number;
    }>;
}

/* ------------------ UI Helper Functions ------------------ */

const renderCell = (leave: number, shortLeave: number) => {
    return (
        <div className="flex items-center justify-center w-full min-w-[50px] gap-[2px]">
            {/* LEFT HALF → LEAVES */}
            <div className="w-1/2 flex justify-center">
                {leave > 0 ? (
                    <span className="bg-blue-500 text-white w-full rounded-sm text-xs font-semibold min-w-[24px] text-center shadow-sm">
                        {leave}
                    </span>
                ) : (
                    <span className="w-[24px]"></span>
                )}
            </div>

            {/* RIGHT HALF → SHORT LEAVES */}
            <div className="w-1/2 flex justify-center text-xs">
                {shortLeave > 0 ? (
                    <span className="bg-green-500 text-white w-full rounded-sm font-semibold min-w-[24px] text-center shadow-sm">
                        {shortLeave}
                    </span>
                ) : (
                    <span className="w-[24px]"></span>  // blank but reserved
                )}
            </div>
        </div>
    );
};

const renderTotalCell = (value: number, isShort = false) => (
    <div className="flex justify-center">
        <span
            className={`${isShort ? "bg-green-500" : "bg-blue-500"
                } text-white px-1 py-1 w-full rounded-md text-sm font-semibold shadow-sm min-w-[40px] text-center`}
        >
            {value}
        </span>
    </div>
);

/* ------------------ MAIN COMPONENT ------------------ */

export default function EmployeeLeavesChart({ years }) {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth()

    const toTitleCase = (name: string) => {
        return name
            .toLowerCase()
            .split(" ")
            .filter(Boolean)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    // Fetch data dynamically
    const fetchData = async () => {
        try {
            setLoading(true);

            const apiData = await apiService.getEmployeeLeaves(selectedYear, user.token);
            if (!apiData) return;

            // Process API data to match EmployeeData interface
            const processedData: EmployeeData[] = apiData.employees.map(emp => ({
                name: emp.name,
                monthly: months.reduce((acc, month) => {
                    acc[month] = {
                        leaves: emp.leaves[month] || 0,
                        shortLeaves: emp.shortLeaves[month] || 0
                    };
                    return acc;
                }, {} as Record<string, MonthlyData>),
                totalShortLeaves: emp.totalShortLeaves,
                totalLeaves: emp.totalLeaves
            }));

            setEmployeeData(processedData);
        } catch (err) {
            console.error("Error fetching leaves data:", err);
            setEmployeeData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedYear]);

    return (
        <div className="w-full p-4 bg-white rounded-2xl shadow-lg">
            <div className="">
                <CardHeader className="pb-4 pl-0 pr-0 flex justify-between lg:flex-row flex-col">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white text-md">
                            Employees Leaves Report{" "}
                            <span className="text-blue-600">(Leaves</span>/
                            <span className="text-green-600">Short Leaves)</span>
                        </CardTitle>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs rounded-md px-2 py-1"
                        >
                            {years.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>
                </CardHeader>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="h-[400px] flex items-center justify-center">
                            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                        </div>
                    ) : employeeData.length === 0 ? (
                        <div className="h-[400px] flex items-center justify-center text-gray-500">
                            No data available
                        </div>
                    ) : (
                        <table className="min-w-full border text-xs border-gray-300">
                            <thead>
                                <tr className="bg-gray-100 ">
                                    <th className="border px-2 py-2 min-w-[120px] text-left">Name</th>

                                    {months.map((month) => (
                                        <th key={month} className="border px-2 py-2 text-center">
                                            {month}
                                        </th>
                                    ))}

                                    <th className="border px-2 py-2 text-center">Short Leaves</th>
                                    <th className="border px-2 py-2 text-center">Total Leaves</th>
                                </tr>
                            </thead>

                            <tbody className="">
                                {employeeData.map((emp, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="border font-medium px-2">
                                            {toTitleCase(emp.name)}
                                        </td>

                                        {months.map((month) => (
                                            <td key={month} className="border px-1 py-0 text-center">
                                                {renderCell(
                                                    emp.monthly[month]?.leaves || 0,
                                                    emp.monthly[month]?.shortLeaves || 0
                                                )}
                                            </td>
                                        ))}

                                        <td className="border min-w-[80px] px-1 text-center">
                                            {renderTotalCell(emp.totalShortLeaves, true)}
                                        </td>

                                        <td className="border min-w-[80px] px-1 text-center">
                                            {renderTotalCell(emp.totalLeaves)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}