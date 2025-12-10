"use client";

import LateComingChart from "@/components/employeeCharts/LateComingChart";
import ActiveEmployeeCharts from "@/components/employeeCharts/ActiveEmployeeCharts";
import LeaveChart from "@/components/employeeCharts/LeaveChart";
import EmployeeLeavesChart from "@/components/employeeCharts/EmployeeLeavesChart";
import EmployeeStatCards from "@/components/employeeCharts/UniqueStatCards";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiService } from "@/lib/apiService";
import GenderChart from "@/components/employeeCharts/GenderChart";
import AttendanceHeatmap from "@/components/employeeCharts/AttendanceHeatmap";
import { DepartmentTreeChart } from "@/components/employeeCharts/DepartmentTreeChart";
import EmployeeSalaryChart from "@/components/employeeCharts/EmployeeSalaryChart";

export default function EmployeesDashboard() {
  const { user } = useAuth();
  const groupId = user?.groupId;
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        console.log("Fetching years... groupId:", groupId); // Debug: Check if groupId exists
        const response = await apiService.getAvailableEmployeeYears();
        console.log("Raw API response:", response); // Debug: Log full response
        const fetchedYears = Array.isArray(response) ? response : (response.availableYears || response.years || []); // Flexible extraction
        console.log("Extracted years array:", fetchedYears); // Debug: Log extracted array
        setYears(fetchedYears);
        if (fetchedYears.length > 0) {
          setSelectedYear(fetchedYears[fetchedYears.length - 1]);
        }
      } catch (error) {
        console.error("Error fetching years:", error);
        setYears([]);
      }
    };
    fetchYears();
  }, []); // Note: If groupId changes, add it to deps: [groupId]

  // Debug: Log years whenever it changes
  useEffect(() => {
    console.log("Dashboard years state updated:", years);
  }, [years]);


  return (
    <div className="space-y-8 p-6">

      <h1 className="text-3xl font-bold">Employees Dashboard</h1>

      {/* Hero Section
      <div className="relative w-full h-64 rounded-xl overflow-hidden shadow">
        <Image
          src="/images/EmployeesManagement.jpg"
          alt="Employees"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h2 className="text-white text-3xl font-semibold">Manage Your Workforce Effectively</h2>
        </div>
      </div> */}
      <EmployeeStatCards />

      <ActiveEmployeeCharts />

      <EmployeeSalaryChart />

      <LeaveChart years={years} />

      <LateComingChart years={years} />
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3">
          <AttendanceHeatmap />
        </div>

        <div className="col-span-2">
          <GenderChart />
        </div>
      </div>

      <DepartmentTreeChart />

      {/* Chart */}
      <EmployeeLeavesChart years={years} />
    </div>
  );
}