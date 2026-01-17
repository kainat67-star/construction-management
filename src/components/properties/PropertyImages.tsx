import { useState } from "react";
import { Plus, X, Image as ImageIcon } from "lucide-react";
import { PropertyImage } from "@/data/properties";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PropertyImagesProps {
  images: PropertyImage[];
  onAddImage?: (category: PropertyImage["category"], file: File) => void;
  onDeleteImage?: (imageId: string) => void;
}

const imageCategories: PropertyImage["category"][] = [
  "Front View",
  "Inside",
  "Construction Progress",
  "After Completion",
];

export function PropertyImages({ images, onAddImage, onDeleteImage }: PropertyImagesProps) {
  const [selectedImage, setSelectedImage] = useState<PropertyImage | null>(null);

  const handleFileSelect = (category: PropertyImage["category"], event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onAddImage) {
      onAddImage(category, file);
    }
  };

  const imagesByCategory = imageCategories.map((category) => ({
    category,
    images: images.filter((img) => img.category === category),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Property Images</h3>
      </div>

      {imagesByCategory.map(({ category, images: categoryImages }) => (
        <div key={category} className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">{category}</h4>
            {onAddImage && (
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id={`upload-${category}`}
                  onChange={(e) => handleFileSelect(category, e)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    document.getElementById(`upload-${category}`)?.click();
                  }}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Image
                </Button>
              </div>
            )}
          </div>

          {categoryImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categoryImages.map((image) => (
                <div
                  key={image.id}
                  className="relative group aspect-square overflow-hidden border border-border bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <img
                    src={image.url}
                    alt={category}
                    className="w-full h-full object-cover"
                    onClick={() => setSelectedImage(image)}
                  />
                  {onDeleteImage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteImage(image.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-6 border border-dashed border-border bg-muted/30">
              <div className="text-center">
                <ImageIcon className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No images in this category</p>
                {onAddImage && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 gap-2"
                    onClick={() => {
                      document.getElementById(`upload-${category}`)?.click();
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Add Image
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Full Image View Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.category}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative">
              <img
                src={selectedImage.url}
                alt={selectedImage.category}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

