import { DollarSign, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaxSummaryData {
  totalPaidYTD: number;
  pendingTaxes: number;
  upcomingDeadlines: number;
  overdueCount: number;
}

interface TaxSummaryCardsProps {
  data: TaxSummaryData;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function TaxSummaryCards({ data }: TaxSummaryCardsProps) {
  const cards = [
    {
      title: "Total Tax Paid (YTD)",
      value: formatCurrency(data.totalPaidYTD),
      icon: CheckCircle,
      iconBg: "bg-success/10",
      iconColor: "text-success",
      valueColor: "text-success",
    },
    {
      title: "Pending Taxes",
      value: formatCurrency(data.pendingTaxes),
      icon: Clock,
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
      valueColor: "text-warning",
    },
    {
      title: "Upcoming Deadlines",
      value: data.upcomingDeadlines.toString(),
      subtitle: "tax payments due",
      icon: AlertTriangle,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      valueColor: "text-primary",
    },
    {
      title: "Overdue Bills",
      value: data.overdueCount.toString(),
      subtitle: "require attention",
      icon: AlertTriangle,
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
      valueColor: data.overdueCount > 0 ? "text-destructive" : "text-success",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
              <p className={cn("text-2xl font-bold", card.valueColor)}>{card.value}</p>
              {card.subtitle && (
                <p className="text-xs text-muted-foreground">{card.subtitle}</p>
              )}
            </div>
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", card.iconBg)}>
              <card.icon className={cn("h-5 w-5", card.iconColor)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
