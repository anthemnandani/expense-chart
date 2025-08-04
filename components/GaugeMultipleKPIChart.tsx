'use client'

import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
import SolidGauge from 'highcharts/modules/solid-gauge'

// Initialize once
if (typeof HighchartsMore === 'function') HighchartsMore(Highcharts)
if (typeof SolidGauge === 'function') SolidGauge(Highcharts)

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { useEffect, useState } from 'react'

// Static Data
const categoryData = [
    { expenseDescType: 'Tea', totalExpenses: 3100 },
    { expenseDescType: 'Water', totalExpenses: 520 },
    { expenseDescType: 'Party', totalExpenses: 296 },
    { expenseDescType: 'Other', totalExpenses: 300 }
]

export default function GaugeMultipleKPIChart() {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return null

    const colors = ['#0088fe', '#00c49f', '#a259ff', '#ff7300']
    const maxValue = Math.max(...categoryData.map(item => item.totalExpenses), 3500)
    const trackColors = colors.map(color => Highcharts.color(color).setOpacity(0.15).get())

    const chartOptions: Highcharts.Options = {
        chart: {
            type: 'solidgauge',
            height: '110%',
            backgroundColor: 'transparent',
            spacingBottom: 60 // Add space for bottom elements
        },
        title: {
            text: undefined,
            style: {
                fontSize: '18px',
                color: 'var(--foreground)',
                fontWeight: '600'
            }
        },
        tooltip: {
            borderWidth: 0,
            backgroundColor: '#fff',
            borderRadius: 5,
            shadow: true,
            useHTML: true,
            style: {
                fontSize: '14px',
                color: '#333',
                padding: '10px'
            },
            pointFormatter: function () {
                const percent = ((this.y / maxValue) * 100).toFixed(1)
                return `
                    <div style="text-align: center;">
                        <div style="display: flex; justify-content: space-between; padding-bottom: 2px">
                            <div style="font-weight: bold; font-size: 15px; color: ${this.color}">${this.series.name}</div>
                            <div style="font-size: 14px;">₹${this.y.toLocaleString()}</div>
                        </div>
                        <div style="color: #666;">${percent}% of total max</div>
                    </div>
                `
            },
            positioner: function () {
                return {
                    x: this.chart.chartWidth / 2 - this.label.width / 2,
                    y: this.chart.plotHeight / 2 - 50
                }
            }
        },
        pane: {
            startAngle: 0,
            endAngle: 360,
            background: categoryData.map((_, i) => ({
                outerRadius: `${105 - i * 22}%`,
                innerRadius: `${85 - i * 22}%`,
                backgroundColor: trackColors[i % trackColors.length],
                borderWidth: 0
            }))
        },
        yAxis: {
            min: 0,
            max: maxValue,
            lineWidth: 0,
            tickPositions: []
        },
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    enabled: false,
                },
                linecap: 'round',
                stickyTracking: true,
                rounded: true
            },
        },
        series: categoryData.map((item, i) => ({
            type: 'solidgauge',
            name: item.expenseDescType,
            data: [{
                color: colors[i % colors.length],
                radius: `${105 - i * 22}%`,
                innerRadius: `${85 - i * 22}%`,
                y: item.totalExpenses
            }]
        })),
        credits: {
            enabled: true,
            position: {
                align: 'center',
                verticalAlign: 'bottom',
                y: -30
            },
            style: {
                fontSize: '12px',
                color: '#666'
            },
            text: 'Total Budget: ₹5,000'
        }
    }

    return (
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 col-span-6">
            <CardHeader className="pb-2 flex justify-between flex-col lg:flex-row">
                <div>
                    <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                        Monthly Expenses by Category
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                        Analyze trends across the month
                    </CardDescription>
                </div>

                {/* Month and Year Selectors */}
                <div className="flex gap-2 items-center">
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
            <CardContent className="pt-6 pb-4 grid grid-cols-5 lg:grid-cols-5">
                <div className='col-span-4'>
                    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                </div>

                {/* Additional bottom section */}
                <div className="col-span-1 h-full flex items-center flex-col justify-center gap-6">
                    {categoryData.map((item, i) => (
                        <div key={i} className="flex gap-2 flex-col items-center">
                            <div
                                className="w-6 h-6 rounded-full mr-2"
                                style={{ backgroundColor: colors[i] }}
                            ></div>
                            <span className="text-xs text-gray-600 dark:text-gray-300">
                                {item.expenseDescType}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}