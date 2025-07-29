"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Download, Upload } from "lucide-react"

const expenseData = [
  { id: 1, date: "2025-07-31", description: "Miscellaneous income", category: "Other", type: "Credit", amount: 30 },
  { id: 2, date: "2025-07-05", description: "General expense", category: "Other", type: "Debit", amount: 1000 },
  { id: 3, date: "2025-07-04", description: "Additional income", category: "Income", type: "Credit", amount: 400 },
  { id: 4, date: "2025-07-03", description: "Primary income", category: "Income", type: "Credit", amount: 5000 },
  { id: 5, date: "2025-07-03", description: "Daily expense", category: "Other", type: "Debit", amount: 200 },
  { id: 6, date: "2025-06-15", description: "Tea expenses", category: "Tea", type: "Debit", amount: 150 },
  { id: 7, date: "2025-06-10", description: "Water bill", category: "Water", type: "Debit", amount: 200 },
  { id: 8, date: "2025-05-20", description: "Party expenses", category: "Party", type: "Debit", amount: 500 },
]

export default function ExpensesPage() {
  const expenses = [
    { id: 1, date: "2025-01-15", category: "Tea", amount: 150, description: "Morning tea", type: "Debit" },
    { id: 2, date: "2025-01-14", category: "Water", amount: 25, description: "Bottled water", type: "Debit" },
    { id: 3, date: "2025-01-13", category: "Party", amount: 500, description: "Birthday celebration", type: "Debit" },
    { id: 4, date: "2025-01-12", category: "Income", amount: 5000, description: "Salary", type: "Credit" },
    { id: 5, date: "2025-01-11", category: "Tea", amount: 120, description: "Evening tea", type: "Debit" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expenses</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track all your financial transactions</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="search" placeholder="Search expenses..." className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="tea">Tea</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="party">Party</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
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
              <div className="space-y-2">
                <Label htmlFor="date">Date Range</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Last 30 days" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>All your financial transactions in one place</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${expense.type === "Credit" ? "bg-emerald-500" : "bg-red-500"}`}
                    />
                    <div>
                      <div className="font-semibold">{expense.description}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {expense.date} • {expense.category}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={expense.type === "Credit" ? "default" : "destructive"}>{expense.type}</Badge>
                    <div className={`font-bold ${expense.type === "Credit" ? "text-emerald-600" : "text-red-600"}`}>
                      {expense.type === "Credit" ? "+" : "-"}₹{expense.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Expense Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Expense</CardTitle>
            <CardDescription>Record a new financial transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense-category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tea">Tea</SelectItem>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="party">Party</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense-type">Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">Credit</SelectItem>
                      <SelectItem value="debit">Debit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="expense-date">Date</Label>
                  <Input id="expense-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter description..." rows={3} />
                </div>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
