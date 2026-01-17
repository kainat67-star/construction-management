import { useNavigate } from "react-router-dom";
import { MapPin, TrendingUp, TrendingDown, DollarSign, ArrowRight, MoreVertical, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Property } from "@/data/properties";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const typeColors = {
  Residential: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  Commercial: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  Land: "bg-chart-3/10 text-chart-3 border-chart-3/20",
};

const statusColors = {
  Active: "bg-success/10 text-success",
  "Under Construction": "bg-warning/10 text-warning",
  Sold: "bg-muted text-muted-foreground",
};

const typeGradients = {
  Residential: "from-chart-1/5 to-transparent",
  Commercial: "from-chart-2/5 to-transparent",
  Land: "from-chart-3/5 to-transparent",
};

interface PropertiesGridProps {
  properties: Property[];
  onEdit?: (property: Property) => void;
  onDelete?: (propertyId: string) => void;
}

export function PropertiesGrid({ properties, onEdit, onDelete }: PropertiesGridProps) {
  const navigate = useNavigate();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

  return (
    <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {properties.map((property, index) => (
        <div
          key={property.id}
          className="group relative overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover animate-fade-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Gradient overlay based on type */}
          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", typeGradients[property.type])} />

          <div className="relative p-6">
            {/* Header */}
            <div className="mb-5 flex items-start justify-between">
              <div className="space-y-1.5 flex-1 min-w-0">
                <h3 className="font-bold text-lg text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {property.name}
                </h3>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">{property.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold", typeColors[property.type])}>
                  {property.type}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(property);
                      }}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(property.id);
                      }}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Status */}
            <div className="mb-5">
              <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", statusColors[property.status])}>
                {property.status}
              </span>
            </div>

            {/* Stats */}
            <div className="space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Purchase Price</span>
                <span className="font-bold text-card-foreground">{formatCurrency(property.purchasePrice)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Monthly Cost</span>
                <span className="text-sm font-semibold text-card-foreground">{formatCurrency(property.monthlyOperatingCost)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Net P/L (Annual)</span>
                <div
                  className={cn(
                    "flex items-center gap-1.5 font-bold",
                    property.netProfitLoss >= 0 ? "text-success" : "text-destructive"
                  )}
                >
                  {property.netProfitLoss >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {property.netProfitLoss >= 0 ? "+" : ""}
                  {formatCurrency(property.netProfitLoss)}
                </div>
              </div>
            </div>

            {/* Action */}
            <Button
              variant="outline"
              className="mt-4 w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
              onClick={() => navigate(`/properties/${property.id}`)}
            >
              View Details
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
