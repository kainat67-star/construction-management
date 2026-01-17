import { TaxRecord } from "@/data/propertyDetails";
import { cn } from "@/lib/utils";

interface TaxesTableProps {
  taxes: TaxRecord[];
}

const taxTypeColors: Record<TaxRecord["taxType"], string> = {
  "Property Tax": "bg-chart-1/10 text-chart-1",
  "Land Tax": "bg-chart-2/10 text-chart-2",
  "School Tax": "bg-chart-3/10 text-chart-3",
  "Municipal Tax": "bg-chart-4/10 text-chart-4",
  "Special Assessment": "bg-chart-5/10 text-chart-5",
};

const statusColors: Record<TaxRecord["status"], string> = {
  Paid: "bg-success/10 text-success",
  Pending: "bg-warning/10 text-warning",
  Overdue: "bg-destructive/10 text-destructive",
};

export function TaxesTable({ taxes }: TaxesTableProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(value);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tax Type</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Period</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Amount</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Due Date</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {taxes.length > 0 ? (
            taxes.map((tax) => (
              <tr key={tax.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3">
                  <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", taxTypeColors[tax.taxType])}>
                    {tax.taxType}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{tax.period}</td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-card-foreground">
                  {formatCurrency(tax.amount)}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(tax.dueDate)}</td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", statusColors[tax.status])}>
                    {tax.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                No tax records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
