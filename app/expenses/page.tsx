"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Download } from "lucide-react"

export default function ExpensesPage() {
  const expenses = [
    { id: 1, date: "2025-01-29", description: "Tea", amount: 150, category: "Food", type: "Debit" },
    { id: 2, date: "2025-01-28", description: "Salary", amount: 5000, category: "Income", type: "Credit" },
    { id: 3, date: "2025-01-27", description: "Water", amount: 50, category: "Utilities", type: "Debit" },
    { id: 4, date: "2025-01-26", description: "Party", amount: 500, category: "Entertainment", type: "Debit" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expenses</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your income and expenses</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="search" placeholder="Search expenses..." className="pl-10" />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                    <SelectItem value="debit">Debit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Apply
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest income and expense transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Description</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-right py-3 px-4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4">{expense.date}</td>
                      <td className="py-3 px-4 font-medium">{expense.description}</td>
                      <td className="py-3 px-4">{expense.category}</td>
                      <td className="py-3 px-4">
                        <Badge variant={expense.type === "Credit" ? "default" : "destructive"}>{expense.type}</Badge>
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-medium ${
                          expense.type === "Credit" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {expense.type === "Credit" ? "+" : "-"}₹{expense.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
