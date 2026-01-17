import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    trend: "up" | "down";
  };
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "accent";
}

export function KPICard({ title, value, change, icon: Icon, variant = "default" }: KPICardProps) {
  const variantStyles = {
    default: "bg-card",
    success: "bg-card border-success/20",
    warning: "bg-card border-destructive/20",
    accent: "bg-card border-accent/20",
  };

  const iconStyles = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-destructive/10 text-destructive",
    accent: "bg-accent/10 text-accent",
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-4 sm:p-5 xl:p-4 shadow-card transition-all duration-300 hover:shadow-card-hover min-w-0",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="space-y-2 sm:space-y-2.5 flex-1 min-w-0 pr-1">
          <p className="text-[11px] sm:text-xs xl:text-[11px] 2xl:text-sm font-semibold text-muted-foreground uppercase tracking-wide leading-tight line-clamp-2 break-words">{title}</p>
          <p className="text-xl sm:text-2xl xl:text-xl 2xl:text-3xl font-bold tracking-tight text-card-foreground leading-tight break-words">{value}</p>
          {change && (
            <div
              className={cn(
                "flex items-center gap-1 text-[10px] sm:text-xs xl:text-[10px] 2xl:text-sm font-semibold",
                change.trend === "up" ? "text-success" : "text-destructive"
              )}
            >
              {change.trend === "up" ? (
                <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 xl:h-3 xl:w-3 2xl:h-4 2xl:w-4 shrink-0" />
              ) : (
                <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 xl:h-3 xl:w-3 2xl:h-4 2xl:w-4 shrink-0" />
              )}
              <span className="whitespace-nowrap">{change.value}</span>
              <span className="text-muted-foreground font-normal text-[9px] sm:text-[10px] xl:text-[9px] 2xl:text-xs hidden lg:inline ml-0.5">vs last</span>
            </div>
          )}
        </div>
        <div className={cn("flex h-9 w-9 sm:h-11 sm:w-11 xl:h-9 xl:w-9 2xl:h-14 2xl:w-14 items-center justify-center rounded-lg xl:rounded-lg 2xl:rounded-2xl shrink-0", iconStyles[variant])}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 xl:h-4 xl:w-4 2xl:h-7 2xl:w-7" />
        </div>
      </div>

      {/* Decorative gradient */}
      <div
        className={cn(
          "absolute -bottom-8 -right-8 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40",
          variant === "success" && "bg-success",
          variant === "warning" && "bg-destructive",
          variant === "accent" && "bg-accent",
          variant === "default" && "bg-primary"
        )}
      />
    </div>
  );
}
