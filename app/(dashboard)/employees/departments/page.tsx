"use client";

import { useState } from "react";
import { Eye, Edit, Trash2, Plus } from "lucide-react";

const DepartmentsPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const departments = [
    { id: 1, name: "Human Resources", description: "Manages recruitment and employee relations." },
    { id: 2, name: "Finance", description: "Handles company finances and payroll." },
    { id: 3, name: "IT", description: "Maintains company systems and technical needs." },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Departments</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={18} className="inline mr-1" /> Add Department
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 border-b">ID</th>
              <th className="py-3 px-4 border-b">Department Name</th>
              <th className="py-3 px-4 border-b">Description</th>
              <th className="py-3 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{dept.id}</td>
                <td className="py-3 px-4 font-medium">{dept.name}</td>
                <td className="py-3 px-4">{dept.description}</td>
                <td className="py-3 px-4 flex items-center justify-center space-x-3">
                  {/* View */}
                  <button
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye size={18} />
                  </button>
                  {/* Edit */}
                  <button className="text-green-600 hover:text-green-800">
                    <Edit size={18} />
                  </button>
                  {/* Delete */}
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Popup Modal */}
      {/* {selectedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white w-96 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Department Details</h2>
            <p><strong>ID:</strong> {selectedDepartment.id}</p>
            <p><strong>Name:</strong> {selectedDepartment.name}</p>
            <p><strong>Description:</strong> {selectedDepartment.description}</p>

            <div className="text-right mt-5">
              <button
                onClick={() => setSelectedDepartment(null)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )} */}

    </div>
  );
};

export default DepartmentsPage;