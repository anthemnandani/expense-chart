"use client";

import { useState } from "react";
import { Eye } from "lucide-react";

export default function EmployeesList() {
const employees = [
  { id: 1, name: "Amit Sharma", email: "amit.sharma@example.com", role: "Developer", department: "IT", status: "Active", phone: "9876543210", joiningDate: "2022-01-15" },
  { id: 2, name: "Riya Verma", email: "riya.verma@example.com", role: "HR Manager", department: "HR", status: "Active", phone: "9998887777", joiningDate: "2023-03-10" },
  { id: 3, name: "Karan Patel", email: "karan.patel@example.com", role: "Accountant", department: "Finance", status: "Inactive", phone: "9090909090", joiningDate: "2021-11-05" },
  { id: 4, name: "Sneha Gupta", email: "sneha.gupta@example.com", role: "UI/UX Designer", department: "Design", status: "Active", phone: "8899776655", joiningDate: "2024-02-12" },
  { id: 5, name: "Rahul Mehta", email: "rahul.mehta@example.com", role: "Project Manager", department: "Management", status: "Active", phone: "9988776655", joiningDate: "2020-04-18" },
  { id: 6, name: "Priya Singh", email: "priya.singh@example.com", role: "Recruiter", department: "HR", status: "Active", phone: "9801234567", joiningDate: "2023-08-01" },
  { id: 7, name: "Vikas Yadav", email: "vikas.yadav@example.com", role: "Network Engineer", department: "IT", status: "Active", phone: "9911223344", joiningDate: "2021-06-22" },
 ];

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase()) &&
    (departmentFilter ? emp.department === departmentFilter : true)
  );

  const getAvatar = (name: string) => {
    const parts = name.split(" ");
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  };

  return (
    <div className="p-6 space-y-8">

      <h1 className="text-3xl font-bold">Employee List</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="search"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">All Departments</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wide">
            <tr>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4 flex items-center gap-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                    {getAvatar(emp.name)}
                  </div>
                  {emp.name}
                </td>

                <td className="px-4">{emp.email}</td>
                <td className="px-4">{emp.role}</td>
                <td className="px-4">{emp.department}</td>

                <td className="px-4">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      emp.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>

                <td className="px-4 text-right">
                  <button
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <Eye className="inline h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEmployees.length === 0 && (
          <p className="text-center py-6 text-gray-500">No employees found.</p>
        )}
      </div>

      {/* Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4 relative animate-fadeIn">
            
            <h2 className="text-xl font-semibold border-b pb-2">Employee Details</h2>

            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {selectedEmployee.name}</p>
              <p><strong>Email:</strong> {selectedEmployee.email}</p>
              <p><strong>Role:</strong> {selectedEmployee.role}</p>
              <p><strong>Department:</strong> {selectedEmployee.department}</p>
              <p><strong>Status:</strong> {selectedEmployee.status}</p>
              <p><strong>Phone:</strong> {selectedEmployee.phone}</p>
              <p><strong>Joining Date:</strong> {selectedEmployee.joiningDate}</p>
            </div>

            <button
              onClick={() => setSelectedEmployee(null)}
              className="w-full mt-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
