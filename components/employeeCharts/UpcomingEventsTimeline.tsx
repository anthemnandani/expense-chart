"use client";
import React, { useEffect, useState } from "react";
import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css";
import { useAuth } from "@/context/auth-context";
import { apiService } from "@/lib/apiService";

type EventItem = {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  type: "Event" | "Holiday";
  employeeImage: string;
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

const getEventBadge = (events: EventItem[]) => {
  const titles = events.map(e => e.title.toLowerCase());
  if (titles.some(t => t.includes("birthday"))) {
    return (
      <div className="absolute bottom-0 right-0 text-black rounded-full p-[2px]">
        <svg
          viewBox="0 0 32 32"
          className="w-3 h-3"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M31 31.36H1v-.72h2.64V15c0-1.301 1.059-2.36 2.36-2.36h1.64V7c0-.199.161-.36.36-.36h2c.199 0 .36.161.36.36v5.64h4.28V7c0-.199.161-.36.36-.36h2c.199 0 .36.161.36.36v5.64h4.279V7c0-.199.161-.36.36-.36h2c.199 0 .36.161.36.36v5.64H26c1.302 0 2.36 1.059 2.36 2.36v15.64H31zM4.36 30.64h23.28V18.695c-.425.411-1.003.665-1.64.665-.842 0-1.582-.443-2-1.108-.418.665-1.158 1.108-2 1.108s-1.582-.443-2-1.108c-.418.665-1.158 1.108-2 1.108s-1.582-.443-2-1.108c-.418.665-1.158 1.108-2 1.108s-1.582-.443-2-1.108c-.418.665-1.158 1.108-2 1.108s-1.582-.443-2-1.108c-.418.665-1.158 1.108-2 1.108-.637 0-1.215-.254-1.64-.665V30.64zM24 16.64c.199 0 .36.161.36.36 0 .904.735 1.64 1.64 1.64s1.64-.735 1.64-1.64v-2c0-.904-.735-1.64-1.64-1.64H6c-.904 0-1.64.736-1.64 1.64v2c0 .904.736 1.64 1.64 1.64S7.64 17.904 7.64 17c0-.199.161-.36.36-.36s.36.161.36.36c0 .904.736 1.64 1.64 1.64s1.64-.735 1.64-1.64c0-.199.161-.36.36-.36s.36.161.36.36c0 .904.736 1.64 1.64 1.64s1.64-.735 1.64-1.64c0-.199.161-.36.36-.36s.36.161.36.36c0 .904.736 1.64 1.64 1.64s1.64-.735 1.64-1.64c0-.199.161-.36.36-.36s.36.161.36.36c0 .904.735 1.64 1.64 1.64s1.64-.735 1.64-1.64c0-.199.161-.36.36-.36zM22.36 12.64h1.279V7.36H22.36v5.28zM15.36 12.64h1.28V7.36h-1.28v5.28zM8.36 12.64h1.28V7.36H8.36v5.28zM23 5.36c-.75 0-1.36-.61-1.36-1.36 0-1.055.932-2.949 1.038-3.161.123-.244.521-.244.645 0 .106.212 1.037 2.106 1.037 3.161 0 .75-.61 1.36-1.36 1.36zM16 5.36c-.75 0-1.36-.61-1.36-1.36 0-1.055.932-2.949 1.038-3.161.121-.244.522-.244.644 0 .106.212 1.038 2.106 1.038 3.161 0 .75-.61 1.36-1.36 1.36zM9 5.36c-.75 0-1.36-.61-1.36-1.36 0-1.055.932-2.949 1.038-3.161.121-.244.522-.244.644 0 .106.212 1.038 2.106 1.038 3.161 0 .75-.61 1.36-1.36 1.36z" />
        </svg>
      </div>
    );
  }
  if (titles.some(t => t.includes("completed"))) {
    return (
      <div className="absolute bottom-0 right-0 text-black rounded-full p-[2px]">
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.1459 7.02251C11.5259 6.34084 11.7159 6 12 6C12.2841 6 12.4741 6.34084 12.8541 7.02251L12.9524 7.19887C13.0603 7.39258 13.1143 7.48944 13.1985 7.55334C13.2827 7.61725 13.3875 7.64097 13.5972 7.68841L13.7881 7.73161C14.526 7.89857 14.895 7.98205 14.9828 8.26432C15.0706 8.54659 14.819 8.84072 14.316 9.42898L14.1858 9.58117C14.0429 9.74833 13.9714 9.83191 13.9392 9.93531C13.9071 10.0387 13.9179 10.1502 13.9395 10.3733L13.9592 10.5763C14.0352 11.3612 14.0733 11.7536 13.8435 11.9281C13.6136 12.1025 13.2682 11.9435 12.5773 11.6254L12.3986 11.5431C12.2022 11.4527 12.1041 11.4075 12 11.4075C11.8959 11.4075 11.7978 11.4527 11.6014 11.5431L11.4227 11.6254C10.7318 11.9435 10.3864 12.1025 10.1565 11.9281C9.92674 11.7536 9.96476 11.3612 10.0408 10.5763L10.0605 10.3733C10.0821 10.1502 10.0929 10.0387 10.0608 9.93531C10.0286 9.83191 9.95713 9.74833 9.81418 9.58117L9.68403 9.42898C9.18097 8.84072 8.92945 8.54659 9.01723 8.26432C9.10501 7.98205 9.47396 7.89857 10.2119 7.73161L10.4028 7.68841C10.6125 7.64097 10.7173 7.61725 10.8015 7.55334C10.8857 7.48944 10.9397 7.39258 11.0476 7.19887L11.1459 7.02251Z"
            stroke="currentColor"
          />
          <path
            d="M12 16.0678L8.22855 19.9728C7.68843 20.5321 7.41837 20.8117 7.18967 20.9084C6.66852 21.1289 6.09042 20.9402 5.81628 20.4602C5.69597 20.2495 5.65848 19.8695 5.5835 19.1095C5.54117 18.6804 5.52 18.4658 5.45575 18.2861C5.31191 17.8838 5.00966 17.5708 4.6211 17.4219C4.44754 17.3554 4.24033 17.3335 3.82589 17.2896C3.09187 17.212 2.72486 17.1732 2.52138 17.0486C2.05772 16.7648 1.87548 16.1662 2.08843 15.6266C2.18188 15.3898 2.45194 15.1102 2.99206 14.5509L5.45575 12"
            stroke="currentColor"
          />
          <path
            d="M12 16.0678L15.7715 19.9728C16.3116 20.5321 16.5816 20.8117 16.8103 20.9084C17.3315 21.1289 17.9096 20.9402 18.1837 20.4602C18.304 20.2495 18.3415 19.8695 18.4165 19.1095C18.4588 18.6804 18.48 18.4658 18.5442 18.2861C18.6881 17.8838 18.9903 17.5708 19.3789 17.4219C19.5525 17.3554 19.7597 17.3335 20.1741 17.2896C20.9081 17.212 21.2751 17.1732 21.4786 17.0486C21.9423 16.7648 22.1245 16.1662 21.9116 15.6266C21.8181 15.3898 21.5481 15.1102 21.0079 14.5509L18.5442 12"
            stroke="currentColor"
          />
          <path
            d="M5.5 6.39691C5.17745 7.20159 5 8.08007 5 9C5 12.866 8.13401 16 12 16C15.866 16 19 12.866 19 9C19 5.13401 15.866 2 12 2C11.0801 2 10.2016 2.17745 9.39691 2.5"
            stroke="currentColor"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }
  if (titles.some(t => t.includes("anniversary"))) {
    return (
      <div className="absolute bottom-0 right-0 rounded-full p-[2px]">
        <svg
          viewBox="0 0 64 64"
          className="w-3 h-3"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ❤️ RED HEART FILL */}
          <path
            fill="#ef233c"
            d="M58.714 29.977s-.612.75-1.823 1.961S33.414 55.414 33.414 55.414C33.023 55.805 32.512 56 32 56s-1.023-.195-1.414-.586c0 0-22.266-22.266-23.477-23.477s-1.823-1.961-1.823-1.961C3.245 27.545 2 24.424 2 21 2 13.268 8.268 7 16 7c3.866 0 7.366 1.566 9.899 4.101l.009-.009 4.678 4.677c.781.781 2.047.781 2.828 0l4.678-4.677.009.009C40.634 8.566 44.134 7 48 7c7.732 0 14 6.268 14 14 0 3.424-1.245 6.545-3.286 8.977z"
          />
          {/* 🖤 HEART OUTLINE (stroke only, no fill) */}
          <path
            d="M48 5c-4.418 0-8.418 1.791-11.313 4.687l-3.979 3.961c-.391.391-1.023.391-1.414 0l-3.979-3.961C24.418 6.791 20.418 5 16 5 7.163 5 0 12.163 0 21c0 3.338 1.024 6.436 2.773 9l1.602 2.031 24.797 24.797C29.953 57.609 30.977 58 32 58s2.047-.391 2.828-1.172l24.797-24.797L61.227 30C62.976 27.436 64 24.338 64 21 64 12.163 56.837 5 48 5z"
            fill="none"
            stroke="#ef233c"
            strokeWidth="3"
          />
          {/* ✨ Small highlight */}
          <path
            d="M48 11c-.553 0-1 .447-1 1s.447 1 1 1c4.418 0 8 3.582 8 8"
            fill="none"
            stroke="#000"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }
  if (events.some(e => e.type === "Holiday")) {
    return (
      <div className="absolute bottom-0 right-0 text-black rounded-full p-[2px] shadow">
        <svg
          viewBox="0 0 100 100"
          className="w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M25.5 4c0-1.3-1-2.3-2.3-2.3-1.3 0-2.3 1-2.3 2.3v5.1h4.7V4zm-2.3 30.3c6.3 0 11.5-5.1 11.5-11.5S29.5 11.3 23.2 11.3 11.7 16.5 11.7 22.8s5.1 11.5 11.5 11.5zM38.9 11.7c.9-.9.9-2.4 0-3.3-.9-.9-2.4-.9-3.3 0L32 12.1l3.3 3.3 3.6-3.7zM32 33.6l3.6 3.6c.9.9 2.4.9 3.3 0 .9-.9.9-2.4 0-3.3l-3.6-3.6L32 33.6zm4.8-8.4h5.1c1.3 0 2.3-1 2.3-2.3s-1-2.3-2.3-2.3h-5.1v4.6zM11 15.4l3.3-3.3-3.6-3.6c-.9-.9-2.4-.9-3.3 0-.9.9-.9 2.4 0 3.3l3.6 3.6zM20.8 41.7c0 1.3 1 2.3 2.3 2.3s2.3-1 2.3-2.3v-5.1h-4.6v5.1zM4.3 25.2h5.1v-4.6H4.3c-1.3 0-2.3 1-2.3 2.3s1 2.3 2.3 2.3zm3.1 8.7c-.9.9-.9 2.4 0 3.3.9.9 2.4.9 3.3 0l3.6-3.6-3.3-3.3-3.6 3.6zM84.4 94.3c-10.4 0-13.6-6-22.4-6-1 0-2.1.1-3.2.2l11.5-29.3c1.6-.2 3.5.1 5.5.9 2.9 1.1 5 2.9 5.7 4.6.2.6.9.8 1.5.6 1.7-.8 4.5-.7 7.3.4 2.1.8 3.9 2 4.9 3.3.6.7 1.8.5 2-.4 3.7-14.9-4.2-30.6-18.9-36.3C63.4 26.5 47 32.9 39.8 46.5c-.4.8.3 1.8 1.2 1.7 1.6-.3 3.7 0 5.8.8 2.8 1.1 4.9 2.9 5.6 4.6.2.6.9.8 1.5.6 1.7-.8 4.5-.7 7.3.4 2 .8 3.7 1.9 4.7 3.1L53.4 89.4c-2 .4-4 .9-6.3 1.4v-7.7c0-1.1-.4-2.1-1.2-2.8l3.5-3.5c.8-.8.8-2 0-2.8s-2-.8-2.8 0L35.8 85H18.7c-2.8 0-5.1 2.3-5.1 5.1V94C6.3 94.9 2 96.5 2 98.3h96c0 0-3.2-4-13.6-4z"
          />
        </svg>
      </div>
    );
  }
  return (
    <div className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-[2px] shadow">
      <svg
        viewBox="0 0 24 24"
        className="w-3 h-3"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.1835 7.80516L16.2188 4.83755C14.1921 2.8089 13.1788 1.79457 12.0904 2.03468C11.0021 2.2748 10.5086 3.62155 9.5217 6.31506L8.85373 8.1381C8.59063 8.85617 8.45908 9.2152 8.22239 9.49292C8.11619 9.61754 7.99536 9.72887 7.86251 9.82451C7.56644 10.0377 7.19811 10.1392 6.46145 10.3423C4.80107 10.8 3.97088 11.0289 3.65804 11.5721C3.5228 11.8069 3.45242 12.0735 3.45413 12.3446C3.45809 12.9715 4.06698 13.581 5.28476 14.8L6.69935 16.2163L2.22345 20.6964C1.92552 20.9946 1.92552 21.4782 2.22345 21.7764C2.52138 22.0746 3.00443 22.0746 3.30236 21.7764L7.77841 17.2961L9.24441 18.7635C10.4699 19.9902 11.0827 20.6036 11.7134 20.6045C11.9792 20.6049 12.2404 20.5358 12.4713 20.4041C13.0192 20.0914 13.2493 19.2551 13.7095 17.5825C13.9119 16.8472 14.013 16.4795 14.2254 16.1835C14.3184 16.054 14.4262 15.9358 14.5468 15.8314C14.8221 15.593 15.1788 15.459 15.8922 15.191L17.7362 14.4981C20.4 13.4973 21.7319 12.9969 21.9667 11.9115C22.2014 10.826 21.1954 9.81905 19.1835 7.80516Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

const HOLIDAY_IMAGES: { keywords: string[]; image: string }[] = [
  { keywords: ["diwali"], image: "/images/1.jpg" },

  { keywords: ["vasant panchami", "basant panchami"], image: "/images/18.jpg" },

  { keywords: ["holi"], image: "/images/4.jpg" },

  { keywords: ["shivratri", "shivaratri", "shiv ratri"], image: "/images/5.jpg" },

  { keywords: ["lohri"], image: "/images/9.jpeg" },

  { keywords: ["good friday"], image: "/images/8.jpg" },

  { keywords: ["dussehra", "vijaya dashami"], image: "/images/6.png" },

  { keywords: ["independence day"], image: "/images/7.jpg" },

  { keywords: ["raksha bandhan"], image: "/images/22.jpg" },

  { keywords: ["christmas"], image: "/images/2.jpg" },

  { keywords: ["new year"], image: "/images/10.jpg" },

  { keywords: ["ram navmi", "ram navami"], image: "/images/12.jpg" },

  { keywords: ["republic day"], image: "/images/13.jpg" },

  { keywords: ["kabir jayanti"], image: "/images/24.jpg" },

  { keywords: ["guru nanak"], image: "/images/11.jpg" },

  { keywords: ["gobind singh"], image: "/images/25.jpg" },

  { keywords: ["arjun dev"], image: "/images/23.jpg" },

  { keywords: ["vaisakhi"], image: "/images/14.jpg" },

  {
    keywords: ["vishavkarma", "vishawkarma", "vishav karma"],
    image: "/images/19.jpg"
  },

  {
    keywords: ["krishna janamashtmi", "janamashtami", "janmashtami"],
    image: "/images/20.jpg"
  },

  { keywords: ["id ul fitr"], image: "/images/17.jpg" },

  { keywords: ["gandhi jayanti"], image: "/images/15.jpg" }
];

export const getHolidayImage = (title: string) => {
  const t = title.toLowerCase();

  for (const holiday of HOLIDAY_IMAGES) {
    if (holiday.keywords.some(k => t.includes(k))) {
      return holiday.image;
    }
  }

  return "/images/3.jpg"; // default holiday
};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YearlyModal = ({
  isOpen,
  onClose,
  currentYear,
  setCurrentYear,
  eventMap,
  getEventBadge,
  years
}: {
  isOpen: boolean;
  onClose: () => void;
  currentYear: number;
  setCurrentYear: (year: number) => void;
  eventMap: Record<string, EventItem[]>;
  getEventBadge: (events: EventItem[]) => JSX.Element;
    years: number[];
}) => {
  // Helper to check if a year is available
  const isAvailableYear = (year: number) => years.includes(year);

  // Helper to get next/prev available year
  const getPrevYear = (year: number) => {
    const sortedYears = [...years].sort((a, b) => a - b);
    const currentIndex = sortedYears.indexOf(year);
    if (currentIndex > 0) {
      return sortedYears[currentIndex - 1];
    }
    return null;
  };

  const getNextYear = (year: number) => {
    const sortedYears = [...years].sort((a, b) => a - b);
    const currentIndex = sortedYears.indexOf(year);
    if (currentIndex < sortedYears.length - 1) {
      return sortedYears[currentIndex + 1];
    }
    return null;
  };

  const handlePrevYear = () => {
    const prevYear = getPrevYear(currentYear);
    if (prevYear !== null) {
      setCurrentYear(prevYear);
    }
  };

  const handleNextYear = () => {
    const nextYear = getNextYear(currentYear);
    if (nextYear !== null) {
      setCurrentYear(nextYear);
    }
  };

  if (!isOpen) return null;

  const renderMonthCalendar = (month: number, isYearly: boolean) => {
    const monthDays = getMonthDays(currentYear, month);
    const today = new Date();
    const isToday = (day: number) =>
      today.getFullYear() === currentYear &&
      today.getMonth() === month &&
      today.getDate() === day;

    return (
      <div key={month} className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col min-h-[200px]">
        {/* Month Header */}
        <div className="p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-center flex-shrink-0">
          <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase">
            {monthNames[month]}
          </h4>
        </div>
        {/* Weekdays */}
        <div className="grid grid-cols-7 text-center text-gray-600 dark:text-gray-300 font-semibold mb-1 text-[10px] uppercase p-1 flex-shrink-0">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-[9px]">{d}</div>
          ))}
        </div>
        {/* Days Grid - No individual scroll */}
        <div className="grid grid-cols-7 gap-0.5 p-1 flex-1">
          {monthDays.map((day, idx) => {
            if (!day) return <div key={idx} className="h-6"></div>;
            const dateStr = `${currentYear}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayEvents = eventMap[dateStr] || [];
            const isEvent = dayEvents.some((e) => e.type === "Event");
            const isHoliday = dayEvents.some((e) => e.type === "Holiday");
            let cellClass =
              "h-8 flex items-center justify-center rounded cursor-pointer text-xs font-semibold relative transition border border-transparent";
            if (isToday(day)) {
              cellClass += " bg-blue-600 text-white border border-blue-700";
            } else if (isEvent) {
              cellClass += " bg-blue-100 text-blue-700 border border-blue-300";
            } else if (isHoliday) {
              cellClass += " bg-green-100 text-green-700 border border-green-300";
            } else {
              cellClass +=
                " bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700";
            }
            const dayCell = (
              <div className={cellClass}>
                {day}
                {(isEvent || isHoliday) && !isToday(day) && getEventBadge(dayEvents)}
              </div>
            );
            return dayEvents.length > 0 ? (
              <Tippy
                key={idx}
                placement="top"
                trigger="mouseenter"
                interactive={false}
                delay={[100, 0]}
                appendTo={() => document.body}
                render={() => (
                  <div
                    className="
                      w-52 rounded-xl overflow-hidden
                      bg-white dark:bg-gray-900
                      border border-gray-200 dark:border-gray-700
                      shadow-2xl text-xs
                      pointer-events-none p-2
                    "
                  >
                    {dayEvents.map((e) => {
                      const isPersonEvent =
                        e.type === "Event" &&
                        (e.title.toLowerCase().includes("birthday") ||
                          e.title.toLowerCase().includes("anniversary") ||
                          e.title.toLowerCase().includes("completed"));
                      return (
                        <div key={e.id}>
                          {/* Image Section */}
                          {isPersonEvent ? (
                            <img
                              src={e.employeeImage}
                              alt="Employee"
                              className="w-full h-44 object-cover rounded-xl"
                            />
                          ) : e.type === "Holiday" ? (
                            <img
                              src={getHolidayImage(e.title)}
                              alt={e.title}
                              className="w-full h-44 object-cover rounded-xl"
                            />
                          ) : null}
                          <div className="p-3">
                            <span
                              className={`inline-block mb-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${e.type === "Event"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                                }`}
                            >
                              {e.type}
                            </span>
                            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {e.title}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              >
                {dayCell}
              </Tippy>
            ) : (
              <div key={idx}>{dayCell}</div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-y-auto relative flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 z-10"
        >
          ×
        </button>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevYear}
              disabled={!getPrevYear(currentYear)}
              className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ‹
            </button>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {currentYear} Events Calendar
            </h3>
            <button
              onClick={handleNextYear}
              disabled={!getNextYear(currentYear)}
              className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ›
            </button>
          </div>
        </div>
        {/* Legend */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex justify-center gap-4 mb-3 text-xs font-medium">
            <div className="flex items-center gap-1 text-blue-600">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>Event
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>Holiday
            </div>
          </div>
        </div>
        {/* 12 Months Grid: Responsive columns - Main scroll */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 flex-1">
          {monthNames.map((_, month) => renderMonthCalendar(month, true))}
        </div>
      </div>
    </div>
  );
};

export default function UpcomingEventsTimeline({ years }: { years: number[] }) {
  const [currentMonth, setCurrentMonth] = useState(11);
  const [currentYear, setCurrentYear] = useState(2025);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showYearlyModal, setShowYearlyModal] = useState(false);

  const today = new Date();
  const monthDays = getMonthDays(currentYear, currentMonth);
  const { user } = useAuth();

  // Helper to check if a year is available
  const isAvailableYear = (year: number) => years.includes(year);

  // Helper to get next/prev available year
  const getPrevYear = (year: number) => {
    const sortedYears = [...years].sort((a, b) => a - b);
    const currentIndex = sortedYears.indexOf(year);
    if (currentIndex > 0) {
      return sortedYears[currentIndex - 1];
    }
    return null;
  };

  const getNextYear = (year: number) => {
    const sortedYears = [...years].sort((a, b) => a - b);
    const currentIndex = sortedYears.indexOf(year);
    if (currentIndex < sortedYears.length - 1) {
      return sortedYears[currentIndex + 1];
    }
    return null;
  };

  // ✅ Fetch events dynamically from API whenever year changes
  useEffect(() => {
    const fetchEvents = async () => {
      if (!isAvailableYear(currentYear)) return; // Don't fetch if year not available
      try {
        setLoading(true);
        const data = await apiService.getEventsCalendar(
          currentYear,
          user?.token
        );

        setEvents(data?.events ?? []);
        setError("");
      } catch (err: any) {
        setError(err.message || "Error fetching events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [currentYear, user?.token]);

  // Create map for quick lookup
  const eventMap = events.reduce<Record<string, EventItem[]>>((acc, ev) => {
    if (!acc[ev.date]) acc[ev.date] = [];
    acc[ev.date].push(ev);
    return acc;
  }, {});

  const handlePrevMonth = () => {
    if (currentMonth > 0) {
      setCurrentMonth(currentMonth - 1);
    } else {
      const prevYear = getPrevYear(currentYear);
      if (prevYear !== null) {
        setCurrentYear(prevYear);
        setCurrentMonth(11);
      }
      // If no prev year, do nothing (stay on current month/year)
    }
  };

  const handleNextMonth = () => {
    if (currentMonth < 11) {
      setCurrentMonth(currentMonth + 1);
    } else {
      const nextYear = getNextYear(currentYear);
      if (nextYear !== null) {
        setCurrentYear(nextYear);
        setCurrentMonth(0);
      }
      // If no next year, do nothing (stay on current month/year)
    }
  };

  const isToday = (day: number) =>
    today.getFullYear() === currentYear &&
    today.getMonth() === currentMonth &&
    today.getDate() === day;

  const handleOpenYearly = () => setShowYearlyModal(true);
  const handleCloseYearly = () => setShowYearlyModal(false);

  return (
    <>
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
            disabled={!getPrevYear(currentYear) && currentMonth === 0}
            className="
              p-1.5 rounded-full bg-gray-100 dark:bg-gray-800
              hover:bg-gray-200 dark:hover:bg-gray-700
              text-sm shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            ‹
          </button>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenYearly}
              className="
                p-1.5 rounded-full bg-blue-100 dark:bg-blue-900
                hover:bg-blue-200 dark:hover:bg-blue-800
                text-sm shadow-sm transition text-blue-600 dark:text-blue-400
              "
              title="View Yearly Calendar"
            >
              📅
            </button>
            <button
              onClick={handleNextMonth}
              disabled={!getNextYear(currentYear) && currentMonth === 11}
              className="
                p-1.5 rounded-full bg-gray-100 dark:bg-gray-800
                hover:bg-gray-200 dark:hover:bg-gray-700
                text-sm shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              ›
            </button>
          </div>
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
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
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
            const dayCell = (
              <div className={cellClass}>
                {day}
                {(isEvent || isHoliday) && !isToday(day) && getEventBadge(dayEvents)}
              </div>
            );
            return dayEvents.length > 0 ? (
              <Tippy
                key={idx}
                placement="top"
                trigger="mouseenter"
                interactive={false}
                delay={[100, 0]}
                appendTo={() => document.body}
                render={() => (
                  <div
                    className="
                      w-52 rounded-xl overflow-hidden
                      bg-white dark:bg-gray-900
                      border border-gray-200 dark:border-gray-700
                      shadow-2xl text-xs
                      pointer-events-none p-2
                    "
                  >
                    {dayEvents.map((e) => {
                      const isPersonEvent =
                        e.type === "Event" &&
                        (e.title.toLowerCase().includes("birthday") ||
                          e.title.toLowerCase().includes("anniversary") ||
                          e.title.toLowerCase().includes("completed"));
                      return (
                        <div key={e.id}>
                          {isPersonEvent ? (
                            <img
                              src={e.employeeImage}
                              alt="Employee"
                              className="w-full h-44 object-cover rounded-xl"
                            />
                          ) : e.type === "Holiday" ? (
                            <img
                              src={getHolidayImage(e.title)}
                              alt={e.title}
                              className="w-full h-44 object-cover rounded-xl"
                            />
                          ) : null}
                          <div className="p-3">
                            <span
                              className={`inline-block mb-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${e.type === "Event"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                                }`}
                            >
                              {e.type}
                            </span>
                            <div className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">
                              {e.title}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              >
                {dayCell}
              </Tippy>
            ) : (
              <div key={idx}>{dayCell}</div>
            );
          })}
        </div>
      </div>
      <YearlyModal
        isOpen={showYearlyModal}
        onClose={handleCloseYearly}
        currentYear={currentYear}
        setCurrentYear={setCurrentYear}
        eventMap={eventMap}
        getEventBadge={getEventBadge}
        years={years}
      />
    </>
  );
}