"use client";

import { useEffect, useState } from "react";
import {
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  CalendarClock,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

const ICON_MAP = {
  totalEmployees: Users,
  presentToday: CheckCircle,
  absentToday: AlertCircle,
  onLeave: Clock,
  pendingLeaves: CalendarClock,
  hiringVsResignation: TrendingUp,
} as const;

interface Metric {
  key: keyof typeof ICON_MAP;
  title: string;
  value: number;
  final: number;
  color: string;
  extra?: {
    hiring?: number;
    resigned?: number;
  };
}

// Number animation helper
function animateValue(start: number, end: number, duration: number, onUpdate: (val: number) => void) {
  const range = end - start;
  const startTime = performance.now();

  function step(timestamp: number) {
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = Math.floor(start + range * progress);
    onUpdate(value);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export default function EmployeeStatCards() {
  const { user } = useAuth();

  // ✅ Initialize metrics with zero values so cards render immediately
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      key: "totalEmployees",
      title: "Total Employees",
      value: 0,
      final: 0,
      color: "from-blue-300 to-blue-700",
    },
    {
      key: "presentToday",
      title: "Present Today",
      value: 0,
      final: 0,
      color: "from-green-300 to-green-700",
    },
    {
      key: "absentToday",
      title: "Late Today",
      value: 0,
      final: 0,
      color: "from-red-300 to-red-700",
    },
    {
      key: "onLeave",
      title: "On Leave Today",
      value: 0,
      final: 0,
      color: "from-purple-300 to-purple-700",
    },
    {
      key: "pendingLeaves",
      title: "Pending Leave Requests",
      value: 0,
      final: 0,
      color: "from-orange-300 to-orange-700",
    },
    {
      key: "hiringVsResignation",
      title: "Hiring vs Resignation",
      value: 0,
      final: 0,
      color: "from-indigo-300 to-indigo-700",
      extra: { hiring: 0, resigned: 0 },
    },
  ]);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch(
          `https://employee-dashboard-backend-api.vercel.app/api/employee-stats?token=${encodeURIComponent(
            user?.token
          )}`
        );
        const data = await res.json();

        const updatedMetrics = [
          {
            key: "totalEmployees",
            title: "Total Employees",
            value: 0,
            final: data.activeEmployees,
            color: "from-blue-300 to-blue-700",
          },
          {
            key: "presentToday",
            title: "Present Today",
            value: 0,
            final: data.checkedInToday,
            color: "from-green-300 to-green-700",
          },
          {
            key: "absentToday",
            title: "Late Today",
            value: 0,
            final: data.notCheckedInToday,
            color: "from-red-300 to-red-700",
          },
          {
            key: "onLeave",
            title: "On Leave Today",
            value: 0,
            final: data.onLeaveToday,
            color: "from-purple-300 to-purple-700",
          },
          {
            key: "pendingLeaves",
            title: "Pending Leave Requests",
            value: 0,
            final: data.pendingLeaves,
            color: "from-orange-300 to-orange-700",
          },
          {
            key: "hiringVsResignation",
            title: "Hiring vs Resignation",
            value: 0,
            final: data.hiringThisYear - data.resignedThisYear,
            color: "from-indigo-300 to-indigo-700",
            extra: { hiring: data.hiringThisYear, resigned: data.resignedThisYear },
          },
        ];

        // Animate values
        updatedMetrics.forEach((metric, i) => {
          animateValue(0, metric.final, 1000, (val) => {
            setMetrics((prev) => {
              const copy = [...prev];
              copy[i] = { ...copy[i], value: val, final: metric.final, extra: metric.extra };
              return copy;
            });
          });
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
      {metrics.map((metric) => {
        const { key, title, value, color } = metric;
        const Icon = ICON_MAP[key];
        return (
          <div
            key={key}
            className={`group p-5 rounded-xl bg-gradient-to-br ${color} text-white shadow-xl hover:scale-[1.02] transition-transform relative overflow-hidden min-h-[100px]`}
          >
            <div className="absolute top-3 right-3 opacity-20 text-7xl rotate-12">
              <Icon className="w-14 h-14" />
            </div>
            <div className="relative z-10">
              <div className="text-md mb-2 uppercase font-semibold tracking-wider">{title}</div>
              <div className="text-2xl font-semibold tracking-wider">
                {key === "hiringVsResignation" && metric.extra
                  ? `${metric.extra.hiring} / ${metric.extra.resigned}`
                  : value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}