"use client";

import { useEffect, useState } from "react"
import { Users, CheckCircle, AlertCircle, Clock } from "lucide-react"

const ICON_MAP = {
  totalEmployees: Users,
  presentToday: CheckCircle,
  absentToday: AlertCircle,
  onLeave: Clock,
} as const

interface Metric {
  key: keyof typeof ICON_MAP
  title: string
  value: number
  final: number
  change: string
  color: string
}

function animateValue(start: number, end: number, duration: number, onUpdate: (val: number) => void) {
  const range = end - start
  const startTime = performance.now()

  function step(timestamp: number) {
    const progress = Math.min((timestamp - startTime) / duration, 1)
    const value = Math.floor(start + range * progress)
    onUpdate(value)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

const calculateChange = (current: number, previous: number) => {
  if (previous === 0) return current === 0 ? "0%" : "+100%"
  const diff = ((current - previous) / previous) * 100
  return `${diff >= 0 ? "+" : ""}${Math.round(diff)}%`
}

export default function EmployeeStatCards() {
  const [metrics, setMetrics] = useState<Metric[]>([])

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("https://employee-dashboard-backend-api.vercel.app/api/employee-stats")
        const data = await res.json()

        const initialMetrics: Metric[] = [
          {
            key: "totalEmployees",
            title: "Total Employees",
            value: 0,
            final: data.activeEmployees,
            change: "+0%",
            color: "from-blue-300 to-blue-700",
          },
          {
            key: "presentToday",
            title: "Present Today",
            value: 0,
            final: data.checkedInToday,
            change: calculateChange(data.checkedInToday, data.prevCheckedIn),
            color: "from-green-300 to-green-700",
          },
          {
            key: "absentToday",
            title: "Late Today",
            value: 0,
            final: data.notCheckedInToday,
            change: calculateChange(data.notCheckedInToday, data.prevNotCheckedIn),
            color: "from-red-300 to-red-700",
          },
          {
            key: "onLeave",
            title: "On Leave Today",
            value: 0,
            final: data.onLeaveToday,
            change: calculateChange(data.onLeaveToday, data.prevOnLeave),
            color: "from-purple-300 to-purple-700",
          },
        ]

        setMetrics(initialMetrics)

        // animate values
        initialMetrics.forEach((metric, i) => {
          animateValue(0, metric.final, 1000, (val) => {
            setMetrics((prev) => {
              const updated = [...prev]
              updated[i] = { ...updated[i], value: val }
              return updated
            })
          })
        })
      } catch (err) {
        console.error("Failed to load stats", err)
      }
    }

    loadStats()
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map(({ key, title, value, change, color }) => {
        const Icon = ICON_MAP[key]
        return (
          <div
            key={key}
            className={`group p-5 rounded-xl bg-gradient-to-br ${color} text-white shadow-xl hover:scale-[1.01] transition-transform relative overflow-hidden`}
          >
            <div className="absolute top-3 right-3 opacity-20 text-6xl rotate-12">
              <Icon className="w-12 h-12" />
            </div>

            <div className="relative z-10">
              <div className="text-sm uppercase font-semibold tracking-wider">{title}</div>
              <div className="text-3xl font-bold mt-2">{value}</div>
              {/* <div className="text-xs mt-1 opacity-80">{change}</div> */}
            </div>
          </div>
        )
      })}
    </div>
  )
}