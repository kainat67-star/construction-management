import { useState } from "react";
import { PropertyImage } from "@/data/properties";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface PropertyImageGalleryProps {
  images: PropertyImage[];
}

export function PropertyImageGallery({ images }: PropertyImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<PropertyImage | null>(null);

  // Get the first "Front View" image as the primary featured image, or first available
  const primaryImage = images.find(img => img.category === "Front View") || images[0];
  const otherImages = images.filter(img => img.id !== primaryImage?.id).slice(0, 5); // Show up to 5 additional thumbnails
  const remainingCount = images.length - otherImages.length - (primaryImage ? 1 : 0);

  if (images.length === 0) {
    return (
      <div className="w-full h-64 border border-border bg-muted/30 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0.5 bg-border">
          {/* Primary Featured Image */}
          <div 
            className={cn(
              "lg:col-span-3 aspect-[16/10] bg-muted cursor-pointer group relative overflow-hidden",
              "hover:opacity-95 transition-opacity"
            )}
            onClick={() => primaryImage && setSelectedImage(primaryImage)}
          >
            {primaryImage && (
              <img
                src={primaryImage.url}
                alt={primaryImage.category}
                className="w-full h-full object-cover"
              />
            )}
            {primaryImage && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
                <p className="text-xs font-medium">{primaryImage.category}</p>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-0.5">
            {otherImages.map((image) => (
              <div
                key={image.id}
                className="aspect-square bg-muted cursor-pointer group relative overflow-hidden hover:opacity-90 transition-opacity"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.url}
                  alt={image.category}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[10px] font-medium truncate">{image.category}</p>
                </div>
              </div>
            ))}
            {otherImages.length === 0 && primaryImage && images.length === 1 && (
              <div className="aspect-square bg-muted/50 flex items-center justify-center">
                <p className="text-[10px] text-muted-foreground text-center px-2">No additional images</p>
              </div>
            )}
            {remainingCount > 0 && (
              <div className="aspect-square bg-muted/50 flex items-center justify-center border border-border">
                <p className="text-[10px] text-muted-foreground text-center px-2">
                  +{remainingCount} more
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Image View Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0">
          <DialogHeader className="p-5 pb-3">
            <DialogTitle className="text-base">{selectedImage?.category}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative border-t border-border">
              <img
                src={selectedImage.url}
                alt={selectedImage.category}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

