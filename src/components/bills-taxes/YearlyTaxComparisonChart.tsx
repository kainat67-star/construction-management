import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface YearlyTaxData {
  name: string;
  fullName: string;
  tax2022: number;
  tax2023: number;
  tax2024: number;
}

interface YearlyTaxComparisonChartProps {
  data: YearlyTaxData[];
}

export function YearlyTaxComparisonChart({ data }: YearlyTaxComparisonChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Yearly Tax Comparison</h3>
        <p className="text-sm text-muted-foreground">Tax trends per property (2022-2024)</p>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              angle={-25}
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
                name === "tax2022" ? "2022" : name === "tax2023" ? "2023" : "2024",
              ]}
              labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
            />
            <Legend
              wrapperStyle={{ paddingTop: 10 }}
              formatter={(value) => (
                <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 12 }}>
                  {value === "tax2022" ? "2022" : value === "tax2023" ? "2023" : "2024"}
                </span>
              )}
            />
            <Bar dataKey="tax2022" fill="hsl(var(--chart-3))" radius={[2, 2, 0, 0]} />
            <Bar dataKey="tax2023" fill="hsl(var(--chart-1))" radius={[2, 2, 0, 0]} />
            <Bar dataKey="tax2024" fill="hsl(var(--chart-4))" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
