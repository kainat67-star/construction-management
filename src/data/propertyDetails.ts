import { Property } from "./properties";

export interface Expense {
  id: string;
  propertyId: string;
  date: string;
  category: "Maintenance" | "Utilities" | "Insurance" | "Repairs" | "Management" | "Security" | "Cleaning" | "Landscaping";
  description: string;
  amount: number;
  frequency: "One-time" | "Monthly" | "Quarterly" | "Annually";
}

export interface Bill {
  id: string;
  propertyId: string;
  type: "Electric" | "Water" | "Gas" | "Internet" | "Waste" | "Maintenance" | "Insurance";
  vendor: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
  period: string;
}

export interface TaxRecord {
  id: string;
  propertyId: string;
  taxType: "Property Tax" | "Land Tax" | "School Tax" | "Municipal Tax" | "Special Assessment";
  period: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
}

export interface ProfitData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

// Sample expenses for properties
export const expenses: Expense[] = [
  { id: "e1", propertyId: "1", date: "2026-01-05", category: "Maintenance", description: "HVAC system quarterly service", amount: 2400, frequency: "Quarterly" },
  { id: "e2", propertyId: "1", date: "2026-01-02", category: "Utilities", description: "Electricity - common areas", amount: 1850, frequency: "Monthly" },
  { id: "e3", propertyId: "1", date: "2025-12-28", category: "Security", description: "24/7 security service", amount: 4500, frequency: "Monthly" },
  { id: "e4", propertyId: "1", date: "2025-12-15", category: "Cleaning", description: "Commercial cleaning service", amount: 3200, frequency: "Monthly" },
  { id: "e5", propertyId: "1", date: "2025-12-10", category: "Insurance", description: "Commercial property insurance", amount: 8500, frequency: "Annually" },
  { id: "e6", propertyId: "1", date: "2025-12-01", category: "Management", description: "Property management fee", amount: 2800, frequency: "Monthly" },
  { id: "e7", propertyId: "1", date: "2025-11-20", category: "Repairs", description: "Elevator maintenance", amount: 1200, frequency: "One-time" },
  { id: "e8", propertyId: "1", date: "2025-11-15", category: "Landscaping", description: "Grounds maintenance", amount: 950, frequency: "Monthly" },
  { id: "e9", propertyId: "2", date: "2026-01-08", category: "Utilities", description: "Water & sewage", amount: 890, frequency: "Monthly" },
  { id: "e10", propertyId: "2", date: "2026-01-03", category: "Maintenance", description: "Plumbing repairs", amount: 650, frequency: "One-time" },
  { id: "e11", propertyId: "2", date: "2025-12-20", category: "Insurance", description: "Landlord insurance premium", amount: 4200, frequency: "Annually" },
];

// Sample bills for properties
export const bills: Bill[] = [
  { id: "b1", propertyId: "1", type: "Electric", vendor: "ConEdison", amount: 1850, dueDate: "2026-01-15", status: "Pending", period: "Dec 2025" },
  { id: "b2", propertyId: "1", type: "Water", vendor: "NYC Water Board", amount: 420, dueDate: "2026-01-20", status: "Pending", period: "Dec 2025" },
  { id: "b3", propertyId: "1", type: "Gas", vendor: "National Grid", amount: 680, dueDate: "2026-01-18", status: "Paid", period: "Dec 2025" },
  { id: "b4", propertyId: "1", type: "Internet", vendor: "Verizon Business", amount: 450, dueDate: "2026-01-10", status: "Paid", period: "Jan 2026" },
  { id: "b5", propertyId: "1", type: "Waste", vendor: "Waste Management", amount: 380, dueDate: "2026-01-25", status: "Pending", period: "Jan 2026" },
  { id: "b6", propertyId: "1", type: "Maintenance", vendor: "ABC Maintenance Co.", amount: 2400, dueDate: "2025-12-30", status: "Overdue", period: "Q4 2025" },
  { id: "b7", propertyId: "1", type: "Insurance", vendor: "Hartford Insurance", amount: 2125, dueDate: "2026-01-31", status: "Pending", period: "Q1 2026" },
  { id: "b8", propertyId: "2", type: "Electric", vendor: "PSEG", amount: 920, dueDate: "2026-01-12", status: "Paid", period: "Dec 2025" },
  { id: "b9", propertyId: "2", type: "Water", vendor: "Brooklyn Water", amount: 340, dueDate: "2026-01-22", status: "Pending", period: "Dec 2025" },
];

// Sample tax records for properties
export const taxRecords: TaxRecord[] = [
  { id: "t1", propertyId: "1", taxType: "Property Tax", period: "Q1 2026", amount: 12000, dueDate: "2026-01-31", status: "Pending" },
  { id: "t2", propertyId: "1", taxType: "School Tax", period: "2025-2026", amount: 8500, dueDate: "2025-09-15", status: "Paid" },
  { id: "t3", propertyId: "1", taxType: "Municipal Tax", period: "2026", amount: 15000, dueDate: "2026-03-31", status: "Pending" },
  { id: "t4", propertyId: "1", taxType: "Special Assessment", period: "2025", amount: 3200, dueDate: "2025-12-15", status: "Paid" },
  { id: "t5", propertyId: "2", taxType: "Property Tax", period: "Q1 2026", amount: 4625, dueDate: "2026-01-31", status: "Pending" },
  { id: "t6", propertyId: "2", taxType: "School Tax", period: "2025-2026", amount: 3100, dueDate: "2025-09-15", status: "Paid" },
];

// Profit trend data
export const profitTrendData: Record<string, ProfitData[]> = {
  "1": [
    { month: "Jul", revenue: 32000, expenses: 16500, profit: 15500 },
    { month: "Aug", revenue: 34000, expenses: 17200, profit: 16800 },
    { month: "Sep", revenue: 35000, expenses: 18500, profit: 16500 },
    { month: "Oct", revenue: 33500, expenses: 16800, profit: 16700 },
    { month: "Nov", revenue: 35000, expenses: 19200, profit: 15800 },
    { month: "Dec", revenue: 36000, expenses: 18000, profit: 18000 },
  ],
  "2": [
    { month: "Jul", revenue: 11800, expenses: 5800, profit: 6000 },
    { month: "Aug", revenue: 12400, expenses: 6100, profit: 6300 },
    { month: "Sep", revenue: 12800, expenses: 6400, profit: 6400 },
    { month: "Oct", revenue: 12200, expenses: 5900, profit: 6300 },
    { month: "Nov", revenue: 12800, expenses: 6200, profit: 6600 },
    { month: "Dec", revenue: 13200, expenses: 6500, profit: 6700 },
  ],
};

// Helper to get expenses by property
export const getPropertyExpenses = (propertyId: string): Expense[] => 
  expenses.filter(e => e.propertyId === propertyId);

// Helper to get bills by property  
export const getPropertyBills = (propertyId: string): Bill[] =>
  bills.filter(b => b.propertyId === propertyId);

// Helper to get tax records by property
export const getPropertyTaxRecords = (propertyId: string): TaxRecord[] =>
  taxRecords.filter(t => t.propertyId === propertyId);

// Helper to get profit trend data
export const getPropertyProfitTrend = (propertyId: string): ProfitData[] =>
  profitTrendData[propertyId] || [
    { month: "Jul", revenue: 8000, expenses: 4500, profit: 3500 },
    { month: "Aug", revenue: 8200, expenses: 4600, profit: 3600 },
    { month: "Sep", revenue: 8500, expenses: 4800, profit: 3700 },
    { month: "Oct", revenue: 8100, expenses: 4400, profit: 3700 },
    { month: "Nov", revenue: 8600, expenses: 4900, profit: 3700 },
    { month: "Dec", revenue: 9000, expenses: 5100, profit: 3900 },
  ];
