"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Download, Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expenses</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track all your financial transactions</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and filter your expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search expenses..." className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseData.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{expense.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={expense.type === "Credit" ? "default" : "destructive"}
                        className={
                          expense.type === "Credit"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }
                      >
                        {expense.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <span className={expense.type === "Credit" ? "text-emerald-600" : "text-red-600"}>
                        {expense.type === "Credit" ? "+" : "-"}₹{expense.amount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
