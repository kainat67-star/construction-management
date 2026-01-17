import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface CostRevenueData {
  name: string;
  fullName: string;
  operatingCosts: number;
  taxes: number;
  revenue: number;
}

interface CostRevenueStackedChartProps {
  data: CostRevenueData[];
}

export function CostRevenueStackedChart({ data }: CostRevenueStackedChartProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Cost vs Revenue Comparison</h3>
        <p className="text-sm text-muted-foreground">Stacked costs against revenue by property</p>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              angle={-30}
              textAnchor="end"
              height={60}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickFormatter={(value) => `Rs. ${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
              formatter={(value: number, name: string) => [
                `Rs. ${value.toLocaleString()}`,
                name === "operatingCosts" ? "Operating Costs" : name === "taxes" ? "Taxes" : "Revenue",
              ]}
              labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
            />
            <Legend
              wrapperStyle={{ paddingTop: 10 }}
              formatter={(value) => (
                <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 12 }}>
                  {value === "operatingCosts" ? "Operating Costs" : value === "taxes" ? "Taxes" : "Revenue"}
                </span>
              )}
            />
            <Bar dataKey="operatingCosts" stackId="costs" fill="hsl(var(--chart-2))" radius={[0, 0, 0, 0]} />
            <Bar dataKey="taxes" stackId="costs" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
