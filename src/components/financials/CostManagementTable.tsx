import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PropertyFinancialData } from "@/data/financialData";

interface CostManagementTableProps {
  data: PropertyFinancialData[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function CostManagementTable({ data }: CostManagementTableProps) {
  const totals = data.reduce(
    (acc, row) => ({
      totalBills: acc.totalBills + row.totalBills,
      maintenanceCosts: acc.maintenanceCosts + row.maintenanceCosts,
      taxCosts: acc.taxCosts + row.taxCosts,
      otherExpenses: acc.otherExpenses + row.otherExpenses,
      totalCost: acc.totalCost + row.totalCost,
    }),
    { totalBills: 0, maintenanceCosts: 0, taxCosts: 0, otherExpenses: 0, totalCost: 0 }
  );

  return (
    <div className="rounded-xl border bg-card shadow-card">
      <div className="border-b border-border p-4">
        <h3 className="text-lg font-semibold text-card-foreground">Cost Management</h3>
        <p className="text-sm text-muted-foreground">Breakdown of costs by property</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Property</TableHead>
              <TableHead className="text-right font-semibold">Total Bills</TableHead>
              <TableHead className="text-right font-semibold">Maintenance</TableHead>
              <TableHead className="text-right font-semibold">Tax Costs</TableHead>
              <TableHead className="text-right font-semibold">Other Expenses</TableHead>
              <TableHead className="text-right font-semibold">Total Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.totalBills)}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.maintenanceCosts)}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.taxCosts)}</TableCell>
                <TableCell className="text-right">{formatCurrency(row.otherExpenses)}</TableCell>
                <TableCell className="text-right font-semibold">{formatCurrency(row.totalCost)}</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50 font-semibold hover:bg-muted/50">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">{formatCurrency(totals.totalBills)}</TableCell>
              <TableCell className="text-right">{formatCurrency(totals.maintenanceCosts)}</TableCell>
              <TableCell className="text-right">{formatCurrency(totals.taxCosts)}</TableCell>
              <TableCell className="text-right">{formatCurrency(totals.otherExpenses)}</TableCell>
              <TableCell className="text-right">{formatCurrency(totals.totalCost)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
