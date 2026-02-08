import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Property } from "@/data/properties";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Building2, MapPin, Users, DollarSign } from "lucide-react";

interface PropertiesTableProps {
  properties: Property[];
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
}

const typeColors = {
  Sale: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300",
  Rent: "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300",
};

const statusColors = {
  Ongoing: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
  Sold: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Rented: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
};

export function PropertiesTable({ properties, onEdit, onDelete }: PropertiesTableProps) {
  const navigate = useNavigate();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(value);

  const EmptyState = () => (
    <div className="px-4 py-16 text-center">
      <div className="flex flex-col items-center gap-3">
        <Building2 className="h-10 w-10 text-muted-foreground/30" />
        <div>
          <p className="text-sm font-medium text-foreground mb-1">No properties found</p>
          <p className="text-xs text-muted-foreground">Add your first property to get started</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      {/* Mobile Card Layout - visible on mobile only */}
      <div className="md:hidden space-y-4">
        {properties.length === 0 ? (
          <EmptyState />
        ) : (
          properties.map((property) => {
            const partners = property.partners || [];
            const partnerCount = partners.length;
            const totalInvestment = partners.reduce((sum, p) => sum + (p.investmentAmount || 0), 0);
            const purchasePrice = property.purchasePrice || 0;

            return (
              <div
                key={property.id}
                className="rounded-xl border border-border/30 bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header with name and actions */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h3 className="text-base font-semibold text-foreground flex-1 min-w-0 pr-2">
                    {property.name}
                  </h3>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/properties/${property.id}`)}
                      className="h-8 px-2.5 text-xs border-border/50 hover:bg-muted/50 font-medium"
                      title="Open Property"
                    >
                      Open
                    </Button>
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(property)}
                        title="Edit Property"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(property)}
                        title="Delete Property"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Details stacked vertically */}
                <div className="space-y-3">
                  {/* Location */}
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">Location</p>
                      <p className="text-sm text-foreground break-words">{property.location}</p>
                    </div>
                  </div>

                  {/* Type and Status */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex-1 min-w-[120px]">
                      <p className="text-xs text-muted-foreground mb-1.5">Type</p>
                      <span className={cn("inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold border", typeColors[property.type])}>
                        {property.type}
                      </span>
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <p className="text-xs text-muted-foreground mb-1.5">Status</p>
                      <span className={cn("inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold border", statusColors[property.status])}>
                        {property.status}
                      </span>
                    </div>
                  </div>

                  {/* Partners */}
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">Ownership</p>
                      <p className="text-sm text-foreground">
                        {property.ownershipType === "Joint" && partnerCount > 0
                          ? `${partnerCount} Partner${partnerCount > 1 ? "s" : ""}`
                          : "Single Owner"}
                      </p>
                    </div>
                  </div>

                  {/* Investment */}
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">Investment</p>
                      <p className="text-sm font-semibold text-foreground">
                        {totalInvestment > 0 ? formatCurrency(totalInvestment) : purchasePrice > 0 ? formatCurrency(purchasePrice) : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table Layout - visible on md and above */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/20 bg-muted/10">
              <th className="px-5 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[180px]">
                Property Name
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[160px]">
                Location
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[100px]">
                Type
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[100px]">
                Status
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[90px]">
                Partners
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[160px]">
                Total Investment
              </th>
              <th className="px-5 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[140px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {properties.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <EmptyState />
                </td>
              </tr>
            ) : (
              properties.map((property) => {
                const partners = property.partners || [];
                const partnerCount = partners.length;
                const totalInvestment = partners.reduce((sum, p) => sum + (p.investmentAmount || 0), 0);
                const purchasePrice = property.purchasePrice || 0;

                return (
                  <tr
                    key={property.id}
                    className="border-b border-border/10 hover:bg-muted/15 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-foreground">{property.name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-muted-foreground">{property.location}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn("inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold border", typeColors[property.type])}>
                        {property.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn("inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold border", statusColors[property.status])}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-foreground">
                        {property.ownershipType === "Joint" && partnerCount > 0 ? partnerCount : 1}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-foreground">
                        {totalInvestment > 0 ? formatCurrency(totalInvestment) : purchasePrice > 0 ? formatCurrency(purchasePrice) : '-'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/properties/${property.id}`)}
                          className="h-8 px-3 text-xs border-border/50 hover:bg-muted/50 font-medium"
                          title="Open Property"
                        >
                          Open
                        </Button>
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(property)}
                            title="Edit Property"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(property)}
                            title="Delete Property"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
