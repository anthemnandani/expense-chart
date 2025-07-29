"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function ExpenseTypesPage() {
  const expenseTypes = [
    { id: 1, name: "Tea", description: "Daily tea expenses", color: "bg-green-500", count: 45 },
    { id: 2, name: "Water", description: "Water and beverages", color: "bg-blue-500", count: 12 },
    { id: 3, name: "Party", description: "Entertainment and parties", color: "bg-purple-500", count: 8 },
    { id: 4, name: "Other", description: "Miscellaneous expenses", color: "bg-gray-500", count: 3 },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expense Types</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your expense categories</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Type
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expenseTypes.map((type) => (
            <Card key={type.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${type.color}`} />
                    <CardTitle className="text-lg">{type.name}</CardTitle>
                  </div>
                  <Badge variant="secondary">{type.count} transactions</Badge>
                </div>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Last used: 2 days ago</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
            <CardDescription>How often each expense type is used</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseTypes.map((type) => (
                <div key={type.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${type.color}`} />
                    <span className="font-medium">{type.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${type.color}`}
                        style={{ width: `${(type.count / 45) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-16 text-right">{type.count} uses</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
