import { Bill } from "@/data/propertyDetails";
import { cn } from "@/lib/utils";

interface BillsTableProps {
  bills: Bill[];
}

const typeColors: Record<Bill["type"], string> = {
  Electric: "bg-chart-4/10 text-chart-4",
  Water: "bg-chart-1/10 text-chart-1",
  Gas: "bg-chart-2/10 text-chart-2",
  Internet: "bg-chart-5/10 text-chart-5",
  Waste: "bg-muted text-muted-foreground",
  Maintenance: "bg-chart-3/10 text-chart-3",
  Insurance: "bg-primary/10 text-primary",
};

const statusColors: Record<Bill["status"], string> = {
  Paid: "bg-success/10 text-success",
  Pending: "bg-warning/10 text-warning",
  Overdue: "bg-destructive/10 text-destructive",
};

export function BillsTable({ bills }: BillsTableProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(value);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Vendor</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Period</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Amount</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Due Date</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {bills.length > 0 ? (
            bills.map((bill) => (
              <tr key={bill.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3">
                  <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", typeColors[bill.type])}>
                    {bill.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-card-foreground">{bill.vendor}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{bill.period}</td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-card-foreground">
                  {formatCurrency(bill.amount)}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(bill.dueDate)}</td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", statusColors[bill.status])}>
                    {bill.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                No bills recorded
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
