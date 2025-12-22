"use client";

import { useEffect, useState, useMemo } from "react";
import { Eye, Filter } from "lucide-react";
import { useAuth } from "@/context/auth-context";

type Employee = {
  EmployeeId: number;
  EmpCode: string;
  Name: string;
  Email: string;
  OfficeEmail: string;
  Designation: string;
  ActiveId: number;
  ContactNumber: string;
  AlternateNumber?: string;
  Birthday?: string;
  Aniversary?: string;
  ContactAddress?: string;
  JoiningDate: string;
  CurrentSalary?: number;
  LocalAddress?: string;
  StartShiftTime?: string;
  profileImage?: string;
};

export default function EmployeesList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active");
  const [designationFilter, setDesignationFilter] = useState("");
  const [joiningFrom, setJoiningFrom] = useState("");
  const [joiningTo, setJoiningTo] = useState("");
  const [tempFilter, setTempFilter] = useState<"active" | "inactive" | "all">("active");
  const [tempDesignationFilter, setTempDesignationFilter] = useState("");
  const [tempJoiningFrom, setTempJoiningFrom] = useState("");
  const [tempJoiningTo, setTempJoiningTo] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { user } = useAuth();

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/employees-table?token=${encodeURIComponent(user?.token || "")}`
        );
        const data = await res.json();
        setEmployees(data.data || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchEmployees();
  }, [user?.token]);

  const parseDDMMYYYY = (dateStr: string) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatShiftTime = (timeStr: string) => {
    if (!timeStr) return "-";
    const date = new Date(timeStr);
    const hours = date.getUTCHours(); // UTC hours
    const minutes = date.getUTCMinutes(); // UTC minutes
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    const minStr = minutes.toString().padStart(2, "0");
    return `${hour12}:${minStr} ${ampm}`;
  };

  const toTitleCase = (name: string) => {
    return name
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const uniqueDesignations = useMemo(() => {
    return [...new Set(employees.map(emp => emp.Designation))].sort();
  }, [employees]);

  /* ---------------- FILTER ---------------- */
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.Name.toLowerCase().includes(search.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === "active") matchesStatus = emp.ActiveId === 1;
    else if (statusFilter === "inactive") matchesStatus = emp.ActiveId !== 1;

    const matchesDesignation = !designationFilter || emp.Designation === designationFilter;

    let matchesDate = true;
    if (joiningFrom || joiningTo) {
      const empDate = new Date(emp.JoiningDate);
      if (joiningFrom) {
        const fromDate = new Date(joiningFrom);
        if (empDate < fromDate) matchesDate = false;
      }
      if (joiningTo) {
        const toDate = new Date(joiningTo);
        if (empDate > toDate) matchesDate = false;
      }
    }

    return matchesSearch && matchesStatus && matchesDesignation && matchesDate;
  });

  const getAvatar = (name: string) => {
    const parts = name.split(" ");
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  };

  const handleApplyFilter = () => {
    setStatusFilter(tempFilter);
    setDesignationFilter(tempDesignationFilter);
    setJoiningFrom(tempJoiningFrom);
    setJoiningTo(tempJoiningTo);
    setShowFilter(false);
  };

  const handleCancelFilter = () => {
    setTempFilter(statusFilter);
    setTempDesignationFilter(designationFilter);
    setTempJoiningFrom(joiningFrom);
    setTempJoiningTo(joiningTo);
    setShowFilter(false);
  };

  const handleClearFilters = () => {
    setTempFilter("all");
    setTempDesignationFilter("");
    setTempJoiningFrom("");
    setTempJoiningTo("");
  };

  return (
    <div className="p-2 space-y-4">
      <h1 className="text-xl font-bold">Employee List</h1>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4 items-start sm:items-center">
        <input
          type="search"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-sm border shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-50 focus:ring-offset-0"
        />
        <button
          onClick={() => {
            setTempFilter(statusFilter);
            setTempDesignationFilter(designationFilter);
            setTempJoiningFrom(joiningFrom);
            setTempJoiningTo(joiningTo);
            setShowFilter(true);
          }}
          className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-300 hover:text-black shadow-sm"
        >
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-sm border shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-xs uppercase text-left">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Contact Number</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joining Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <>
                {Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b">
                    <td className="px-3 py-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="h-4 bg-gray-200 rounded w-2/4"></div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="h-4 bg-gray-200 rounded w-4"></div>
                    </td>
                  </tr>
                ))}
              </>
            )}
            {!loading && filteredEmployees.map(emp => (
              <tr key={emp.EmployeeId} className="border-b hover:bg-gray-50">
                <td className="px-3 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {emp.profileImage ? (
                      <img
                        src={emp.profileImage}
                        alt={emp.Name}
                        className="w-full h-full object-cover"
                        onError={(e) => e.currentTarget.style.display = "none"}
                      />
                    ) : <span className="text-sm font-semibold text-gray-600">{getAvatar(emp.Name)}</span>}
                  </div>
                  <div className="flex flex-col">
                    <div className="font-semibold text-md">
                      {toTitleCase(emp.Name)}
                    </div>
                    <div className="text-sm text-gray-500">{emp.OfficeEmail}</div>
                  </div>
                </td>
                <td className="px-3">{emp.Email || "-"}</td>
                <td className="px-3">{emp.ContactNumber}</td>
                <td className="px-3">{emp.Designation}</td>
                <td className="px-3">{emp.JoiningDate}</td>
                <td className="px-3">
                  <span className={`px-2 py-1 rounded text-xs ${emp.ActiveId === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {emp.ActiveId === 1 ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 text-right">
                  <button onClick={() => setSelectedEmployee(emp)} className="text-blue-600">
                    <Eye className="h-5 w-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filteredEmployees.length === 0 && (
          <p className="text-center py-6 text-gray-500">
            {search || statusFilter !== "all" || designationFilter || joiningFrom || joiningTo ? "No employees found matching your criteria." : "No employees found."}
          </p>
        )}
      </div>

      {/* ---------------- Filter Modal ---------------- */}
      {showFilter && (
        <div className="fixed inset-0 top-[-30px] bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md w-full max-w-md shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">

            {/* Header */}
            <div className="px-6 py-4 border-b sticky top-0 bg-white z-10 flex flex-col">
              <h2 className="text-lg font-semibold text-gray-800">Filter Employees</h2>
              <p className="text-sm text-gray-500 mt-1">Filter by status, designation, and joining date</p>
            </div>

            {/* Body */}
            <div className="px-6 py-4 space-y-6 overflow-y-auto flex-1">
              {/* Status Filter */}
              {/* Status Filter as Dropdown */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                <select
                  value={tempFilter}
                  onChange={(e) => setTempFilter(e.target.value as "active" | "inactive" | "all")}
                  className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-blue-500 hover:border-blue-400 transition"
                >
                  <option value="active">Active Employees</option>
                  <option value="inactive">Inactive Employees</option>
                  <option value="all">All Employees</option>
                </select>
              </div>

              {/* Designation Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Designation</h3>
                <select
                  value={tempDesignationFilter}
                  onChange={(e) => setTempDesignationFilter(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-blue-500 hover:border-blue-400 transition"
                >
                  <option value="">All Designations</option>
                  {uniqueDesignations.map(des => (
                    <option key={des} value={des}>{des}</option>
                  ))}
                </select>
              </div>

              {/* Joining Date Range Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Joining Date Range</h3>
                <div className="flex gap-2 items-center">
                  <input
                    type="date"
                    value={tempJoiningFrom}
                    onChange={(e) => setTempJoiningFrom(e.target.value)}
                    className="flex-1 p-2 border rounded-lg focus:ring-1 focus:ring-blue-500 hover:border-blue-400 transition"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    value={tempJoiningTo}
                    onChange={(e) => setTempJoiningTo(e.target.value)}
                    className="flex-1 p-2 border rounded-lg focus:ring-1 focus:ring-blue-500 hover:border-blue-400 transition"
                  />
                </div>
              </div>

              {/* Future Filters Placeholder */}
              {/* Example: Department, Role, Location etc. */}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t bg-white sticky bottom-0 flex gap-2 z-10">
              <button
                onClick={handleClearFilters}
                className="flex-1 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 text-sm transition"
              >
                Clear All
              </button>
              <button
                onClick={handleCancelFilter}
                className="flex-1 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyFilter}
                className="flex-1 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm transition"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ---------------- Enhanced Employee Detail Modal ---------------- */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 top-[-50px]">
          <div className="bg-white rounded-md p-6 w-full max-w-lg shadow-2xl border border-gray-200">
            {/* Header with Avatar and Basic Info */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                {selectedEmployee.profileImage ? (
                  <img
                    src={selectedEmployee.profileImage}
                    alt={selectedEmployee.Name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {getAvatar(selectedEmployee.Name)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 truncate">{toTitleCase(selectedEmployee.Name)}</h2>
                <p className="text-base text-gray-600 mt-1">{selectedEmployee.Designation}</p>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Details Grid - Improved with better pairing and formatting */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {/* Contact Info Row */}
                <div className="md:col-span-2 space-y-2 p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedEmployee.Email || "-"}</p>
                    </div>
                    <div className="space-y-1"></div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500">Contact Number</label>
                      <p className="text-gray-900 font-medium">{selectedEmployee.ContactNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500">Alternate Number</label>
                      <p className="text-gray-900">{selectedEmployee.AlternateNumber || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Personal Info Row */}
                <div className="space-y-2 p-3 bg-blue-50 rounded-lg md:col-span-2">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedEmployee.JoiningDate && (
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Joining Date</label>
                        <p className="text-gray-900">
                          {parseDDMMYYYY(selectedEmployee.JoiningDate)?.toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }) || "-"}
                        </p>
                      </div>
                    )}
                    {selectedEmployee.Birthday && (
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Birthday</label>
                        <p className="text-gray-900">
                          {new Date(selectedEmployee.Birthday).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                    {selectedEmployee.Aniversary && (
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Anniversary</label>
                        <p className="text-gray-900">
                          {new Date(selectedEmployee.Aniversary).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                    {selectedEmployee.CurrentSalary !== undefined && (
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Salary</label>
                        <p className="text-gray-900 font-medium">₹{selectedEmployee.CurrentSalary.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address & Shift */}
                {selectedEmployee.LocalAddress && (
                  <div className="space-y-2 p-3 bg-indigo-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Location
                    </h3>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500">Local Address</label>
                      <p className="text-gray-900">{selectedEmployee.LocalAddress}</p>
                    </div>
                  </div>
                )}
                {selectedEmployee.StartShiftTime && (
                  <div className="space-y-2 p-3 bg-yellow-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Shift Timing
                    </h3>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500">Start Shift</label>
                      <p className="text-gray-900">{formatShiftTime(selectedEmployee.StartShiftTime)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}