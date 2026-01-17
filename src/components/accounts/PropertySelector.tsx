import { Property } from "@/data/properties";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface PropertySelectorProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export function PropertySelector({ properties, onSelectProperty }: PropertySelectorProps) {

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No properties available. Please add a property first.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {properties.map((property) => (
        <Card
          key={property.id}
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => onSelectProperty(property)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{property.name}</CardTitle>
              </div>
            </div>
            <CardDescription className="flex items-center gap-1 mt-2">
              <MapPin className="h-3 w-3" />
              {property.location}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  {property.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {property.type}
                </Badge>
                <Badge
                  variant={property.status === "Ongoing" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {property.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Purchase Price: <span className="font-medium">{formatCurrency(property.purchasePrice)}</span>
              </div>
              <Button className="w-full mt-4" onClick={() => onSelectProperty(property)}>
                Open Accounts
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

