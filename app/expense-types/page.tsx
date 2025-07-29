"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Coffee, Droplets, PartyPopper, MoreHorizontal } from "lucide-react"

export default function ExpenseTypesPage() {
  const expenseTypes = [
    {
      id: 1,
      name: "Tea",
      description: "Tea and beverages",
      color: "#10b981",
      icon: Coffee,
      totalExpenses: 3100,
      transactionCount: 25,
    },
    {
      id: 2,
      name: "Water",
      description: "Bottled water and drinks",
      color: "#f59e0b",
      icon: Droplets,
      totalExpenses: 520,
      transactionCount: 8,
    },
    {
      id: 3,
      name: "Party",
      description: "Celebrations and events",
      color: "#ef4444",
      icon: PartyPopper,
      totalExpenses: 296,
      transactionCount: 3,
    },
    {
      id: 4,
      name: "Other",
      description: "Miscellaneous expenses",
      color: "#8b5cf6",
      icon: MoreHorizontal,
      totalExpenses: 300,
      transactionCount: 5,
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expense Types</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and organize your expense categories</p>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Type
          </Button>
        </div>

        {/* Expense Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {expenseTypes.map((type) => {
            const IconComponent = type.icon
            return (
              <Card key={type.id} className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${type.color}20` }}>
                        <IconComponent className="h-5 w-5" style={{ color: type.color }} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{type.name}</CardTitle>
                        <CardDescription className="text-sm">{type.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Spent</span>
                      <span className="font-bold" style={{ color: type.color }}>
                        ₹{type.totalExpenses.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Transactions</span>
                      <Badge variant="secondary">{type.transactionCount}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Avg per Transaction</span>
                      <span className="text-sm font-medium">
                        ₹{Math.round(type.totalExpenses / type.transactionCount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Add New Type Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Expense Type</CardTitle>
            <CardDescription>Create a new category for organizing your expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type-name">Type Name</Label>
                  <Input id="type-name" placeholder="e.g., Food, Transport, Entertainment" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type-description">Description</Label>
                  <Input id="type-description" placeholder="Brief description of this expense type" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type-color">Color</Label>
                  <div className="flex items-center gap-2">
                    <Input id="type-color" type="color" className="w-16 h-10" defaultValue="#10b981" />
                    <Input placeholder="#10b981" className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type-icon">Icon</Label>
                  <Input id="type-icon" placeholder="Icon name (optional)" />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Expense Type
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{expenseTypes.length}</div>
              <p className="text-sm text-gray-600 mt-1">Active expense types</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Most Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">Tea</div>
              <p className="text-sm text-gray-600 mt-1">25 transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Highest Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">₹3,100</div>
              <p className="text-sm text-gray-600 mt-1">Tea category</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
