import { TrendingUp, TrendingDown, DollarSign, Building2, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryData {
  mostProfitableProperty: {
    name: string;
    netProfitLoss: number;
  };
  highestCostProperty: {
    name: string;
    monthlyOperatingCost: number;
    annualTax: number;
  };
  averageMonthlyExpense: number;
}

interface FinancialSummaryCardsProps {
  data: SummaryData;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function FinancialSummaryCards({ data }: FinancialSummaryCardsProps) {
  const totalHighestCost = data.highestCostProperty.monthlyOperatingCost * 12 + data.highestCostProperty.annualTax;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Most Profitable Property */}
      <div className="relative overflow-hidden rounded-xl border bg-card p-5 shadow-card">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-muted-foreground">Most Profitable</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-card-foreground">{data.mostProfitableProperty.name}</p>
              <p className={cn(
                "text-2xl font-bold",
                data.mostProfitableProperty.netProfitLoss >= 0 ? "text-success" : "text-destructive"
              )}>
                {formatCurrency(data.mostProfitableProperty.netProfitLoss)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Annual Net Profit</p>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
            <Building2 className="h-6 w-6 text-success" />
          </div>
        </div>
      </div>

      {/* Highest Operational Cost */}
      <div className="relative overflow-hidden rounded-xl border bg-card p-5 shadow-card">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium text-muted-foreground">Highest Cost</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-card-foreground">{data.highestCostProperty.name}</p>
              <p className="text-2xl font-bold text-warning">
                {formatCurrency(totalHighestCost)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Annual Total Costs</p>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
            <DollarSign className="h-6 w-6 text-warning" />
          </div>
        </div>
      </div>

      {/* Average Monthly Expense */}
      <div className="relative overflow-hidden rounded-xl border bg-card p-5 shadow-card">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Average Monthly Expense</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-card-foreground">All Properties</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(data.averageMonthlyExpense)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Per Property Average</p>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Calculator className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
