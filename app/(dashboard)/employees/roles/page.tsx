"use client";

import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

type Employee = {
  EmployeeId: string;
  Name: string;
  profileImage: string;
};

type Designation = {
  Designationid: number;
  Designation: string;
  employeeCount: number;
  employees: Employee[];
};

export default function EmployeesRoles() {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState<string | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);

  const toTitleCase = (name: string) => {
    return name
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/designations");
        const data = await res.json();
        if (data.success) setDesignations(data.data);
      } catch (err) {
        console.error("Error fetching designations:", err);
      }
    };
    fetchDesignations();
  }, []);

  const filteredDesignations = designations.filter((d) =>
    d.Designation.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewEmployees = async (designation: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/designations?designation=${designation}`
      );
      const data = await res.json();
      if (data.success) {
        setEmployees(data.data);
        setSelectedDesignation(designation);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-2 space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Employee Designations</h1>

      {/* Search */}
      <div className="max-w-sm">
        <input
          type="search"
          placeholder="Search designation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Designation</th>
              <th className="px-5 py-3 text-center">Active Employees</th>
              <th className="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredDesignations.length > 0 ? (
              filteredDesignations.map((des) => (
                <tr
                  key={des.Designationid}
                  className="hover:bg-gray-50 transition"
                >
                  {/* ID - subtle */}
                  <td className="px-5 py-3 text-gray-500">
                    #{des.Designationid}
                  </td>

                  {/* Designation - primary */}
                  <td className="px-5 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">
                        {des.Designation}
                      </span>
                    </div>
                  </td>

                  {/* Employee Count */}
                  <td className="px-5 py-3 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                bg-blue-100 text-blue-700 text-xs font-semibold">
                      {des.employeeCount}
                      <span className="text-[10px] font-normal">Employees</span>
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => setSelectedDesignation(des)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md
  border border-gray-300 hover:bg-blue-50 hover:border-blue-500 transition"
                    >
                      <Eye size={16} />
                    </button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-500">
                  No designations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {selectedDesignation && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-md p-5 shadow-xl">

              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedDesignation.Designation}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {selectedDesignation.employeeCount} Employees
                  </p>
                </div>

                <button
                  onClick={() => setSelectedDesignation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Employee List */}
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {selectedDesignation.employees.length > 0 ? (
                  selectedDesignation.employees.map(emp => (
                    <div
                      key={emp.EmployeeId}
                      className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-50"
                    >
                      <img
                        src={emp.profileImage}
                        alt={emp.Name}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                      <span className="font-medium text-gray-800">
                        {toTitleCase(emp.Name)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center">
                    No active employees
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
