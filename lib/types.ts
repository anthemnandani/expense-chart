export interface Users {
  userId: number;
  userName: string;
  password: string;
  emailId: string;
  userTypeId: number;
  lastLogin: string;
  isDeleted: boolean;
  createdOn: string;
  expenseReportEmail: string;
  currency: string;
  fullName: string;
  isVerified: boolean;
  verificationToken: string | null;
  contactNumber: string | null;
  profileImage: string | null;
  groupId: number | null;
  ccEmailAddress: string | null;
  chkDashboard: boolean | null;
  chkDocuments: boolean | null;
  chkExpense: boolean | null;
  chkNotes: boolean | null;
  chkQuantityTracker: boolean | null;
  chkMarketing: boolean | null;
  chkLocations: boolean | null;
}

export interface Expense {
  ExpenseId: number;
  Expenses: number;
  Description: string;
  ExpenseTypeId: number;
  Date: string;
  Balance: number;
  IsDeleted: boolean;
  CreatedOn: string;
  UserId: number;
  ExpenseDescType?: string | null;
  GroupId?: number | null;
}

export interface ExpenseType {
  ExpenseTypeId: number
  Type: string
  IsDeleted: number
  CreatedOn: string
}

export interface ExpenseRecord {
    date: string
    credit: number
    debit: number
}

export interface ExpenseCategory {
    expenseDescType: string
    totalExpenses: number
}

export interface ExpenseEntry {
    month: string;
    expenseDescType: string;
    totalExpenses: number;
};

export interface CategoryData {
  expenseDescType: string;
  totalExpenses: number;
};

export interface ExpenseData {
  month: string
  totalDebit: number
  totalCredit: number
}

export interface TreeNode {
    id: string
    parent?: string
    name: string
    color?: string
}
