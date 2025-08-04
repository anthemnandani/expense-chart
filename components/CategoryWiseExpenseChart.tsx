'use client'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

type ExpenseEntry = {
    month: string
    expenseDescType: string
    totalExpenses: number
}

const dashStyles = ['Solid', 'Dash', 'Dot', 'DashDot', 'LongDash', 'ShortDash', 'ShortDot', 'ShortDashDot']

const rawCategoryData: ExpenseEntry[] = [
    { month: '1', expenseDescType: 'Party', totalExpenses: 753 },
    { month: '1', expenseDescType: 'Tea', totalExpenses: 2530 },
    { month: '1', expenseDescType: 'Water', totalExpenses: 520 },
    { month: '2', expenseDescType: 'Party', totalExpenses: 733 },
    { month: '2', expenseDescType: 'Tea', totalExpenses: 3275 },
    { month: '3', expenseDescType: 'Other', totalExpenses: 300 },
    { month: '4', expenseDescType: 'Party', totalExpenses: 800 },
    { month: '4', expenseDescType: 'Tea', totalExpenses: 1500 },
    { month: '5', expenseDescType: 'Water', totalExpenses: 700 },
    { month: '6', expenseDescType: 'Party', totalExpenses: 500 },
    { month: '6', expenseDescType: 'Other', totalExpenses: 900 },
    { month: '7', expenseDescType: 'Tea', totalExpenses: 2200 },
    { month: '8', expenseDescType: 'Party', totalExpenses: 1250 },
    { month: '9', expenseDescType: 'Water', totalExpenses: 350 },
    { month: '10', expenseDescType: 'Other', totalExpenses: 1100 },
]

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const categories = [...new Set(rawCategoryData.map((d) => d.expenseDescType))]

const seriesData = categories.map((category, index) => {
    const data: (number | null)[] = new Array(12).fill(null)
    rawCategoryData.forEach((entry) => {
        if (entry.expenseDescType === category) {
            const monthIndex = parseInt(entry.month, 10) - 1
            data[monthIndex] = entry.totalExpenses
        }
    })
    return {
        name: category,
        data,
        dashStyle: dashStyles[index % dashStyles.length],
    }
})

function useChartOptions(): Highcharts.Options {
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.documentElement.classList.contains('dark'))
        })
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
        setIsDarkMode(document.documentElement.classList.contains('dark'))
        return () => observer.disconnect()
    }, [])

    return {
        chart: {
            type: 'spline',
            backgroundColor: 'transparent',
        },
        title: {
            text: 'Category-wise Monthly Expenses',
            style: { color: isDarkMode ? '#f9fafb' : '#1f2937' },
        },
        xAxis: {
            categories: monthLabels,
            title: { text: 'Month', style: { color: isDarkMode ? '#d1d5db' : '#4b5563' } },
            labels: { style: { color: isDarkMode ? '#d1d5db' : '#4b5563' } },
            gridLineColor: isDarkMode ? '#374151' : '#e5e7eb',
        },
        yAxis: {
            title: { text: 'Total Expenses (₹)', style: { color: isDarkMode ? '#d1d5db' : '#4b5563' } },
            labels: { style: { color: isDarkMode ? '#d1d5db' : '#4b5563' } },
            gridLineColor: isDarkMode ? '#374151' : '#e5e7eb',
        },
        legend: {
            align: 'center',               // 'left', 'center', 'right'
            verticalAlign: 'bottom',       // 'top', 'middle', 'bottom'
            layout: 'horizontal',          // 'horizontal' or 'vertical'
            backgroundColor: isDarkMode ? '#111827' : '#ffffff',  // Tailwind dark:bg-gray-900
            itemStyle: {
                color: isDarkMode ? '#f9fafb' : '#1f2937',           // Tailwind gray-50 / gray-800
                fontWeight: '500',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
            },
            borderColor: isDarkMode ? '#374151' : '#e5e7eb',
            symbolWidth: 40
        },
        tooltip: {
            shared: true,
            valuePrefix: '₹',
            stickOnContact: true,
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            style: { color: isDarkMode ? '#f9fafb' : '#1f2937' },
        },
        plotOptions: {
            series: {
                connectNulls: true,
                marker: {
                    enabled: true,
                    radius: 4,
                },
                cursor: 'pointer',
                lineWidth: 2
            },
        },
        series: seriesData as Highcharts.SeriesOptionsType[],
        credits: { enabled: false },
        accessibility: { enabled: true },
    }
}

export function CategoryWiseExpenseChart() {
    const options = useChartOptions();
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return null


    return (
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 col-span-8">
            <CardHeader className='flex justify-between flex-col lg:flex-row'>
                <div>
                    <CardTitle className="text-lg font-bold text-gray-800 dark:text-white">
                        Monthly Category Line Chart
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-gray-300">
                        Dotted & dashed lines show expense category trends across months.
                    </CardDescription>
                </div>
                <div className="flex gap-2 items-center">
                    <select
                        className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs text-gray-800 dark:text-white rounded-md px-2 py-1"
                        defaultValue={2025}
                    >
                        {[2025, 2024, 2023].map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </CardHeader>
            <CardContent>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </CardContent>
        </Card>
    )
}
