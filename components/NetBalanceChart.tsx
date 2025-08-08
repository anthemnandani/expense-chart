'use client'

import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/auth-context'

const NetBalanceChart = () => {
  const [chartData, setChartData] = useState<[number, number][]>([])
  const [selectedYear, setSelectedYear] = useState(2025)
  const { user } = useAuth()
  const groupId = user?.groupId
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (!groupId) return
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/net-balance?groupId=${groupId}&year=${selectedYear}`);
        if (!res.ok) throw new Error("Failed to fetch day-wise net balance");
        const data: [number, number][] = await res.json();
        setChartData(data);
      } catch (err) {
        console.error("Error fetching net balance:", err);
      }
    };
    fetchData();
  }, [selectedYear, groupId]);


  useEffect(() => {
    const checkDarkMode = () =>
      document.documentElement.classList.contains('dark')
    setIsDarkMode(checkDarkMode())
    const observer = new MutationObserver(() => {
      setIsDarkMode(checkDarkMode())
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    return () => observer.disconnect()
  }, [])

  const textColor = isDarkMode ? '#ffffff' : '#1f2937'
  const borderColor = isDarkMode ? '#4B5563' : '#E5E7EB'
  const backgroundColor = isDarkMode ? '#1F2937' : '#ffffff'
  const gridLineColor = isDarkMode ? '#374151' : '#D1D5DB'
  const fillTop = isDarkMode ? '#2CAFFE' : '#3a86ff'
  const fillBottom = isDarkMode ? '#3a86ff' : '#2CAFFE'
  const now = new Date();
  const firstDayOfYear = new Date(selectedYear, 0, 1).getTime();
  const lastDayOfCurrentMonth = new Date(selectedYear, now.getMonth() + 1, 0).getTime();

  const options: Highcharts.Options = {
    chart: {
      type: 'areaspline',
      height: 500,
      backgroundColor,
      spacing: [20, 10, 30, 10],
      style: {
        fontFamily: 'Inter, sans-serif',
      },
    },
    title: {
      text: undefined,
      style: {
        color: textColor,
        fontSize: '18px',
      }
    },
    xAxis: {
      type: 'datetime',
      min: firstDayOfYear,
      max: lastDayOfCurrentMonth,
      lineColor: borderColor,
      tickColor: borderColor,
      labels: {
        style: {
          color: textColor,
        }
      }
    },
    yAxis: {
      opposite: false,
      title: {
        text: '₹ (Balance)',
        style: {
          color: textColor,
        }
      },
      labels: {
        formatter: function () {
          const value = this.value as number
          if (Math.abs(value) >= 100000) return '₹' + (value / 100000).toFixed(1) + 'L'
          if (Math.abs(value) >= 1000) return '₹' + (value / 1000).toFixed(1) + 'K'
          return '₹' + value
        },
        style: {
          color: textColor,
        },
        align: "right",
        x: -10,
      },
      gridLineColor,
      tickPixelInterval: 50,
    },
    tooltip: {
      shared: true,
      xDateFormat: '%A, %b %e, %Y',
      valuePrefix: '₹',
      valueDecimals: 0,
      backgroundColor: isDarkMode ? '#111827' : '#ffffff',
      style: {
        color: textColor
      }
    },
    rangeSelector: {
      selected: 2,
      buttons: [
        { type: 'month', count: 1, text: '1m' },
        { type: 'month', count: 3, text: '3m' },
        { type: 'month', count: 6, text: '6m' },
        { type: 'year', count: 1, text: '1y' },
        { type: 'all', text: 'All' },
      ],
      inputEnabled: false,
      buttonTheme: {
        fill: isDarkMode ? '#374151' : '#f9fafb',
        style: {
          color: textColor,
        },
        states: {
          hover: {
            fill: isDarkMode ? '#4B5563' : '#e5e7eb'
          },
          select: {
            fill: '#3b82f6',
            style: {
              color: '#ffffff'
            }
          }
        }
      },
      labelStyle: {
        color: textColor,
      }
    },
    series: [
      {
        type: 'areaspline',
        name: 'Net Balance',
        data: chartData,
        color: '#3b82f6',
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, fillTop],
            [0.5, 'rgba(59,130,246,0.25)'],
            [1, fillBottom],
          ]
        },
        tooltip: {
          valueDecimals: 0,
        },
        zones: [
          {
            value: 0, // values <= 0 (debit area)
            color: '#cc3a3a', // red
            fillColor: {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
              stops: [
                [0, '#cc3a3a'],
                [0.5, 'rgba(239, 68, 68, 0.25)'],
                [1, '#ef4444']
              ]
            }
          },
          {
            color: '#2bac5e', // positive/credit area (default blue)
            fillColor: {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
              stops: [
                [0, "#2bac5e"],
                [0.5, "#4ade80"],
                [1, "#64ff9da3"],
              ]
            }
          }
        ],
      },
    ],
    credits: {
      enabled: false,
    },
  }

  return (
    <Card className="col-span-full shadow-lg border-0 bg-white dark:bg-gray-800">
      <CardHeader className='flex justify-between flex-col lg:flex-row'>
        <CardTitle className="text-lg text-gray-800 dark:text-white">
          Net Balance (₹) - Week-wise ({selectedYear})
        </CardTitle>
        <div className="flex gap-2 items-center">
          <select
            className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs text-gray-800 dark:text-white rounded-md px-2 py-1"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {[2025, 2024, 2023].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent className="h-[500px]">
        {chartData.length > 0 ? (
          <HighchartsReact
            highcharts={Highcharts}
            constructorType="stockChart"
            options={options}
          />
        ) : (
          <div className="w-full h-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md" />
        )}
      </CardContent>

    </Card>
  )
}

export default NetBalanceChart
