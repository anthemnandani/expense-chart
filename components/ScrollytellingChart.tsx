'use client'

import Highcharts from 'highcharts'
import Funnel from 'highcharts/modules/funnel'
import HighchartsReact from 'highcharts-react-official'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

if (typeof Highcharts === 'function') {
  Funnel(Highcharts)
}

const ScrollytellingChart = () => {
  const [isDark, setIsDark] = useState(false);
    const [isClient, setIsClient] = useState(false)
  
    useEffect(() => {
      setIsClient(true)
    }, [])
    if (!isClient) return null

  const data = [
    ['Jan', 15000],
    ['Feb', 14000],
    ['Mar', 13500],
    ['Apr', 12000],
    ['May', 11000],
    ['Jun', 10000],
    ['Jul', 9500],
    ['Aug', 9000],
    ['Sep', 8500],
    ['Oct', 8000],
    ['Nov', 7500],
    ['Dec', 12000],
  ]

  useEffect(() => {
    const checkDark = () =>
      document.documentElement.classList.contains('dark')
    setIsDark(checkDark())

    const observer = new MutationObserver(() => {
      setIsDark(checkDark())
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  const baseColor = isDark ? '#60a5fa' : '#3b82f6'

  const options: Highcharts.Options = {
    chart: {
      type: 'funnel',
      inverted: true,
      height: '90%',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Inter, sans-serif'
      }
    },
    title: {
      text: 'Monthly Expense Funnel (Debit Trend)',
      style: {
        color: isDark ? '#ffffff' : '#111827',
        fontSize: '20px',
        fontWeight: '600'
      }
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: ₹{point.y}',
          color: isDark ? '#e0e7ff' : '#1e293b',
          softConnector: true,
          style: {
            textOutline: 'none',
            fontSize: '13px',
          }
        },
        neckWidth: '30%',
        neckHeight: '30%',
        width: '80%',
        borderWidth: 0,
        shadow: {
          color: 'rgba(0, 0, 0, 0.2)',
          offsetX: 0,
          offsetY: 1,
          opacity: 0.3,
          width: 4
        }
      }
    },
    tooltip: {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderColor: baseColor,
      style: {
        color: isDark ? '#f9fafb' : '#1f2937',
        fontSize: '13px'
      },
      formatter: function () {
        // @ts-ignore
        return `<b>${this.point.name}</b><br/>Debit: ₹${this.point.y}`
      }
    },
    series: [
      {
        name: 'Debit',
        type: 'funnel',
        data,
        colors: data.map((_, i) => {
          const alpha = 1 - i * 0.06
          return `rgba(59,130,246,${alpha})`
        }),
      }
    ],
    credits: { enabled: false }
  }

  return (
    <Card className="col-span-6 shadow-xl border-0 bg-white dark:bg-zinc-900 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
          Expense Pipeline (Inverted Funnel)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[520px]">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>
    </Card>
  )
}

export default ScrollytellingChart
