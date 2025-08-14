"use client"

import { useEffect, useMemo, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Download } from "lucide-react"
import { Expense } from "@/lib/types"
import CustomPagination from "@/components/CustomPagination"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [expenseTypes, setExpenseTypes] = useState<{ ExpenseTypeId: number; Type: string }[]>([])
  const [selectedType, setSelectedType] = useState<string>("all")
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/expenses")
        if (!res.ok) throw new Error("Failed to fetch expenses")
        const data = await res.json()
        setExpenses(data)

        // Extract unique categories
        const uniqueCategories = [...new Set(data.map((exp: Expense) => exp.ExpenseDescType))]
        setCategories(uniqueCategories.filter(Boolean))
      } catch (error) {
        console.error("Error fetching expenses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchExpenses()
  }, [])

  useEffect(() => {
    const fetchExpenseTypes = async () => {
      try {
        const res = await fetch("/api/expense-types")
        if (!res.ok) throw new Error("Failed to fetch expense types")
        const data = await res.json()
        setExpenseTypes(data)
      } catch (error) {
        console.error("Error fetching expense types:", error)
      }
    }

    fetchExpenseTypes()
  }, [])

  const enrichedExpenses = useMemo(() => {
    const typeMap = Object.fromEntries(
      expenseTypes.map((t) => [t.ExpenseTypeId, t.Type])
    )
    return expenses.map((exp) => ({
      ...exp,
      Type: typeMap[exp.ExpenseTypeId] || "",
    }))
  }, [expenses, expenseTypes])

  const filteredExpenses = useMemo(() => {
    return enrichedExpenses.filter((exp) => {
      const typeMatch = selectedType === "all" || exp.Type === selectedType;
      const categoryMatch =
        selectedCategory === "all" || exp.ExpenseDescType === selectedCategory;
      return typeMatch && categoryMatch;
    });
  }, [enrichedExpenses, selectedType, selectedCategory])

  const paginatedExpenses = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filteredExpenses.slice(start, end)
  }, [filteredExpenses, currentPage, rowsPerPage])

  const handleExportToPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text("Expenses Report", 14, 22)

    const tableColumn = ["Date", "Description", "Category", "Type", "Amount"]
    const tableRows: any[] = []

    filteredExpenses.forEach((exp) => {
      const date = new Date(exp.Date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })

      tableRows.push([
        date,
        exp.Description,
        exp.ExpenseDescType,
        exp.Type === "Cr." ? "Credit" : "Debit",
        `${exp.Expenses.toLocaleString()}`,
      ])
    })

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: {
        fontSize: 9, 
      },
      columnStyles: {
        0: { cellWidth: 28 },
        1: { cellWidth: 88 },
        2: { cellWidth: 28 },
        3: { cellWidth: 25 },
        4: { cellWidth: 35 },
      },
    })

    doc.save("expenses-report.pdf")
  }


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expenses</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your income and expenses
            </p>
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
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="Cr.">Credit</SelectItem>
                    <SelectItem value="Dr.">Debit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                {/* <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Apply
                </Button> */}
                <Button variant="outline" onClick={handleExportToPDF}>
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
            <CardDescription>
              Your latest income and expense transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm">Date</th>
                    <th className="text-left py-3 px-4 text-sm">Description</th>
                    <th className="text-left py-3 px-4 text-sm">Category</th>
                    <th className="text-left py-3 px-4 text-sm">Type</th>
                    <th className="text-right py-3 px-4 text-sm">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: rowsPerPage }).map((_, i) => (
                      <tr key={i} className="animate-pulse border-b">
                        <td className="py-3 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" /></td>
                        <td className="py-3 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" /></td>
                        <td className="py-3 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" /></td>
                        <td className="py-3 px-4"><div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" /></td>
                        <td className="py-3 px-4 text-right"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto" /></td>
                      </tr>
                    ))
                  ) : (
                    paginatedExpenses.map((expense) => (
                      <tr
                        key={expense.ExpenseId}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="py-3 px-4 text-sm">
                          {new Date(expense.Date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }).replace(" ", " ")}
                        </td>

                        <td className="py-3 px-4 text-sm">
                          {expense.Description}
                        </td>
                        <td className="py-3 px-4 text-sm">{expense.ExpenseDescType}</td>
                        <td className="py-3 px-4">
                          <Badge variant={expense.Type === "Cr." ? "default" : "destructive"}>
                            {expense.Type === "Cr." ? "Credit" : "Debit"}
                          </Badge>
                        </td>

                        <td
                          className={`py-3 px-4 text-right text-sm ${expense.Type === "Cr." ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                            }`}
                        >
                          {expense.Type === "Cr." ? "+" : "-"}₹
                          {expense.Expenses.toLocaleString()}
                        </td>


                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <CustomPagination
                totalItems={filteredExpenses.length}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}