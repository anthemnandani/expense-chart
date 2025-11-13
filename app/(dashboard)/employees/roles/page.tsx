"use client";

import { useState } from "react";

export default function EmployeesRoles() {
  const roles = [
    { name: "Admin", description: "Full control over the system and configurations." },
    { name: "Manager", description: "Can assign tasks, approve requests, and manage team members." },
    { name: "Developer", description: "Works on product development and internal tooling." },
    { name: "HR", description: "Manages employee onboarding, attendance, and HR policies." },
    { name: "Accountant", description: "Handles payments, invoices, payroll, and financial reports." },
    { name: "Team Lead", description: "Guides a team and ensures smooth day-to-day workflow." },
  ];

  const [search, setSearch] = useState("");

  const filteredRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8">

      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold">Employee Roles</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Define responsibilities and access levels within the organization.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-sm">
        <input
          type="search"
          placeholder="Search role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                     bg-white dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Roles Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role, index) => (
          <div
            key={index}
            className="group p-6 rounded-xl border border-gray-200 dark:border-gray-800 
                       shadow-sm hover:shadow-lg hover:border-blue-500 
                       transition duration-300 bg-white dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold group-hover:text-blue-600">
                {role.name}
              </h2>
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            </div>

            <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
              {role.description}
            </p>

            <button
              className="mt-5 px-4 py-2 text-sm rounded-lg border border-blue-500 text-blue-600 
                         group-hover:bg-blue-600 group-hover:text-white transition"
            >
              View Permissions
            </button>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredRoles.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
          No roles found.
        </p>
      )}
    </div>
  );
}
