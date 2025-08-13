"use client";

import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import { apiService } from '@/lib/apiService';
import { CardContent, CardHeader, Card, CardTitle } from './ui/card';
import { useAuth } from '@/context/auth-context';

interface StackedBarCategoryChartProps {
  years: number[];
  height?: number;
  currency: string;
}

export const StackedBarCategoryChart: React.FC<StackedBarCategoryChartProps> = ({
  years,
  height = 600,
  currency
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Highcharts.Chart | null>(null);
  const { user } = useAuth()
  const groupId = user?.groupId

  useEffect(() => {
    const checkDarkMode = () =>
      document.documentElement.classList.contains("dark")

    setIsDarkMode(checkDarkMode())

    const observer = new MutationObserver(() => {
      setIsDarkMode(checkDarkMode())
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!groupId) return
    const fetchDataAndRenderChart = async () => {
      try {
        const { data, categories } = await apiService.getYearlyCategoryExpenses(groupId, years);

        // Calculate total expense per category across all years
        const categoryTotals: { [key: string]: number } = {};
        categories.forEach(category => {
          categoryTotals[category] = 0;
          data.forEach(yearData => {
            const val = yearData[category];
            if (val && val !== 0) {
              categoryTotals[category] += val;
            }
          });
        });

        // Sort categories descending by total expense
        const sortedCategories = categories
          .filter(category => categoryTotals[category] > 0)
          .sort((a, b) => categoryTotals[b] - categoryTotals[a]);

        // Map to series in sorted order
        const series = sortedCategories.map(category => {
          const values = data.map(yearData => {
            const val = yearData[category];
            return val && val !== 0 ? val : null;
          });
          return {
            name: category,
            data: values,
          };
        });

        // year labels as before
        const yearLabels = data.map(item => item.year);

        if (chartContainerRef.current) {
          if (chartRef.current) {
            chartRef.current.destroy();
          }

          chartRef.current = Highcharts.chart(chartContainerRef.current, {
            chart: {
              type: 'column',
              height: height,
              backgroundColor: "transparent",
            },
            title: {
              text: undefined,
            },
            xAxis: {
              categories: yearLabels,
              crosshair: true,
            },
            yAxis: {
              min: 0,
              title: {
                text: 'Percentage',
              },
              labels: {
                format: '{value}%',
              },
            },
            tooltip: {
              pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>${currency}{point.y}</b> ({point.percentage:.0f}%)<br/>',
              shared: true,
              backgroundColor: isDarkMode ? "#111827" : "#ffffff",
              style: {
                color: isDarkMode ? "#f3f4f6" : "#111827",
                padding: "10px",
                fontSize: "13px",
              },
            },
            legend: {
              itemStyle: {
                color: isDarkMode ? "#f3f4f6" : "#111827", // Legend text color
                fontSize: '12px',
              },
              itemHoverStyle: {
                color: isDarkMode ? "#e5e7eb" : "#000000", // Hover color
              },
            },
            plotOptions: {
              column: {
                stacking: 'percent',
                dataLabels: {
                  enabled: true,
                  format: '{point.percentage:.0f}%',
                  color: '#ffffff',
                  style: {
                    textOutline: 'none',
                  },
                },
              },
            },
            series: series,
            credits: {
              enabled: false,
            },
            colors: [
              '#2563eb',
              '#22c55e',
              '#51291e',
              '#028090',
              '#ff6700',
              '#0e9594',
              '#7e2a0b',
              'red',
            ],
          });
        }
      } catch (error) {
        console.error('Error loading chart data:', error);
        if (chartContainerRef.current) {
          chartContainerRef.current.innerHTML = `
        <div class="flex items-center justify-center text-red-500 h-full">
          Failed to load chart data
        </div>
      `;
        }
      }
    };


    fetchDataAndRenderChart();

  }, [groupId, years, height]);

  return (
    <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 lg:col-span-6 col-span-full">
      <CardHeader className="pb-2 flex justify-between flex-col lg:flex-row">
        <div>
          <CardTitle className="text-gray-800 dark:text-white">Yearly Expenses by Category</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="">
        <div ref={chartContainerRef} style={{ height: `${height}px` }} />
      </CardContent>
    </Card>
  );
};

export default StackedBarCategoryChart;