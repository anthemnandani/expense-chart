import { CategoryData, ExpenseData, ExpenseEntry, ExpenseRecord, FinancialInsight } from "./types";

// Define types for API responses if needed
interface TreeNode {
  id: string;
  parent?: string;
  name: string;
  color?: string;
}

interface HeatmapData {
  categories: string[];
  data: [number, number, number][];
}

export const apiService = {
  // Fetch daily expenses for DailyExpenseChart
  async getDailyExpenses(
    groupId: string,
    year: number,
    month: number
  ): Promise<ExpenseRecord[]> {
    try {
      const res = await fetch(
        `/api/monthly-credit-debit?groupId=${groupId}&year=${year}&month=${month}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Failed to fetch daily expenses");
      return await res.json();
    } catch (error) {
      console.error("Error fetching daily expenses:", error);
      return [];
    }
  },

  // Fetch category-wise expenses for HighLevelPieChart and GaugeMultipleKPIChart
  async getExpenseByMonth(
    groupId: string,
    year: number,
    month: number
  ): Promise<CategoryData[]> {
    try {
      const res = await fetch(
        `/api/expense-monthswise?groupId=${groupId}&year=${year}&months=${month}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Failed to fetch expense by month");
      return await res.json();
    } catch (error) {
      console.error("Error fetching expense by month:", error);
      return [];
    }
  },

  // Fetch yearly expense data for AreaYearlyExpenseChart and MonthlyRadarChart
  async getYearlyExpense(groupId: string, year: number): Promise<ExpenseData[]> {
    try {
      const res = await fetch(
        `/api/yearly-expense?groupId=${groupId}&year=${year}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Failed to fetch yearly expense data");
      return await res.json();
    } catch (error) {
      console.error("Error fetching yearly expense data:", error);
      return [];
    }
  },

  // Fetch category-wise expenses for CategoryWiseExpenseChart
  async getCategoryExpenses(
    groupId: string,
    year: number
  ): Promise<ExpenseEntry[]> {
    try {
      const res = await fetch(
        `/api/category-expenses?groupId=${groupId}&year=${year}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Failed to fetch category expenses");
      return await res.json();
    } catch (error) {
      console.error("Error fetching category expenses:", error);
      return [];
    }
  },

  // Fetch heatmap data for AnnualCategoryTrendsChart
  async getAnnualCategoryTrends(
    groupId: string,
    year: number
  ): Promise<HeatmapData> {
    try {
      const res = await fetch(
        `/api/annual-category-trends?groupId=${groupId}&year=${year}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Failed to fetch annual category trends");
      return await res.json();
    } catch (error) {
      console.error("Error fetching annual category trends:", error);
      return { categories: [], data: [] };
    }
  },

  // Fetch tree graph data for ExpenseTreeChart
  async getTreeGraphData(groupId: string): Promise<TreeNode[]> {
    try {
      const res = await fetch(`/api/treegraph?groupId=${groupId}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch tree graph data");
      return await res.json();
    } catch (error) {
      console.error("Error fetching tree graph data:", error);
      return [];
    }
  },

  // Fetch net balance data for NetBalanceChart
  async getNetBalance(groupId: string, year: number): Promise<[number, number][]> {
    try {
      const res = await fetch(
        `/api/net-balance?groupId=${groupId}&year=${year}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Failed to fetch net balance data");
      return await res.json();
    } catch (error) {
      console.error("Error fetching net balance data:", error);
      return [];
    }
  },

  // Fetch stats for UniqueStatCards
  async getYearlyStats(groupId: string, year: number) {
    try {
      const res = await fetch(
        `/api/yearly-expense?groupId=${groupId}&year=${year}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Failed to fetch yearly stats");
      return await res.json();
    } catch (error) {
      console.error("Error fetching yearly stats:", error);
      return [];
    }
  },

  // Fetch financial insights data
  async getFinancialInsights(
    groupId: string,
    year: number,
    month: number
  ): Promise<FinancialInsight> {
    try {
      const res = await fetch(
        `/api/financial-insights?groupId=${groupId}&year=${year}&month=${month}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Failed to fetch financial insights");
      return await res.json();
    } catch (error) {
      console.error("Error fetching financial insights:", error);
      return {
        bestPerformingMonth: { month: "N/A", savingsRate: 0, amountSaved: 0 },
        lowestIncomeMonth: { month: "N/A", income: 0 },
        topSpendingCategory: { category: "N/A", percentage: 0 },
        thisMonthTrend: { trend: "N/A", percentageChange: 0 },
        avgTransactionSize: { amount: 0, transactionCount: 0 },
        incomeVsExpense: { ratio: "N/A", percentageHigher: 0 },
      };
    }
  },
};