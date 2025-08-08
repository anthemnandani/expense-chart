"use client"

import ComprehensiveDashboard from "@/components/comprehensive-dashboard"
export default function DashboardContent() {
  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
            Financial Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Complete overview of your financial data</p>
        </div>
      </div>

      {/* Comprehensive Dashboard */}
      <ComprehensiveDashboard />
    </div>
  )
}
