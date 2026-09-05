import type {
  Profile,
  Child,
  SettlementAgreement,
  Expense,
  ReceiptLineItem,
  CourtBundle,
  ExpenseCategory,
  ExpenseStatus,
} from "@/types/database.types";

export type {
  Profile,
  Child,
  SettlementAgreement,
  Expense,
  ReceiptLineItem,
  CourtBundle,
  ExpenseCategory,
  ExpenseStatus,
};

export interface IDataRepository {
  getProfile(): Promise<Profile>;
  updateProfile(data: Partial<Profile>): Promise<Profile>;
  getChildren(): Promise<Child[]>;
  addChild(child: Omit<Child, "id" | "created_at">): Promise<Child>;
  deleteChild(id: string): Promise<boolean>;
  getAgreement(): Promise<SettlementAgreement>;
  saveAgreement(agreement: Partial<SettlementAgreement>): Promise<SettlementAgreement>;
  getExpenses(childId?: string, category?: string): Promise<Expense[]>;
  createExpense(
    expense: Omit<Expense, "id" | "created_at" | "updated_at">,
    lineItems?: Omit<ReceiptLineItem, "id" | "expense_id" | "created_at">[]
  ): Promise<Expense>;
  updateExpenseStatus(id: string, status: Expense["status"]): Promise<Expense>;
  deleteExpense(id: string): Promise<boolean>;
  getLineItems(expenseId: string): Promise<ReceiptLineItem[]>;
  getCourtBundle(period: string, preset: string): Promise<CourtBundle>;
  isDemoMode(): boolean;
  setDemoMode(enabled: boolean): Promise<void>;
  resetToSeedData(): Promise<void>;
  clearToCleanSlate(): Promise<void>;
}
