import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Property } from "@/data/properties";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface PropertiesTableProps {
  properties: Property[];
  onEdit?: (property: Property) => void;
}

const categoryColors = {
  "Land Only": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  "Built House (Purchased)": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  "Land + Construction": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

const typeColors = {
  Sale: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  Rent: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

const statusColors = {
  Ongoing: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  Sold: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
  Rented: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
};

export function PropertiesTable({ properties, onEdit }: PropertiesTableProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Property Name / Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Property Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Property Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Property Status
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    <p className="text-sm">No properties found</p>
                    <p className="text-xs mt-1">Add your first property to get started</p>
                  </td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr
                    key={property.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-foreground">{property.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground">{property.location}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex rounded border px-2 py-0.5 text-xs font-medium", categoryColors[property.category])}>
                        {property.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex rounded border px-2 py-0.5 text-xs font-medium", typeColors[property.type])}>
                        {property.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex rounded border px-2 py-0.5 text-xs font-medium", statusColors[property.status])}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/properties/${property.id}`)}
                        >
                          Open Property
                        </Button>
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(property)}
                            title="Edit Property"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
