"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Coffee, Droplets, PartyPopper, MoreHorizontal } from "lucide-react"

const expenseTypes = [
  {
    id: 1,
    name: "Tea",
    icon: Coffee,
    color: "emerald",
    totalExpenses: 3100,
    transactionCount: 15,
    description: "Tea and beverage expenses",
  },
  {
    id: 2,
    name: "Water",
    icon: Droplets,
    color: "blue",
    totalExpenses: 520,
    transactionCount: 8,
    description: "Water bills and related expenses",
  },
  {
    id: 3,
    name: "Party",
    icon: PartyPopper,
    color: "purple",
    totalExpenses: 296,
    transactionCount: 3,
    description: "Party and entertainment expenses",
  },
  {
    id: 4,
    name: "Other",
    icon: MoreHorizontal,
    color: "gray",
    totalExpenses: 300,
    transactionCount: 5,
    description: "Miscellaneous expenses",
  },
]

const colorClasses = {
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-700 dark:text-emerald-400",
    icon: "text-emerald-600",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-700 dark:text-blue-400",
    icon: "text-blue-600",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-200 dark:border-purple-800",
    text: "text-purple-700 dark:text-purple-400",
    icon: "text-purple-600",
  },
  gray: {
    bg: "bg-gray-50 dark:bg-gray-800",
    border: "border-gray-200 dark:border-gray-700",
    text: "text-gray-700 dark:text-gray-400",
    icon: "text-gray-600",
  },
}

export default function ExpenseTypesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expense Types</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and organize your expense categories</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Type
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{expenseTypes.length}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active expense types</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                ₹{expenseTypes.reduce((sum, type) => sum + type.totalExpenses, 0).toLocaleString()}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Across all categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {expenseTypes.reduce((sum, type) => sum + type.transactionCount, 0)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Expense Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expenseTypes.map((type) => {
            const Icon = type.icon
            const colors = colorClasses[type.color as keyof typeof colorClasses]

            return (
              <Card
                key={type.id}
                className={`${colors.bg} ${colors.border} border-2 hover:shadow-lg transition-shadow`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 ${colors.icon}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className={`text-xl ${colors.text}`}>{type.name}</CardTitle>
                        <CardDescription className="text-sm">{type.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Spent</span>
                    <span className={`text-lg font-bold ${colors.text}`}>₹{type.totalExpenses.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Transactions</span>
                    <Badge variant="outline" className={`${colors.bg} ${colors.text} ${colors.border}`}>
                      {type.transactionCount}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Avg per Transaction</span>
                    <span className="text-sm font-semibold">
                      ₹{Math.round(type.totalExpenses / type.transactionCount).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
