import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { DailyLog } from "@/data/dailyLogs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Printer, Wallet, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationState {
  log?: DailyLog;
}

const AccountsReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const log = state?.log;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const { cashExpenses, bankUsage, totalExpenses } = useMemo(() => {
    if (!log) {
      return { cashExpenses: 0, bankUsage: {}, totalExpenses: 0 };
    }

    const total = log.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const cash = log.expenses
      .filter((exp) => exp.paymentMethod === "Cash")
      .reduce((sum, exp) => sum + exp.amount, 0);

    const bankUsageAcc: Record<string, number> = {};
    log.expenses.forEach((exp) => {
      if (exp.paymentMethod === "Bank" && exp.bankName) {
        bankUsageAcc[exp.bankName] = (bankUsageAcc[exp.bankName] || 0) + exp.amount;
      }
    });

    return { cashExpenses: cash, bankUsage: bankUsageAcc, totalExpenses: total };
  }, [log]);

  if (!log) {
    // If user opened this page directly without state, send them back to accounts
    navigate("/accounts", { replace: true });
    return null;
  }

  return (
    <AppLayout title="Daily Accounts Report">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/50">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-1">
              Daily Accounts Report
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              {formatDate(log.date)}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={() => navigate("/accounts")}>
              <ArrowLeft className="h-4 w-4" />
              Back to Accounts
            </Button>
            <Button
              variant="outline"
              className="gap-2 print:hidden"
              onClick={() => window.print()}
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        {/* Summary & Balances */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 lg:col-span-1">
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                Total Expenses
              </p>
              <p className="text-3xl font-bold text-destructive tracking-tight">
                {formatCurrency(totalExpenses)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Across all properties and payment methods
              </p>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                Cash Expenses
              </p>
              <p className="text-2xl font-bold text-foreground tracking-tight">
                {formatCurrency(cashExpenses)}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Opening Balances</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="group relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Cash
                      </p>
                      <p className="text-2xl font-bold text-foreground tracking-tight">
                        {formatCurrency(log.openingBalances.cash)}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Wallet className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {Object.entries(log.openingBalances.banks).map(([bankName, amount], index) => (
                  <div
                    key={bankName}
                    className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          {bankName}
                        </p>
                        <p className="text-2xl font-bold text-foreground tracking-tight">
                          {formatCurrency(amount)}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ml-2",
                          index % 3 === 0 && "bg-blue-500/15 text-blue-600 dark:text-blue-400",
                          index % 3 === 1 && "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
                          index % 3 === 2 && "bg-purple-500/15 text-purple-600 dark:text-purple-400"
                        )}
                      >
                        <Landmark className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Closing Balances</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="group relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Cash
                      </p>
                      <p className="text-2xl font-bold text-foreground tracking-tight">
                        {formatCurrency(log.closingBalances.cash)}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Wallet className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {Object.entries(log.closingBalances.banks).map(([bankName, amount], index) => (
                  <div
                    key={bankName}
                    className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          {bankName}
                        </p>
                        <p className="text-2xl font-bold text-foreground tracking-tight">
                          {formatCurrency(amount)}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ml-2",
                          index % 3 === 0 && "bg-blue-500/15 text-blue-600 dark:text-blue-400",
                          index % 3 === 1 && "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
                          index % 3 === 2 && "bg-purple-500/15 text-purple-600 dark:text-purple-400"
                        )}
                      >
                        <Landmark className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Expense Details</h2>
          {log.expenses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No expenses recorded for this day.</p>
          ) : (
            <div className="border border-border/50 rounded-xl overflow-hidden bg-background">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 border-b border-border/50">
                    <TableHead className="text-xs font-semibold w-12 text-center">#</TableHead>
                    <TableHead className="text-xs font-semibold">Description</TableHead>
                    <TableHead className="text-xs font-semibold">Property</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Amount</TableHead>
                    <TableHead className="text-xs font-semibold">Payment Method</TableHead>
                    <TableHead className="text-xs font-semibold">Bank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {log.expenses.map((expense, index) => (
                    <TableRow key={expense.id} className="border-b border-border/50">
                      <TableCell className="text-xs text-center text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-foreground">
                        {expense.description}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {expense.propertyId || "-"}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-right text-foreground">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {expense.paymentMethod}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {expense.bankName || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default AccountsReport;

