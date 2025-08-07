"use client"

import DashboardLayout from "@/components/dashboard-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

type ExpenseType = {
  ExpenseTypeId: number
  Type: string
  IsDeleted: number
  CreatedOn: string
}

export default function ExpenseTypesPage() {
  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchExpenseTypes() {
      try {
        const res = await fetch("/api/expense-types")
        const data = await res.json()
        setExpenseTypes(data)
      } catch (err) {
        console.error("Failed to load expense types", err)
      } finally {
        setLoading(false)
      }
    }

    fetchExpenseTypes()
  }, [])

  const typeColors = [
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-teal-500",
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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-700" />
                    <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-700" />
                  </div>
                  <div className="h-4 w-20 rounded bg-gray-300 dark:bg-gray-700" />
                </div>
                <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="flex justify-between pt-2">
                  <div className="h-3 w-20 rounded bg-gray-300 dark:bg-gray-700" />
                  <div className="flex gap-2">
                    <div className="h-6 w-6 rounded bg-gray-300 dark:bg-gray-700" />
                    <div className="h-6 w-6 rounded bg-gray-300 dark:bg-gray-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expenseTypes.map((type, index) => {
              const color = typeColors[index % typeColors.length]
              const fakeCount = (index + 1) * 5 // simulate usage count
              return (
                <Card key={type.ExpenseTypeId} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${color}`} />
                        <CardTitle className="text-lg">{type.Type}</CardTitle>
                      </div>
                      <Badge variant="secondary">{fakeCount} transactions</Badge>
                    </div>
                    <CardDescription>Created: {new Date(type.CreatedOn).toDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">Recently used</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {!loading && (
          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>How often each expense type is used</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenseTypes.map((type, index) => {
                  const color = typeColors[index % typeColors.length]
                  const fakeCount = (index + 1) * 5
                  return (
                    <div key={type.ExpenseTypeId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${color}`} />
                        <span className="font-medium">{type.Type}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${color}`}
                            style={{ width: `${(fakeCount / 45) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 w-16 text-right">{fakeCount} uses</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
