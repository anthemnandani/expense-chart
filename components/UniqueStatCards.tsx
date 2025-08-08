"use client"

import { useEffect, useState } from "react"
import { DollarSign, TrendingDown, Target, Calendar } from "lucide-react"
import { useAuth } from "@/context/auth-context"

const iconMap = {
  income: DollarSign,
  expenses: TrendingDown,
  savings: Target,
  months: Calendar,
}

// Animate number from current to target over duration
function animateValue(start: number, end: number, duration: number, onUpdate: (val: number) => void) {
  const range = end - start
  // const stepTime = Math.max(Math.floor(duration / 30), 20)
  // let current = start
  let startTime = performance.now()

  function step(timestamp: number) {
    const progress = Math.min((timestamp - startTime) / duration, 1)
    const value = Math.floor(start + range * progress)
    onUpdate(value)
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

export default function UniqueStatCards() {
  const { user } = useAuth()
  const groupId = user?.groupId

  // Hold actual metric objects with animated values
  const [metrics, setMetrics] = useState([
    { key: "income", title: "Total Credits", value: 0, final: 0, change: "+0%", color: "from-blue-300 to-blue-700" },
    { key: "expenses", title: "Total Debits", value: 0, final: 0, change: "+0%", color: "from-blue-300 to-blue-700" },
    { key: "savings", title: "Net Savings", value: 0, final: 0, change: "+0%", color: "from-blue-300 to-blue-700" },
    { key: "months", title: "Active Months", value: 0, final: 0, change: "+0%", color: "from-blue-300 to-blue-700" },
  ])

  useEffect(() => {
    const fetchStats = async () => {
      if (!groupId) return

      const currentYear = new Date().getFullYear()
      const prevYear = currentYear - 1

      const [currRes, prevRes] = await Promise.all([
        fetch(`/api/yearly-expense?groupId=${groupId}&year=${currentYear}`),
        fetch(`/api/yearly-expense?groupId=${groupId}&year=${prevYear}`),
      ])

      const [currData, prevData] = await Promise.all([
        currRes.json(),
        prevRes.json(),
      ])

      const currTotalCredit = currData.reduce((sum: number, m: any) => sum + (m.totalCredit || 0), 0)
      const currTotalDebit = currData.reduce((sum: number, m: any) => sum + (m.totalDebit || 0), 0)
      const currNetSavings = currTotalCredit - currTotalDebit
      const currActiveMonths = currData.filter((m: any) => (m.totalCredit || 0) > 0 || (m.totalDebit || 0) > 0).length

      const prevTotalCredit = prevData.reduce((sum: number, m: any) => sum + (m.totalCredit || 0), 0)
      const prevTotalDebit = prevData.reduce((sum: number, m: any) => sum + (m.totalDebit || 0), 0)
      const prevNetSavings = prevTotalCredit - prevTotalDebit
      const prevActiveMonths = prevData.filter((m: any) => (m.totalCredit || 0) > 0 || (m.totalDebit || 0) > 0).length

      const getChange = (curr: number, prev: number) => {
        if (prev === 0) return curr === 0 ? "0%" : "+100%"
        const diff = ((curr - prev) / prev) * 100
        const sign = diff >= 0 ? "+" : ""
        return `${sign}${diff.toFixed(1)}%`
      }

      const updatedMetrics = [
        {
          key: "income",
          title: "Total Income",
          final: currTotalCredit,
          change: getChange(currTotalCredit, prevTotalCredit),
          color: "from-blue-300 to-blue-700",
        },
        {
          key: "expenses",
          title: "Total Expenses",
          final: currTotalDebit,
          change: getChange(currTotalDebit, prevTotalDebit),
          color: "from-blue-300 to-blue-700",
        },
        {
          key: "savings",
          title: "Net Savings",
          final: currNetSavings,
          change: getChange(currNetSavings, prevNetSavings),
          color: "from-blue-300 to-blue-700",
        },
        {
          key: "months",
          title: "Active Months",
          final: currActiveMonths,
          change: getChange(currActiveMonths, prevActiveMonths),
          color: "from-blue-300 to-blue-700",
        },
      ]

      // Animate each metric
      updatedMetrics.forEach((metric, i) => {
        animateValue(metrics[i].value, metric.final, 1000, (val) => {
          setMetrics((prev) => {
            const newMetrics = [...prev]
            newMetrics[i] = { ...metric, value: val }
            return newMetrics
          })
        })
      })
    }

    fetchStats()
  }, [groupId])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map(({ key, title, value, change, color }) => {
        const Icon = iconMap[key as keyof typeof iconMap]
        const displayVal = key === "months" ? `${value} / 12` : `₹${value.toLocaleString()}`
        return (
          <div
            key={key}
            className={`group p-5 rounded-xl bg-gradient-to-br ${color} text-white shadow-xl hover:scale-[1.01] transition-transform relative overflow-hidden`}
          >
            <div className="absolute top-3 right-3 opacity-20 text-6xl rotate-12">
              <Icon className="w-12 h-12" />
            </div>
            <div className="z-10 relative">
              <div className="text-sm uppercase font-semibold tracking-wider">
                {title}
              </div>
              <div className="text-3xl font-bold mt-2">{displayVal}</div>
              <div className="text-xs mt-1 opacity-80">{change}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}