import { MapPin, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyMapProps {
  location: string;
  propertyName?: string;
  className?: string;
}

export function PropertyMap({ location, propertyName, className }: PropertyMapProps) {
  // Encode the location for URL
  const encodedLocation = encodeURIComponent(location);
  const mapTitle = propertyName ? `${propertyName}, ${location}` : location;

  // Links to open in external map services
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  const osmSearchUrl = `https://www.openstreetmap.org/search?query=${encodedLocation}`;
  
  // Using a static map image from OpenStreetMap (via staticmap.org or similar)
  // For a more interactive map, you could integrate Leaflet or Google Maps with API key
  const staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${encodedLocation}&zoom=13&size=800x400&markers=${encodedLocation}`;
  
  return (
    <div className={cn("w-full border border-border bg-card overflow-hidden", className)}>
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Property Location</p>
              <p className="text-xs text-muted-foreground">{location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href={osmSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              <span>OpenStreetMap</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="relative w-full bg-muted/30" style={{ height: "400px" }}>
        {/* Embedded map using iframe - works with location strings */}
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={`https://maps.google.com/maps?q=${encodedLocation}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
          className="border-0"
          title={mapTitle}
          style={{ border: "none" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        {/* Overlay with quick links - appears on hover */}
        <div className="absolute bottom-3 right-3 opacity-0 hover:opacity-100 transition-opacity pointer-events-none group">
          <div className="bg-background/95 border border-border rounded-sm p-2 shadow-sm pointer-events-auto">
            <div className="flex flex-col gap-1.5 text-xs">
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                <span>Open in Google Maps</span>
              </a>
              <a
                href={osmSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                <span>Open in OpenStreetMap</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

