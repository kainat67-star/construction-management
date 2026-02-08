import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface DashboardKPICardProps {
  title: string;
  value: string;
  description: string;
  trendData: number[];
  color: string;
}

export function DashboardKPICard({ title, value, description, trendData, color }: DashboardKPICardProps) {
  const chartData = trendData.map((val, index) => ({ value: val }));

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-card">
      <div className="mb-3 sm:mb-4">
        <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <p className="text-xl sm:text-2xl font-bold text-foreground">{value}</p>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
      </div>
      
      {/* Mini Line Graph */}
      <div className="h-10 sm:h-12 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Colored Dot */}
      <div className="flex items-center gap-2 mt-2">
        <div className={cn("h-2 w-2 rounded-full")} style={{ backgroundColor: color }} />
        <span className="text-[10px] sm:text-xs text-muted-foreground">Trend</span>
      </div>
    </div>
  );
}
