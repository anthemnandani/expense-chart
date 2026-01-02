"use client";
import React, { useState, useEffect, useCallback } from "react";
import { CardHeader, CardTitle } from "../ui/card";
import { useAuth } from "@/context/auth-context";
import { apiService } from "@/lib/apiService";

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface LeaveDetail {
    start: string;
    end?: string;
    days: number;
}

interface ShortLeaveDetail {
    date: string;
}

interface MonthlyData {
    leaves: number;
    shortLeaves: number;
    leaveDetails: LeaveDetail[];
    shortLeaveDetails: string[];
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
        leaveDetails: Record<string, LeaveDetail[]>;
        shortLeaveDetails: Record<string, string[]>;
    }>;
}

interface TooltipState {
    visible: boolean;
    type: 'leave' | 'short' | null;
    details: LeaveDetail[] | string[];
    x: number;
    y: number;
    arrowLeft: number;
}

/* ------------------ UI Helper Functions ------------------ */
const renderCell = (
    leave: number,
    shortLeave: number,
    leaveDetails: LeaveDetail[] = [],
    shortLeaveDetails: string[] = [],
    showTooltip: (e: React.MouseEvent<HTMLSpanElement>, type: 'leave' | 'short', details: LeaveDetail[] | string[]) => void,
    hideTooltip: () => void
) => {
    return (
        <div className="flex items-center justify-center w-full min-w-[50px] gap-[2px]">
            {/* LEAVES */}
            <div className="w-1/2 flex justify-center">
                {leave > 0 ? (
                    <span 
                        className={`bg-blue-500 text-white w-full rounded-sm text-xs font-semibold min-w-[24px] text-center shadow-sm ${leaveDetails.length > 0 ? 'cursor-pointer' : ''}`}
                        onMouseEnter={leaveDetails.length > 0 ? (e) => showTooltip(e, 'leave', leaveDetails) : undefined}
                        onMouseLeave={leaveDetails.length > 0 ? hideTooltip : undefined}
                    >
                        {leave}
                    </span>
                ) : (
                    <span className="w-[24px]" />
                )}
            </div>

            {/* SHORT LEAVES */}
            <div className="w-1/2 flex justify-center">
                {shortLeave > 0 ? (
                    <span 
                        className={`bg-green-500 text-white w-full rounded-sm font-semibold min-w-[24px] text-center shadow-sm text-xs ${shortLeaveDetails.length > 0 ? 'cursor-pointer' : ''}`}
                        onMouseEnter={shortLeaveDetails.length > 0 ? (e) => showTooltip(e, 'short', shortLeaveDetails) : undefined}
                        onMouseLeave={shortLeaveDetails.length > 0 ? hideTooltip : undefined}
                    >
                        {shortLeave}
                    </span>
                ) : (
                    <span className="w-[24px]" />
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
    const [tooltip, setTooltip] = useState<TooltipState>({visible: false, type: null, details: [], x: 0, y: 0, arrowLeft: 0});
    const { user } = useAuth()
    const toTitleCase = (name: string) => {
        return name
            .toLowerCase()
            .split(" ")
            .filter(Boolean)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const showTooltip = useCallback((e: React.MouseEvent<HTMLSpanElement>, type: 'leave' | 'short', details: LeaveDetail[] | string[]) => {
        if (details.length === 0) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const isLeave = type === 'leave';
        const tooltipWidth = isLeave ? 340 : 320;
        let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        const maxLeft = window.innerWidth - tooltipWidth;
        left = Math.max(0, Math.min(left, maxLeft));
        const arrowLeft = (rect.left + rect.width / 2) - left;
        setTooltip({
            visible: true,
            type,
            details,
            x: left,
            y: rect.bottom + 8,
            arrowLeft,
        });
    }, []);

    const hideTooltip = useCallback(() => {
        setTooltip(prev => ({...prev, visible: false}));
    }, []);

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
                        shortLeaves: emp.shortLeaves[month] || 0,
                        leaveDetails: emp.leaveDetails[month] || [],
                        shortLeaveDetails: emp.shortLeaveDetails[month] || []
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

    const isLeave = tooltip.type === 'leave';
    const tooltipWidthClass = isLeave ? 'w-[340px]' : 'w-[320px]';

    return (
        <div className="w-full p-4 bg-white rounded-2xl shadow-lg relative">
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
                <div className="overflow-x-auto overflow-y-visible">
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
                                        {months.map((month) => {
                                            const monthly = emp.monthly[month] || { leaves: 0, shortLeaves: 0, leaveDetails: [], shortLeaveDetails: [] };
                                            return (
                                                <td key={month} className="border px-1 py-0 text-center">
                                                    {renderCell(
                                                        monthly.leaves,
                                                        monthly.shortLeaves,
                                                        monthly.leaveDetails,
                                                        monthly.shortLeaveDetails,
                                                        showTooltip,
                                                        hideTooltip
                                                    )}
                                                </td>
                                            );
                                        })}
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
            {tooltip.visible && tooltip.type && (
                <div
                    className="fixed z-[10000] pointer-events-none"
                    style={{
                        left: `${tooltip.x}px`,
                        top: `${tooltip.y}px`,
                    }}
                >
                    <div
                        className={`bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 p-4 text-xs ${tooltipWidthClass}`}
                        onMouseEnter={() => setTooltip(prev => ({ ...prev, visible: true }))}
                        onMouseLeave={hideTooltip}
                        style={{ pointerEvents: 'auto' }}
                    >
                        {/* Arrow */}
                        <div
                            className="absolute -top-2 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45"
                            style={{
                                left: `${tooltip.arrowLeft}px`,
                            }}
                        ></div>

                        <div className="font-semibold mb-2 border-b pb-1">
                            <span className={isLeave ? 'text-blue-600' : 'text-green-600'}>
                                {isLeave ? 'Leave Details' : 'Short Leave Dates'}
                            </span>
                        </div>

                        {isLeave ? (
                            <div className="space-y-1">
                                {(tooltip.details as LeaveDetail[]).map((detail, idx) => (
                                    <div key={idx} className="flex justify-between">
                                        <span>
                                            {detail.start}
                                            {detail.end ? ` → ${detail.end}` : ""}
                                        </span>
                                        <span className="font-medium text-gray-600">
                                            {detail.days} day{detail.days > 1 ? "s" : ""}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-1">
                                {(tooltip.details as string[]).map((date, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-gray-50 border rounded px-2 py-1 text-center"
                                    >
                                        {date}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}