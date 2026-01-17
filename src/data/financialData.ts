import { properties } from "./properties";

export interface PropertyFinancialData {
  id: string;
  name: string;
  totalBills: number;
  maintenanceCosts: number;
  taxCosts: number;
  otherExpenses: number;
  totalCost: number;
  revenue: number;
  profit: number;
}

export const propertyFinancialData: PropertyFinancialData[] = properties.map((property) => ({
  id: property.id,
  name: property.name,
  totalBills: Math.round(property.monthlyOperatingCost * 12 * 0.35),
  maintenanceCosts: Math.round(property.monthlyOperatingCost * 12 * 0.4),
  taxCosts: property.annualTax,
  otherExpenses: Math.round(property.monthlyOperatingCost * 12 * 0.25),
  totalCost: property.monthlyOperatingCost * 12 + property.annualTax,
  revenue: property.monthlyRevenue * 12,
  profit: property.netProfitLoss,
}));

export const profitPerProperty = properties.map((property) => ({
  name: property.name.length > 15 ? property.name.substring(0, 15) + "..." : property.name,
  fullName: property.name,
  profit: property.netProfitLoss,
  fill: property.netProfitLoss >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))",
}));

export const costVsRevenueData = properties
  .filter((p) => p.status !== "Under Construction")
  .map((property) => ({
    name: property.name.length > 12 ? property.name.substring(0, 12) + "..." : property.name,
    fullName: property.name,
    operatingCosts: property.monthlyOperatingCost * 12,
    taxes: property.annualTax,
    revenue: property.monthlyRevenue * 12,
  }));

export const financialSummary = {
  mostProfitableProperty: properties.reduce((prev, current) => 
    current.netProfitLoss > prev.netProfitLoss ? current : prev
  ),
  highestCostProperty: properties.reduce((prev, current) => 
    (current.monthlyOperatingCost * 12 + current.annualTax) > (prev.monthlyOperatingCost * 12 + prev.annualTax) 
      ? current 
      : prev
  ),
  averageMonthlyExpense: Math.round(
    properties.reduce((sum, p) => sum + p.monthlyOperatingCost, 0) / properties.length
  ),
};
