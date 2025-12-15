"use client";

import React, { useEffect, useState } from "react";
import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css";
import { useAuth } from "@/context/auth-context";

type EventItem = {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  type: "Event" | "Holiday";
};

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= totalDays; d++) days.push(d);
  while (days.length < 42) days.push(null);

  return days;
}

export default function UpcomingEventsTimeline() {
  const [currentMonth, setCurrentMonth] = useState(11);
  const [currentYear, setCurrentYear] = useState(2025);

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date();
  const monthDays = getMonthDays(currentYear, currentMonth);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

    const { user } = useAuth()

  // ✅ Fetch events dynamically from API whenever year changes
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://employee-dashboard-backend-api.vercel.app/api/dashboard-charts/events-calendar?year=${currentYear}&token=${encodeURIComponent(user?.token)}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to load events");

        const data = await res.json();
        setEvents(data?.events ?? []);
        setError("");
      } catch (err: any) {
        setError(err.message || "Error fetching events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentYear]);

  // Create map for quick lookup
  const eventMap = events.reduce<Record<string, EventItem[]>>((acc, ev) => {
    if (!acc[ev.date]) acc[ev.date] = [];
    acc[ev.date].push(ev);
    return acc;
  }, {});

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };

  const isToday = (day: number) =>
    today.getFullYear() === currentYear &&
    today.getMonth() === currentMonth &&
    today.getDate() === day;

  return (
    <div
      className="
        p-4 rounded-xl shadow-md 
        bg-white dark:bg-gray-900 
        border border-gray-200 dark:border-gray-700 
        w-full max-w-sm mx-auto
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="
            p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 
            hover:bg-gray-200 dark:hover:bg-gray-700
            text-sm shadow-sm transition
          "
        >
          ‹
        </button>

        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {monthNames[currentMonth]} {currentYear}
        </h3>

        <button
          onClick={handleNextMonth}
          className="
            p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 
            hover:bg-gray-200 dark:hover:bg-gray-700
            text-sm shadow-sm transition
          "
        >
          ›
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-4 text-sm text-gray-500">
          Loading events...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-2 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-4 mb-3 text-xs font-medium">
        <div className="flex items-center gap-1 text-blue-600">
          <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>Event
        </div>
        <div className="flex items-center gap-1 text-green-600">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>Holiday
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center text-gray-600 dark:text-gray-300 font-semibold mb-1 text-[10px] uppercase">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {monthDays.map((day, idx) => {
          if (!day) return <div key={idx} className="h-8"></div>;

          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;

          const dayEvents = eventMap[dateStr] || [];
          const isEvent = dayEvents.some((e) => e.type === "Event");
          const isHoliday = dayEvents.some((e) => e.type === "Holiday");

          let cellClass =
            "h-8 flex items-center justify-center rounded-lg cursor-pointer text-xs font-semibold relative transition";

          if (isToday(day)) {
            cellClass += " bg-blue-600 text-white border border-blue-700";
          } else if (isEvent) {
            cellClass += " bg-blue-100 text-blue-700 border border-blue-300";
          } else if (isHoliday) {
            cellClass += " bg-green-100 text-green-700 border border-green-300";
          } else {
            cellClass +=
              " bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200";
          }

          return (
            <Tippy
              key={idx}
              placement="top"
              interactive
              render={() => (
                <div className="bg-white shadow-xl p-2 rounded-md border border-gray-200 w-44 text-xs">
                  {dayEvents.length ? (
                    dayEvents.map((e) => (
                      <div key={e.id} className="mb-1 pb-1 border-b last:border-none">
                        <span
                          className={`font-bold ${
                            e.type === "Event"
                              ? "text-blue-600"
                              : "text-green-600"
                          }`}
                        >
                          {e.type}
                        </span>
                        : {e.title}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No events</div>
                  )}
                </div>
              )}
            >
              <div className={cellClass}>
                {day}

                {isEvent && !isToday(day) && (
                  <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                )}
                {isHoliday && !isToday(day) && (
                  <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                )}
              </div>
            </Tippy>
          );
        })}
      </div>
    </div>
  );
}