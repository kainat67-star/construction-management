export interface DailyExpense {
  id: string;
  description: string;
  propertyId: string | null;
  amount: number;
  paymentMethod: "Cash" | "Bank" | "Split";
  bankName?: string; // Required if paymentMethod is "Bank" or "Split"
  cashAmount?: number; // Amount paid in cash (for split payments)
  bankAmount?: number; // Amount paid via bank (for split payments)
  isPending?: boolean; // Whether payment is pending
}

export interface OpeningBalances {
  cash: number;
  banks: Record<string, number>; // Bank name -> balance
}

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD format
  openingBalances: OpeningBalances;
  expenses: DailyExpense[];
  closingBalances: OpeningBalances;
  totalDailyExpenses: number;
  bankUsage: Record<string, number>; // Bank name -> total amount used
  isLocked: boolean; // Locked after end of day consolidation
}

// This function is kept for backward compatibility
// Banks are now managed through the banks.ts module
export function getDefaultBanks(): string[] {
  // This will be called after banks are loaded
  try {
    const { getBankNames } = require("./banks");
    return getBankNames();
  } catch {
    return ["Bank A", "Bank B", "Bank C"];
  }
}

// Sample daily logs (in a real app, this would come from backend)
// Using a function to ensure we always get a reference to the same array
let dailyLogsData: DailyLog[] = [];

export function getDailyLogs(): DailyLog[] {
  return dailyLogsData;
}

export function setDailyLogs(logs: DailyLog[]): void {
  dailyLogsData = logs;
}

export function addDailyLog(log: DailyLog): void {
  dailyLogsData.push(log);
}

export function updateDailyLog(logId: string, updates: Partial<DailyLog>): void {
  const index = dailyLogsData.findIndex(log => log.id === logId);
  if (index !== -1) {
    dailyLogsData[index] = { ...dailyLogsData[index], ...updates };
  }
}

// Helper function to get or create today's log
export function getTodayLog(): DailyLog | null {
  const today = new Date().toISOString().split("T")[0];
  return dailyLogs.find(log => log.date === today) || null;
}

// Helper function to create a new daily log
export function createDailyLog(date: string, openingBalances: OpeningBalances): DailyLog {
  const log: DailyLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    date,
    openingBalances,
    expenses: [],
    closingBalances: { ...openingBalances },
    totalDailyExpenses: 0,
    bankUsage: {},
    isLocked: false,
  };
  return log;
}

// Helper function to consolidate end of day
export function consolidateEndOfDay(log: DailyLog): DailyLog {
  const totalExpenses = log.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const bankUsage: Record<string, number> = {};
  log.expenses.forEach(exp => {
    // Only count non-pending expenses
    if (exp.isPending) return;
    
    if (exp.paymentMethod === "Bank" && exp.bankName) {
      bankUsage[exp.bankName] = (bankUsage[exp.bankName] || 0) + exp.amount;
    } else if (exp.paymentMethod === "Split" && exp.bankName && exp.bankAmount) {
      bankUsage[exp.bankName] = (bankUsage[exp.bankName] || 0) + exp.bankAmount;
    }
  });

  const closingBalances: OpeningBalances = {
    cash: log.openingBalances.cash - log.expenses
      .filter(exp => !exp.isPending) // Only count non-pending expenses
      .reduce((sum, exp) => {
        if (exp.paymentMethod === "Cash") {
          return sum + exp.amount;
        } else if (exp.paymentMethod === "Split" && exp.cashAmount) {
          return sum + exp.cashAmount;
        }
        return sum;
      }, 0),
    banks: { ...log.openingBalances.banks },
  };

  // Deduct bank expenses
  Object.keys(bankUsage).forEach(bankName => {
    closingBalances.banks[bankName] = (closingBalances.banks[bankName] || 0) - bankUsage[bankName];
  });

  return {
    ...log,
    totalDailyExpenses: totalExpenses,
    bankUsage,
    closingBalances,
    isLocked: true,
  };
}
