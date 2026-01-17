import { Building2, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { properties } from "@/data/properties";

interface FinancialFiltersProps {
  selectedProperty: string;
  onPropertyChange: (value: string) => void;
  dateRange: string;
  onDateRangeChange: (value: string) => void;
}

export function FinancialFilters({
  selectedProperty,
  onPropertyChange,
  dateRange,
  onDateRangeChange,
}: FinancialFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <Select value={selectedProperty} onValueChange={onPropertyChange}>
          <SelectTrigger className="w-[220px] bg-card">
            <SelectValue placeholder="Select Property" />
          </SelectTrigger>
          <SelectContent className="bg-card z-50">
            <SelectItem value="all">All Properties</SelectItem>
            {properties.map((property) => (
              <SelectItem key={property.id} value={property.id}>
                {property.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-[160px] bg-card">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent className="bg-card z-50">
            <SelectItem value="ytd">Year to Date</SelectItem>
            <SelectItem value="q1">Q1 2024</SelectItem>
            <SelectItem value="q2">Q2 2024</SelectItem>
            <SelectItem value="q3">Q3 2024</SelectItem>
            <SelectItem value="q4">Q4 2024</SelectItem>
            <SelectItem value="2023">Full Year 2023</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
