import { Receipt, Building2, FileText, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ActivityType = "bill" | "tax" | "property";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  property: string;
  amount: string;
  date: string;
  status: "paid" | "pending" | "overdue" | "updated";
}

const activities: Activity[] = [
  {
    id: "1",
    type: "bill",
    title: "Electricity Bill",
    property: "Downtown Office Complex",
    amount: "$2,450",
    date: "Jan 12, 2026",
    status: "paid",
  },
  {
    id: "2",
    type: "tax",
    title: "Property Tax Q1",
    property: "Riverside Apartments",
    amount: "$12,800",
    date: "Jan 10, 2026",
    status: "pending",
  },
  {
    id: "3",
    type: "property",
    title: "Maintenance Update",
    property: "Industrial Park A",
    amount: "-",
    date: "Jan 9, 2026",
    status: "updated",
  },
  {
    id: "4",
    type: "bill",
    title: "Water & Sewage",
    property: "Commercial Plaza",
    amount: "$890",
    date: "Jan 8, 2026",
    status: "overdue",
  },
  {
    id: "5",
    type: "tax",
    title: "Insurance Premium",
    property: "Downtown Office Complex",
    amount: "$5,200",
    date: "Jan 5, 2026",
    status: "paid",
  },
];

const typeIcons = {
  bill: Receipt,
  tax: FileText,
  property: Building2,
};

const statusStyles = {
  paid: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  overdue: "bg-destructive/10 text-destructive",
  updated: "bg-primary/10 text-primary",
};

export function RecentActivityTable() {
  return (
    <div className="rounded-2xl border bg-card shadow-card overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border px-4 sm:px-6 py-4 sm:py-5 gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-card-foreground">Recent Activity</h3>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Latest bills, taxes, and property updates</p>
        </div>
        <button className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors self-start sm:self-auto">
          View all
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      <div className="divide-y divide-border">
        {activities.map((activity, index) => {
          const Icon = typeIcons[activity.type];
          return (
            <div
              key={activity.id}
              className={cn(
                "flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 transition-colors",
                index % 2 === 0 ? "bg-card" : "bg-muted/30",
                "hover:bg-muted/50"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-muted">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <p className="font-semibold text-card-foreground truncate">{activity.title}</p>
                <p className="text-sm text-muted-foreground truncate mt-0.5">{activity.property}</p>
              </div>

              <div className="flex items-center justify-between sm:block sm:text-right w-full sm:w-auto gap-3">
                <div>
                  <p className="font-bold text-card-foreground">{activity.amount}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{activity.date}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize shrink-0",
                    statusStyles[activity.status]
                  )}
                >
                  {activity.status}
                </span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
