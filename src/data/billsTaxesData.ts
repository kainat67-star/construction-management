import { properties } from "./properties";

export interface Bill {
  id: string;
  propertyId: string;
  propertyName: string;
  category: "Electricity" | "Water" | "Maintenance" | "Insurance" | "Gas" | "Internet";
  billingCycle: "Monthly" | "Quarterly" | "Annual";
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  dueDate: string;
  paidDate?: string;
}

export interface Tax {
  id: string;
  propertyId: string;
  propertyName: string;
  taxType: "Property Tax" | "Municipal Tax" | "Special Assessment" | "School Tax";
  period: string;
  amount: number;
  status: "Paid" | "Due" | "Pending";
  dueDate: string;
  paidDate?: string;
}

export const bills: Bill[] = [
  { id: "b1", propertyId: "1", propertyName: "Downtown Office Complex", category: "Electricity", billingCycle: "Monthly", amount: 4200, status: "Paid", dueDate: "2024-01-15", paidDate: "2024-01-12" },
  { id: "b2", propertyId: "1", propertyName: "Downtown Office Complex", category: "Water", billingCycle: "Monthly", amount: 890, status: "Paid", dueDate: "2024-01-20", paidDate: "2024-01-18" },
  { id: "b3", propertyId: "1", propertyName: "Downtown Office Complex", category: "Maintenance", billingCycle: "Monthly", amount: 3500, status: "Pending", dueDate: "2024-02-01" },
  { id: "b4", propertyId: "1", propertyName: "Downtown Office Complex", category: "Insurance", billingCycle: "Annual", amount: 24000, status: "Paid", dueDate: "2024-01-01", paidDate: "2023-12-28" },
  { id: "b5", propertyId: "2", propertyName: "Riverside Apartments", category: "Electricity", billingCycle: "Monthly", amount: 1850, status: "Paid", dueDate: "2024-01-15", paidDate: "2024-01-14" },
  { id: "b6", propertyId: "2", propertyName: "Riverside Apartments", category: "Water", billingCycle: "Monthly", amount: 620, status: "Overdue", dueDate: "2024-01-10" },
  { id: "b7", propertyId: "2", propertyName: "Riverside Apartments", category: "Gas", billingCycle: "Monthly", amount: 980, status: "Pending", dueDate: "2024-02-05" },
  { id: "b8", propertyId: "2", propertyName: "Riverside Apartments", category: "Insurance", billingCycle: "Annual", amount: 12000, status: "Paid", dueDate: "2024-01-01", paidDate: "2023-12-30" },
  { id: "b9", propertyId: "4", propertyName: "Commercial Plaza", category: "Electricity", billingCycle: "Monthly", amount: 5600, status: "Paid", dueDate: "2024-01-18", paidDate: "2024-01-16" },
  { id: "b10", propertyId: "4", propertyName: "Commercial Plaza", category: "Maintenance", billingCycle: "Monthly", amount: 4200, status: "Paid", dueDate: "2024-01-25", paidDate: "2024-01-24" },
  { id: "b11", propertyId: "4", propertyName: "Commercial Plaza", category: "Internet", billingCycle: "Monthly", amount: 450, status: "Pending", dueDate: "2024-02-01" },
  { id: "b12", propertyId: "6", propertyName: "Maple Street Townhomes", category: "Electricity", billingCycle: "Monthly", amount: 1200, status: "Paid", dueDate: "2024-01-15", paidDate: "2024-01-13" },
  { id: "b13", propertyId: "6", propertyName: "Maple Street Townhomes", category: "Water", billingCycle: "Monthly", amount: 380, status: "Paid", dueDate: "2024-01-20", paidDate: "2024-01-19" },
  { id: "b14", propertyId: "8", propertyName: "Sunset Ridge Condos", category: "Electricity", billingCycle: "Monthly", amount: 2100, status: "Pending", dueDate: "2024-02-10" },
  { id: "b15", propertyId: "8", propertyName: "Sunset Ridge Condos", category: "Maintenance", billingCycle: "Quarterly", amount: 8500, status: "Pending", dueDate: "2024-03-01" },
];

export const taxes: Tax[] = [
  { id: "t1", propertyId: "1", propertyName: "Downtown Office Complex", taxType: "Property Tax", period: "Q4 2023", amount: 12000, status: "Paid", dueDate: "2024-01-15", paidDate: "2024-01-10" },
  { id: "t2", propertyId: "1", propertyName: "Downtown Office Complex", taxType: "Municipal Tax", period: "2024", amount: 8500, status: "Due", dueDate: "2024-03-31" },
  { id: "t3", propertyId: "1", propertyName: "Downtown Office Complex", taxType: "School Tax", period: "2024", amount: 6200, status: "Pending", dueDate: "2024-06-30" },
  { id: "t4", propertyId: "2", propertyName: "Riverside Apartments", taxType: "Property Tax", period: "Q4 2023", amount: 4625, status: "Paid", dueDate: "2024-01-15", paidDate: "2024-01-12" },
  { id: "t5", propertyId: "2", propertyName: "Riverside Apartments", taxType: "Property Tax", period: "Q1 2024", amount: 4625, status: "Due", dueDate: "2024-04-15" },
  { id: "t6", propertyId: "4", propertyName: "Commercial Plaza", taxType: "Property Tax", period: "Q4 2023", amount: 15500, status: "Paid", dueDate: "2024-01-15", paidDate: "2024-01-08" },
  { id: "t7", propertyId: "4", propertyName: "Commercial Plaza", taxType: "Special Assessment", period: "2024", amount: 12000, status: "Pending", dueDate: "2024-05-01" },
  { id: "t8", propertyId: "6", propertyName: "Maple Street Townhomes", taxType: "Property Tax", period: "Q4 2023", amount: 3550, status: "Paid", dueDate: "2024-01-15", paidDate: "2024-01-14" },
  { id: "t9", propertyId: "6", propertyName: "Maple Street Townhomes", taxType: "School Tax", period: "2024", amount: 2800, status: "Due", dueDate: "2024-06-30" },
  { id: "t10", propertyId: "8", propertyName: "Sunset Ridge Condos", taxType: "Property Tax", period: "Q4 2023", amount: 5500, status: "Paid", dueDate: "2024-01-15", paidDate: "2024-01-11" },
  { id: "t11", propertyId: "8", propertyName: "Sunset Ridge Condos", taxType: "Municipal Tax", period: "2024", amount: 4200, status: "Pending", dueDate: "2024-03-31" },
];

export const monthlyExpenseTrend = [
  { month: "Jan", bills: 32000, taxes: 41175, total: 73175 },
  { month: "Feb", bills: 28500, taxes: 8200, total: 36700 },
  { month: "Mar", bills: 31200, taxes: 12700, total: 43900 },
  { month: "Apr", bills: 29800, taxes: 9250, total: 39050 },
  { month: "May", bills: 33400, taxes: 12000, total: 45400 },
  { month: "Jun", bills: 35600, taxes: 9000, total: 44600 },
  { month: "Jul", bills: 38200, taxes: 8500, total: 46700 },
  { month: "Aug", bills: 36800, taxes: 9200, total: 46000 },
  { month: "Sep", bills: 32100, taxes: 10500, total: 42600 },
  { month: "Oct", bills: 30500, taxes: 41175, total: 71675 },
  { month: "Nov", bills: 29200, taxes: 8800, total: 38000 },
  { month: "Dec", bills: 34500, taxes: 9500, total: 44000 },
];

export const yearlyTaxComparison = properties.slice(0, 6).map((p) => ({
  name: p.name.length > 12 ? p.name.substring(0, 12) + "..." : p.name,
  fullName: p.name,
  tax2022: Math.round(p.annualTax * 0.92),
  tax2023: Math.round(p.annualTax * 0.96),
  tax2024: p.annualTax,
}));

export const taxSummary = {
  totalPaidYTD: taxes.filter(t => t.status === "Paid").reduce((sum, t) => sum + t.amount, 0),
  pendingTaxes: taxes.filter(t => t.status === "Pending" || t.status === "Due").reduce((sum, t) => sum + t.amount, 0),
  upcomingDeadlines: taxes.filter(t => t.status !== "Paid").length,
  overdueCount: bills.filter(b => b.status === "Overdue").length,
};
