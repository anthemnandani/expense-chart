"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ExpenseRecord } from "@/lib/types"
import { apiService } from "@/lib/apiService"

interface DailyExpenseChart {
    years: number[];
    currency: string;
}

export const DailyExpenseChart: React.FC<DailyExpenseChart> = ({years, currency}) => {
    const [data, setData] = useState<ExpenseRecord[]>([])
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1) // current month
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()
    const groupId = user?.groupId

    const monthsList = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]
    useEffect(() => {
        if (!groupId) return
        const fetchData = async () => {
            setLoading(true)
            try {
                const data = await apiService.getDailyExpenses(groupId, selectedYear, selectedMonth)
                setData(data);
            } catch (error) {
                console.error('Error fetching daily expenses:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [groupId, selectedYear, selectedMonth])

    return (
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 col-span-12">
            <CardHeader className="flex justify-between flex-col lg:flex-row">
                <div>
                    <CardTitle className="flex items-center gap-2 text-md font-semibold">Daily Expenses ({monthsList[selectedMonth - 1]} {selectedYear})</CardTitle>
                </div>
                <div className="flex gap-2">
                    <select
                        className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs text-gray-800 dark:text-white rounded-md px-1 py-1"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    >
                        {monthsList.map((month, index) => (
                            <option key={month} value={index + 1}>{month}</option>
                        ))}
                    </select>

                    <select
                        className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs text-gray-800 dark:text-white rounded-md px-2 py-1"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        credit: { label: "Credit", color: "#22c55e" },
                        debit: { label: "Debit", color: "#3b82f6" },
                    }}
                    className="h-[350px] w-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 50, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="date"
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                dy={10} />
                            <YAxis />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const d = payload[0].payload
                                        return (
                                            <div className="bg-white p-2 border shadow rounded text-sm">
                                                <p><strong>{d.date}</strong></p>
                                                <p>Credit: {currency}{d.credit}</p>
                                                <p>Debit: {currency}{d.debit}</p>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Bar dataKey="credit" fill="#22c55e" barSize={8} />
                            <Bar dataKey="debit" fill="#3b82f6" barSize={8} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default DailyExpenseChart;