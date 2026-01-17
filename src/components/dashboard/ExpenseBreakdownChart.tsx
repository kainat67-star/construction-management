import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCard } from "@/components/ui/chart-card";

const data = [
  { name: "Maintenance", value: 125000, color: "hsl(var(--chart-1))" },
  { name: "Utilities", value: 89000, color: "hsl(var(--chart-2))" },
  { name: "Taxes", value: 156000, color: "hsl(var(--chart-3))" },
  { name: "Insurance", value: 67000, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 43000, color: "hsl(var(--chart-5))" },
];

const total = data.reduce((sum, item) => sum + item.value, 0);

export function ExpenseBreakdownChart() {
  return (
    <ChartCard
      title="Expense Breakdown"
      description="Year-to-date expense distribution"
    >
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                padding: "12px",
              }}
              formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, "Amount"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm font-medium text-muted-foreground">{item.name}</span>
            <span className="ml-auto text-sm font-bold text-card-foreground">
              {Math.round((item.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
