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

function animateValue(start: number, end: number, duration: number, onUpdate: (val: number) => void) {
  const range = end - start
  let startTime = performance.now()

  function step(timestamp: number) {
    const progress = Math.min((timestamp - startTime) / duration, 1)
    const value = Math.floor(start + range * progress)
    onUpdate(value)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export default function UniqueStatCards({ selectedGlobalYear, currency }: { selectedGlobalYear: number, currency: string }) {
  const { user } = useAuth()
  const groupId = user?.groupId

  const [metrics, setMetrics] = useState([
    { key: "income", title: "Total Credit Amount", value: 0, final: 0, change: "+0%", color: "from-blue-300 to-blue-700" },
    { key: "expenses", title: "Total Debit Amount", value: 0, final: 0, change: "+0%", color: "from-red-300 to-red-700" },
    { key: "savings", title: "Net Balances", value: 0, final: 0, change: "", color: "from-green-300 to-green-700" }, // ← NO CHANGE
    { key: "months", title: "Active Months", value: 0, final: 0, change: "+0%", color: "from-purple-300 to-purple-700" },
  ])

  // % CHANGE CALCULATOR
  const getChange = (curr: number, prev: number) => {
    if (prev === 0) return curr === 0 ? "0%" : "+100%"
    const diff = ((curr - prev) / prev) * 100
    return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`
  }

  useEffect(() => {
    const fetchStats = async () => {
      if (!groupId || !selectedGlobalYear) return

      try {
        const res = await fetch(`/api/stats?groupId=${groupId}&year=${selectedGlobalYear}`)
        const data = await res.json()

        if (!data || !data.curr) return

        const curr = data.curr
        const prev = data.prev
        const netBalance = data.netBalance // Running balance

        const updatedMetrics = [
          {
            ...metrics[0],
            final: curr.totalCredit,
            change: getChange(curr.totalCredit, prev.totalCredit),
          },
          {
            ...metrics[1],
            final: curr.totalDebit,
            change: getChange(curr.totalDebit, prev.totalDebit),
          },
          {
            ...metrics[2],
            final: netBalance,
            change: "", // 🚨 REMOVE % CHANGE FOR NET BALANCE
          },
          {
            ...metrics[3],
            final: curr.activeMonths,
            change: getChange(curr.activeMonths, prev.activeMonths),
          },
        ]

        updatedMetrics.forEach((metric, i) => {
          animateValue(metrics[i].value, metric.final, 1000, (val) => {
            setMetrics((prev) => {
              const newMetrics = [...prev]
              newMetrics[i] = { ...metric, value: val }
              return newMetrics
            })
          })
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [groupId, selectedGlobalYear])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map(({ key, title, value, change, color }) => {
        const Icon = iconMap[key as keyof typeof iconMap]
        const displayVal =
          key === "months" ? `${value} / 12` : `${currency}${value.toLocaleString()}`

        return (
          <div
            key={key}
            className={`group p-4 rounded-lg bg-gradient-to-br ${color} text-white shadow-xl hover:scale-[1.01] transition-transform relative overflow-hidden`}
          >
            <div className="absolute top-3 right-3 opacity-20 text-6xl rotate-12">
              <Icon className="w-12 h-12" />
            </div>
            <div className="z-10 relative">
              <div className="text-sm uppercase font-semibold tracking-wider">{title}</div>
              <div className="text-2xl font-bold mt-2">{displayVal}</div>

              {/* Change value only if available */}
              {/* {change && <div className="text-xs mt-1 opacity-80">{change}</div>} */}
            </div>
          </div>
        )
      })}
    </div>
  )
}
