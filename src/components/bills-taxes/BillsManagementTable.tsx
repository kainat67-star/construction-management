import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bill } from "@/data/billsTaxesData";
import { cn } from "@/lib/utils";
import { Zap, Droplets, Wrench, Shield, Flame, Wifi } from "lucide-react";

interface BillsManagementTableProps {
  data: Bill[];
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

const categoryIcons: Record<string, React.ElementType> = {
  Electricity: Zap,
  Water: Droplets,
  Maintenance: Wrench,
  Insurance: Shield,
  Gas: Flame,
  Internet: Wifi,
};

const categoryColors: Record<string, string> = {
  Electricity: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Water: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Maintenance: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  Insurance: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  Gas: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Internet: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
};

const statusStyles: Record<string, string> = {
  Paid: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Overdue: "bg-destructive/10 text-destructive border-destructive/20",
};

export function BillsManagementTable({ data }: BillsManagementTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-semibold text-card-foreground">Bills Overview</h3>
        <p className="text-sm text-muted-foreground">Track and manage all property bills</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold text-foreground">Property</TableHead>
              <TableHead className="font-semibold text-foreground">Category</TableHead>
              <TableHead className="font-semibold text-foreground">Billing Cycle</TableHead>
              <TableHead className="text-right font-semibold text-foreground">Amount</TableHead>
              <TableHead className="font-semibold text-foreground">Status</TableHead>
              <TableHead className="font-semibold text-foreground">Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No bills found matching the filters.
                </TableCell>
              </TableRow>
            ) : (
              data.map((bill) => {
                const CategoryIcon = categoryIcons[bill.category] || Zap;
                return (
                  <TableRow key={bill.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium text-foreground">{bill.propertyName}</TableCell>
                    <TableCell>
                      <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", categoryColors[bill.category])}>
                        <CategoryIcon className="h-3 w-3" />
                        {bill.category}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{bill.billingCycle}</TableCell>
                    <TableCell className="text-right font-semibold text-foreground">{formatCurrency(bill.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("font-medium", statusStyles[bill.status])}>
                        {bill.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(bill.dueDate)}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
