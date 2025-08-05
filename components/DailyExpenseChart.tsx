import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

export function DailyExpenseChart() {
    const monthlyExpenseData = [
        { date: "01/07/2025", credit: 0, debit: 100 },
        { date: "02/07/2025", credit: 0, debit: 0 },
        { date: "03/07/2025", credit: 5000, debit: 300 },
        { date: "04/07/2025", credit: 4000, debit: 150 },
        { date: "05/07/2025", credit: 0, debit: 1800 },
        { date: "06/07/2025", credit: 2000, debit: 200 },
        { date: "07/07/2025", credit: 0, debit: 0 },
        { date: "08/07/2025", credit: 1000, debit: 300 },
        { date: "09/07/2025", credit: 0, debit: 120 },
        { date: "10/07/2025", credit: 300, debit: 100 },
        { date: "11/07/2025", credit: 200, debit: 600 },
        { date: "12/07/2025", credit: 0, debit: 0 },
        { date: "13/07/2025", credit: 4000, debit: 900 },
        { date: "14/07/2025", credit: 0, debit: 100 },
        { date: "15/07/2025", credit: 500, debit: 1100 },
        { date: "16/07/2025", credit: 0, debit: 0 },
        { date: "17/07/2025", credit: 1000, debit: 500 },
        { date: "18/07/2025", credit: 700, debit: 200 },
        { date: "19/07/2025", credit: 0, debit: 300 },
        { date: "20/07/2025", credit: 100, debit: 150 },
        { date: "21/07/2025", credit: 300, debit: 100 },
        { date: "22/07/2025", credit: 200, debit: 150 },
        { date: "23/07/2025", credit: 100, debit: 90 },
        { date: "24/07/2025", credit: 0, debit: 120 },
        { date: "25/07/2025", credit: 150, debit: 100 },
        { date: "26/07/2025", credit: 0, debit: 0 },
        { date: "27/07/2025", credit: 250, debit: 300 },
        { date: "28/07/2025", credit: 0, debit: 0 },
        { date: "29/07/2025", credit: 100, debit: 90 },
        { date: "30/07/2025", credit: 0, debit: 700 },
        { date: "31/07/2025", credit: 1500, debit: 500 },
    ]

    return (
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 col-span-12">
            <CardHeader className="flex justify-between flex-col lg:flex-row">
                <div>
                    <CardTitle className="flex items-center gap-2">Daily Expenses (July 2025)</CardTitle>
                    <CardDescription>Track your daily expenses and credits</CardDescription>
                </div>
                <div className="flex gap-2">
                    <select
                        className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs text-gray-800 dark:text-white rounded-md px-1 py-1"
                        defaultValue="August"
                    >
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                            'September', 'October', 'November', 'December'].map((month) => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                    </select>

                    <select
                        className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs text-gray-800 dark:text-white rounded-md px-2 py-1"
                        defaultValue={2025}
                    >
                        {[2023, 2024, 2025].map((year) => (
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
                        <BarChart data={monthlyExpenseData} margin={{ top: 20, right: 20, bottom: 50, left: 0 }}>
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
                                                <p>Credit: ₹{d.credit}</p>
                                                <p>Debit: ₹{d.debit}</p>
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