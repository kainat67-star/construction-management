import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tax } from "@/data/billsTaxesData";
import { cn } from "@/lib/utils";

interface TaxManagementTableProps {
  data: Tax[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const taxTypeColors: Record<string, string> = {
  "Property Tax": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "Municipal Tax": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  "Special Assessment": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  "School Tax": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

const statusStyles: Record<string, string> = {
  Paid: "bg-success/10 text-success border-success/20",
  Due: "bg-warning/10 text-warning border-warning/20",
  Pending: "bg-muted text-muted-foreground border-border",
};

export function TaxManagementTable({ data }: TaxManagementTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-semibold text-card-foreground">Tax Records</h3>
        <p className="text-sm text-muted-foreground">Property tax payments and obligations</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold text-foreground">Property</TableHead>
              <TableHead className="font-semibold text-foreground">Tax Type</TableHead>
              <TableHead className="font-semibold text-foreground">Period</TableHead>
              <TableHead className="text-right font-semibold text-foreground">Amount</TableHead>
              <TableHead className="font-semibold text-foreground">Status</TableHead>
              <TableHead className="font-semibold text-foreground">Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No tax records found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((tax) => (
                <TableRow key={tax.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-medium text-foreground">{tax.propertyName}</TableCell>
                  <TableCell>
                    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", taxTypeColors[tax.taxType])}>
                      {tax.taxType}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{tax.period}</TableCell>
                  <TableCell className="text-right font-semibold text-foreground">{formatCurrency(tax.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("font-medium", statusStyles[tax.status])}>
                      {tax.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(tax.dueDate)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
