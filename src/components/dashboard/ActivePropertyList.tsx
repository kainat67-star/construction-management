import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface Property {
  id: string;
  name: string;
  beds: number;
  sqft: number;
  location: string;
  contact: string;
  price: string;
  image?: string;
}

const properties: Property[] = [
  {
    id: "1",
    name: "Oplence Oasis",
    beds: 3,
    sqft: 1200,
    location: "Paris, France",
    contact: "(409) 450-1566",
    price: "$45,858.59",
  },
  {
    id: "2",
    name: "Luxury Villa",
    beds: 4,
    sqft: 1800,
    location: "London, UK",
    contact: "(409) 450-1567",
    price: "$65,200.00",
  },
  {
    id: "3",
    name: "Modern Apartment",
    beds: 2,
    sqft: 900,
    location: "New York, USA",
    contact: "(409) 450-1568",
    price: "$38,500.00",
  },
  {
    id: "4",
    name: "Beach House",
    beds: 5,
    sqft: 2200,
    location: "Miami, USA",
    contact: "(409) 450-1569",
    price: "$78,900.00",
  },
  {
    id: "5",
    name: "City Loft",
    beds: 2,
    sqft: 1100,
    location: "Tokyo, Japan",
    contact: "(409) 450-1570",
    price: "$52,300.00",
  },
];

export function ActivePropertyList() {
  return (
    <Card className="border-border shadow-card">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4">
        <CardTitle className="text-base sm:text-lg font-bold">Active Property</CardTitle>
        <Button variant="outline" size="sm" className="h-8 gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {properties.map((property) => (
          <div
            key={property.id}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
          >
            {/* Property Image Placeholder */}
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex-shrink-0 items-center justify-center flex">
              <span className="text-xs font-semibold text-foreground">🏠</span>
            </div>

            {/* Property Details */}
            <div className="flex-1 min-w-0 w-full sm:w-auto">
              <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">{property.name}</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {property.beds} beds • {property.sqft} sqft
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{property.location}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">{property.contact}</p>
            </div>

            {/* Price and Edit */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-2">
              <p className="text-base sm:text-lg font-bold text-foreground">{property.price}</p>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
