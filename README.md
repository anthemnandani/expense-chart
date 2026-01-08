Anthem Dashboards
Anthem Dashboards is a centralized internal dashboard system built for Anthem Infotech Pvt. Ltd. to manage and visualize Expense-related analytics and Employee management data through multiple interactive dashboards.
🔗 Live URL: https://dashboards.workanthem.com
🚀 Features Overview
The application contains multiple dashboards, mainly divided into:
💰 Expense Dashboards

Live expense tracking & analytics
Credit vs Debit analysis
Net balance overview
Category-wise and date-wise expense reports
Yearly, monthly, and daily insights
Expense types and detailed expense listings
Financial insights & visual charts

👥 Employee Dashboards

Employee listing and management
Department management
Role management
Employee-level dashboards
Organization-related configurations

🧑‍💻 Tech Stack
Frontend

Next.js (App Router)
TypeScript
Tailwind CSS
Charting & data visualization libraries
Server Components + API Routes (Next.js)

Backend

Expense APIs: Built inside Next.js API routes
Employee APIs: Built using Node.js + Express
Repository:
👉 https://github.com/Anthem-InfoTech-Pvt-Ltd/managementapinodejs


Database

Microsoft SQL Server (SSMS)
Both Expense and Employee systems use SSMS
Databases are separate, but hosted on the same SQL Server

🗂️ Project Structure
textapp
├── (auth)
│   └── signin
│
├── (dashboard)
│   ├── employees
│   │   ├── dashboard
│   │   ├── departments
│   │   ├── employees-list
│   │   └── roles
│   │
│   ├── expenses
│   │   ├── dashboard
│   │   ├── detailed-map
│   │   ├── expense-types
│   │   └── expenses-list
│   │
│   └── settings
│
└── api
    ├── auth
    │   ├── google
    │   │   └── callback
    │   ├── signin
    │   └── logout
    │
    ├── expenses
    │   ├── add
    │   └── send-report
    │
    ├── stats
    ├── net-balance
    ├── currency
    ├── available-years
    ├── daily-expenses
    ├── monthly-credit-debit
    ├── yearly-credit-debit
    ├── yearly-expense
    ├── yearly-expense-daywise
    ├── yearly-category-expenses
    ├── category-expenses
    ├── expense-types
    ├── treegraph
    ├── financial-insights
    └── user
🔐 Authentication

Cookie-based authentication
JWT (access_token) stored securely
Google OAuth integration
Server-side auth handling for faster dashboard loading

⚡ Performance Optimizations

Server-side rendering for dashboards
Cookie-based user validation (avoids unnecessary API calls)
Optimized API queries for analytics
Global year selection across expense dashboards
Reduced loading states for faster UX

📈 Key Dashboards & APIs

Expense Dashboard: Real-time financial data
Employee Dashboard: Organization & role management
Credit/Debit Charts
Category Trends
Net Balance Overview
Tree Graph & Financial Insights

🛠️ Setup Instructions (Local)
text# Install dependencies
npm install

# Run development server
npm run dev
Make sure:

SQL Server is running
Environment variables for DB & auth are properly set
Employee API service is running separately (Node.js repo)

📌 Notes

Expense and Employee modules are logically separated
Both systems use SSMS but different databases
Designed for internal enterprise usage
Scalable for adding more dashboards in future

👨‍💼 Maintained By
Anthem Infotech Pvt. Ltd.