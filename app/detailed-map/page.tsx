"use client"

import DashboardLayout from "@/components/dashboard-layout"
import ExpenseTreeChartDetailed from "@/components/ExpenseTreeChartDetailed"
import { CardContent, CardHeader, CardTitle, Card } from "@/components/ui/card"

export default function DetailedMapPage() {
    return (
        <DashboardLayout>
             <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 col-span-3">
            <CardHeader className="flex justify-between lg:flex-row flex-col items-center gap-3">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                     Detailed Category View
                </CardTitle>
            </CardHeader>

            <CardContent>
                <ExpenseTreeChartDetailed />
            </CardContent>
        </Card>
        </DashboardLayout>
    )
}