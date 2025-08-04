'use client'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HCHeatmap from 'highcharts/modules/heatmap'
import HCAccessibility from 'highcharts/modules/accessibility'
import HCExporting from 'highcharts/modules/exporting'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'

// Initialize modules
if (typeof Highcharts === 'function') {
  HCHeatmap(Highcharts)
  HCAccessibility(Highcharts)
  HCExporting(Highcharts)
}

const categories = ['Party', 'Tea', 'Water', 'Other']
const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

// Mock expense data [x = month, y = category index, value = amount]
const generateMockData = () => {
  const data: [number, number, number][] = []
  for (let y = 0; y < categories.length; y++) {
    for (let x = 0; x < 12; x++) {
      let value = Math.floor(Math.random() * 1000)
      if (categories[y] === 'Tea' && (x === 0 || x === 1)) value += 500 // spike in Jan/Feb
      data.push([x, y, value])
    }
  }
  return data
}

const AnnualCategoryTrendsChart = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const check = () =>
      document.documentElement.classList.contains('dark')
    setIsDarkMode(check())

    const observer = new MutationObserver(() => setIsDarkMode(check()))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  const options: Highcharts.Options = {
    chart: {
      type: 'heatmap',
      plotBorderWidth: 1,
      backgroundColor: 'transparent',
      height: 400
    },
    title: {
      text: 'Annual Category Trends (Heatmap)',
      style: {
        color: isDarkMode ? '#fff' : '#000',
        fontSize: '16px'
      }
    },
    xAxis: {
      categories: months,
      labels: { style: { color: isDarkMode ? '#ddd' : '#333' } },
      title: { text: 'Months', style: { color: isDarkMode ? '#aaa' : '#444' } }
    },
    yAxis: {
      categories: categories,
      title: { text: 'Expense Categories', style: { color: isDarkMode ? '#aaa' : '#444' } },
      labels: { style: { color: isDarkMode ? '#ddd' : '#333' } }
    },
    colorAxis: {
      min: 0,
      minColor: isDarkMode ? '#1e3a8a' : '#dbeafe',
      maxColor: isDarkMode ? '#60a5fa' : '#1d4ed8'
    },
    legend: {
      align: 'right',
      layout: 'vertical',
      margin: 0,
      verticalAlign: 'middle',
      symbolHeight: 200,
      itemStyle: {
        color: isDarkMode ? '#eee' : '#333'
      }
    },
    tooltip: {
      formatter: function () {
        const point = this.point as any
        return `<b>${categories[point.y]}</b><br>${months[point.x]}: ₹${point.value}`
      }
    },
    series: [{
      name: 'Expenses',
      borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#fff',
      data: generateMockData(),
      dataLabels: {
        enabled: true,
        color: isDarkMode ? '#fff' : '#000'
      },
      type: 'heatmap'
    }],
    credits: { enabled: false }
  }

  if (typeof window === 'undefined') return null

  return (
    <Card className="col-span-full shadow-md border-0 bg-white dark:bg-gray-800">
      <CardHeader className='flex justify-between lg:flex-row flex-col'>
        <CardTitle className="text-lg">Expense Heatmap</CardTitle>
        <div>

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
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </CardContent>
    </Card>
  )
}

export default AnnualCategoryTrendsChart
