import { Expense } from "@/data/propertyDetails";
import { cn } from "@/lib/utils";

interface ExpenseTableProps {
  expenses: Expense[];
}

const categoryColors: Record<Expense["category"], string> = {
  Maintenance: "bg-chart-1/10 text-chart-1",
  Utilities: "bg-chart-2/10 text-chart-2",
  Insurance: "bg-chart-3/10 text-chart-3",
  Repairs: "bg-chart-4/10 text-chart-4",
  Management: "bg-chart-5/10 text-chart-5",
  Security: "bg-primary/10 text-primary",
  Cleaning: "bg-chart-6/10 text-chart-6",
  Landscaping: "bg-success/10 text-success",
};

const frequencyColors: Record<Expense["frequency"], string> = {
  "One-time": "bg-muted text-muted-foreground",
  Monthly: "bg-primary/10 text-primary",
  Quarterly: "bg-chart-2/10 text-chart-2",
  Annually: "bg-chart-3/10 text-chart-3",
};

export function ExpenseTable({ expenses }: ExpenseTableProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(value);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="rounded-xl border bg-card shadow-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-card-foreground">Expense History</h3>
        <p className="text-sm text-muted-foreground">Detailed breakdown of all property expenses</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Description</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Frequency</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(expense.date)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", categoryColors[expense.category])}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-card-foreground">{expense.description}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-card-foreground">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", frequencyColors[expense.frequency])}>
                      {expense.frequency}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No expenses recorded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
