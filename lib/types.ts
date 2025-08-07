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

type ExpenseType = {
  ExpenseTypeId: number
  Type: string
  IsDeleted: number
  CreatedOn: string
}