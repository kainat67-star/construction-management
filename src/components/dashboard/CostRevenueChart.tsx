import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartCard } from "@/components/ui/chart-card";

const data = [
  { month: "Jan", costs: 45000, revenue: 62000 },
  { month: "Feb", costs: 52000, revenue: 58000 },
  { month: "Mar", costs: 48000, revenue: 71000 },
  { month: "Apr", costs: 61000, revenue: 68000 },
  { month: "May", costs: 55000, revenue: 82000 },
  { month: "Jun", costs: 67000, revenue: 95000 },
  { month: "Jul", costs: 72000, revenue: 88000 },
  { month: "Aug", costs: 58000, revenue: 91000 },
  { month: "Sep", costs: 49000, revenue: 76000 },
  { month: "Oct", costs: 63000, revenue: 84000 },
  { month: "Nov", costs: 54000, revenue: 79000 },
  { month: "Dec", costs: 71000, revenue: 102000 },
];

export function CostRevenueChart() {
  return (
    <ChartCard
      title="Monthly Costs vs Revenue"
      description="Financial performance over the past 12 months"
    >
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.3} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 13, fontWeight: 500 }}
              tickMargin={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 13, fontWeight: 500 }}
              tickFormatter={(value) => `Rs. ${value / 1000}k`}
              tickMargin={10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                padding: "12px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600, fontSize: 13, marginBottom: "8px" }}
              formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, ""]}
            />
            <Legend
              wrapperStyle={{ paddingTop: 24 }}
              iconType="circle"
              formatter={(value) => (
                <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 13, fontWeight: 500 }}>
                  {value === "costs" ? "Operational Costs" : "Revenue"}
                </span>
              )}
            />
            <Bar dataKey="costs" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
            <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
