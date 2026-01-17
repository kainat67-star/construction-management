import { cn } from "@/lib/utils";
import { DollarSign, Receipt, FileText, Calculator, TrendingUp, TrendingDown } from "lucide-react";

interface ProfitSummaryProps {
  purchasePrice: number;
  totalOperationalExpenses: number;
  totalBills: number;
  totalTaxes: number;
  netProfitLoss: number;
  monthlyRevenue: number;
}

export function ProfitSummary({
  purchasePrice,
  totalOperationalExpenses,
  totalBills,
  totalTaxes,
  netProfitLoss,
  monthlyRevenue,
}: ProfitSummaryProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(value);

  const annualRevenue = monthlyRevenue * 12;
  const totalExpenses = totalOperationalExpenses + totalBills + totalTaxes;

  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <h3 className="font-semibold text-card-foreground mb-1">Profit Calculation</h3>
      <p className="text-sm text-muted-foreground mb-4">Read-only financial breakdown</p>

      <div className="space-y-3">
        {/* Revenue */}
        <div className="flex items-center justify-between py-2 border-b border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4 text-success" />
            <span>Annual Revenue</span>
          </div>
          <span className="font-semibold text-success">+{formatCurrency(annualRevenue)}</span>
        </div>

        {/* Purchase Cost */}
        <div className="flex items-center justify-between py-2 border-b border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Purchase Cost</span>
          </div>
          <span className="font-medium text-card-foreground">{formatCurrency(purchasePrice)}</span>
        </div>

        {/* Operational Expenses */}
        <div className="flex items-center justify-between py-2 border-b border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Receipt className="h-4 w-4" />
            <span>Total Operational Expenses</span>
          </div>
          <span className="font-medium text-destructive">-{formatCurrency(totalOperationalExpenses)}</span>
        </div>

        {/* Bills */}
        <div className="flex items-center justify-between py-2 border-b border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>Total Bills</span>
          </div>
          <span className="font-medium text-destructive">-{formatCurrency(totalBills)}</span>
        </div>

        {/* Taxes */}
        <div className="flex items-center justify-between py-2 border-b border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calculator className="h-4 w-4" />
            <span>Total Taxes</span>
          </div>
          <span className="font-medium text-destructive">-{formatCurrency(totalTaxes)}</span>
        </div>

        {/* Net Result */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t-2 border-border">
          <div className="flex items-center gap-2">
            {netProfitLoss >= 0 ? (
              <TrendingUp className="h-5 w-5 text-success" />
            ) : (
              <TrendingDown className="h-5 w-5 text-destructive" />
            )}
            <span className="font-semibold text-card-foreground">Net Profit / Loss</span>
          </div>
          <span
            className={cn(
              "text-xl font-bold",
              netProfitLoss >= 0 ? "text-success" : "text-destructive"
            )}
          >
            {netProfitLoss >= 0 ? "+" : ""}
            {formatCurrency(netProfitLoss)}
          </span>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-muted/50">
        <p className="text-xs text-muted-foreground text-center">
          * This is a simplified calculation. Actual profit may vary based on depreciation, capital improvements, and other factors.
        </p>
      </div>
    </div>
  );
}
