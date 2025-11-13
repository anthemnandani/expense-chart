"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { CreditCard, Users, LayoutDashboard, LogOut, ChevronLeft, ChevronRight, Menu, X, ChevronRight as ArrowRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth-context"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading, signOut } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/" },
    {
      title: "Expenses",
      icon: CreditCard,
      children: [
        { title: "Dashboard", href: "/expenses/dashboard" },
        { title: "Expenses", href: "/expenses/expenses-list" },
        { title: "Expense Types", href: "/expenses/expense-types" },
      ],
    },
    {
      title: "Employees",
      icon: Users,
      children: [
        { title: "Dashboard", href: "/employees/dashboard" },
        { title: "Employee List", href: "/employees/employees-list" },
        { title: "Roles", href: "/employees/roles" },
        { title: "Departments", href: "/employees/departments" },
      ],
    },
  ]

  // Determine which menu should be open based on current path
  useEffect(() => {
    const matchedMenu = menuItems.find((menu) =>
      menu.children?.some((child) => child.href === pathname)
    )
    if (matchedMenu) setOpenMenu(matchedMenu.title)
  }, [pathname])

  // While auth is loading or user is being redirected, show a loading screen
  if (loading || (!user && !loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-10 h-10 border-4 border-blue-600 border-dashed rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white dark:bg-gray-800"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-16" : "w-64",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <img src="https://res.cloudinary.com/dmyq2ymj9/image/upload/v1753870586/anthem_infotech_pvt_ltd__logo-removebg-preview_qd1tk4.png" alt="" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">Dashboards</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* ✅ Navigation Updated */}
        <nav className="p-4 space-y-2">
          {menuItems.map((menu) => {
            const hasChildren = menu.children && menu.children.length > 0;

            return (
              <div key={menu.title}>
                {hasChildren ? (
                  <>
                    <Button
                      variant="ghost"
                      className={cn("w-full flex justify-between items-center px-3 py-2", sidebarCollapsed && "justify-center")}
                      onClick={() => setOpenMenu(openMenu === menu.title ? null : menu.title)}
                    >
                      <div className="flex items-center gap-3">
                        <menu.icon className="h-4 w-4" />
                        {!sidebarCollapsed && <span>{menu.title}</span>}
                      </div>

                      {!sidebarCollapsed && (
                        <ArrowRight className={cn("h-4 w-4 transition-transform", openMenu === menu.title && "rotate-90")} />
                      )}
                    </Button>

                    {!sidebarCollapsed && openMenu === menu.title && (
                      <div className="ml-8 mt-1 flex flex-col space-y-1">
                        {menu.children.map((item) => (
                          <Link key={item.href} href={item.href}>
                            <Button
                              variant={pathname === item.href ? "default" : "ghost"}
                              className={cn(
                                "w-full justify-start text-sm",
                                pathname === item.href && "bg-blue-600 text-white hover:bg-blue-700"
                              )}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item.title}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  // ✅ Direct Link Menu (Dashboard)
                  <Link href={menu.href}>
                    <Button
                      variant={pathname === menu.href ? "default" : "ghost"}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 justify-start",
                        sidebarCollapsed && "justify-center px-2",
                        pathname === menu.href && "bg-blue-600 text-white hover:bg-blue-700"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <menu.icon className="h-4 w-4" />
                      {!sidebarCollapsed && <span>{menu.title}</span>}
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20", sidebarCollapsed && "justify-center px-2")}
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" />
            {!sidebarCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className={cn("transition-all duration-300 ease-in-out", sidebarCollapsed ? "lg:ml-16" : "lg:ml-64")}>
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-end gap-4">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem asChild>
                  <Link href="/myProfile">My Profile</Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={signOut}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
