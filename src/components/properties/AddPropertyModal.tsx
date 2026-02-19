import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Property, Partner } from "@/data/properties";
import { getBanks } from "@/data/banks";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, X, Image as ImageIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PropertyImage } from "@/data/properties";

const partnerSchema = z.object({
  name: z.string().min(1, "Partner name is required"),
  investmentAmount: z.number().min(0).optional(),
  sharePercentage: z.number().min(0).max(100).optional(),
});

const propertyFormSchema = z.object({
  name: z.string().min(1, "Property name is required"),
  propertyType: z.enum(["House", "Plaza", "Commercial", "Plot", "Other"]).optional(),
  location: z.string().min(1, "Location is required"),
  projectStartDate: z.date().optional(),
  purchasePrice: z.number().min(0, "Amount must be 0 or greater"),
  paymentMethod: z.enum(["Cash", "Bank"]).optional(),
  bankName: z.string().optional(),
  ownershipType: z.enum(["Single", "Joint"]).optional(),
  partners: z.array(partnerSchema).optional(),
  notes: z.string().optional(),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface AddPropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProperty: (property: Omit<Property, "id">) => void;
  onUpdateProperty?: (id: string, property: Omit<Property, "id">) => void;
  editingProperty?: Property | null;
}

export function AddPropertyModal({ 
  open, 
  onOpenChange, 
  onAddProperty, 
  onUpdateProperty,
  editingProperty 
}: AddPropertyModalProps) {
  const isEditMode = !!editingProperty;

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: "",
      propertyType: undefined,
      location: "",
      projectStartDate: new Date(),
      purchasePrice: 0,
      paymentMethod: "Cash",
      bankName: undefined,
      ownershipType: "Single",
      partners: [],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "partners",
  });

  const ownershipType = form.watch("ownershipType");
  const paymentMethod = form.watch("paymentMethod");
  const banks = getBanks();
  const [images, setImages] = useState<PropertyImage[]>([]);
  const previousOwnershipType = useRef<string | undefined>(ownershipType);

  // Update form when editing property changes
  useEffect(() => {
    if (editingProperty) {
      const partners = editingProperty.partners || [];
      form.reset({
        name: editingProperty.name,
        propertyType: undefined, // Map from category if needed
        location: editingProperty.location,
        projectStartDate: new Date(editingProperty.purchaseDate),
        purchasePrice: editingProperty.purchasePrice,
        paymentMethod: "Cash", // Default
        bankName: undefined,
        ownershipType: editingProperty.ownershipType || "Single",
        partners: partners,
        notes: editingProperty.notes || "",
      });
      setImages(editingProperty.images || []);
      previousOwnershipType.current = editingProperty.ownershipType || "Single";
    } else {
      form.reset({
        name: "",
        propertyType: undefined,
        location: "",
        projectStartDate: new Date(),
        purchasePrice: 0,
        paymentMethod: "Cash",
        bankName: undefined,
        ownershipType: "Single",
        partners: [],
        notes: "",
      });
      setImages([]);
      previousOwnershipType.current = "Single";
    }
  }, [editingProperty, form]);

  // Automatically add first partner when Joint ownership is selected
  // Clear partners when switching to Single
  useEffect(() => {
    // Only act when ownership type actually changes
    if (previousOwnershipType.current === ownershipType) {
      return;
    }
    
    previousOwnershipType.current = ownershipType;
    
    if (ownershipType === "Joint" && fields.length === 0) {
      // Auto-add first partner when switching to Joint (only if no partners exist)
      append({ name: "", investmentAmount: undefined, sharePercentage: undefined });
    } else if (ownershipType === "Single" && fields.length > 0) {
      // Clear all partners when switching to Single
      // Remove in reverse order to avoid index issues
      for (let i = fields.length - 1; i >= 0; i--) {
        remove(i);
      }
    }
  }, [ownershipType, fields.length, append, remove]);

  // Reset form when modal closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
      setImages([]);
    }
    onOpenChange(newOpen);
  };

  const handleImageUpload = (category: PropertyImage["category"], file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const newImage: PropertyImage = {
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: dataUrl,
        category,
        uploadedAt: new Date().toISOString().split("T")[0],
      };
      setImages([...images, newImage]);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = (imageId: string) => {
    setImages(images.filter(img => img.id !== imageId));
  };

  const onSubmit = (values: PropertyFormValues) => {
    const propertyData: Omit<Property, "id"> = {
      name: values.name,
      location: values.location,
      category: "Land Only", // Default category
      type: "Sale", // Default type
      status: "Ongoing", // Default status
      purchaseDate: values.projectStartDate 
        ? values.projectStartDate.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      purchasePrice: values.purchasePrice || 0,
      ownershipType: values.ownershipType || "Single",
      partners: values.ownershipType === "Joint" && values.partners && values.partners.length > 0 
        ? values.partners.map(p => ({ 
            name: p.name, 
            investmentAmount: p.investmentAmount,
            sharePercentage: p.sharePercentage 
          }))
        : undefined,
      images: images.length > 0 ? images : undefined,
      notes: values.notes || undefined,
    };

    if (isEditMode && editingProperty && onUpdateProperty) {
      onUpdateProperty(editingProperty.id, propertyData);
    } else {
      onAddProperty(propertyData);
    }
    form.reset();
    setImages([]);
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] sm:w-[90vw] md:w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] flex flex-col p-0 sm:p-4 md:p-6 gap-0 overflow-hidden top-0 sm:top-[50%] left-0 sm:left-[50%] translate-x-0 sm:translate-x-[-50%] translate-y-0 sm:translate-y-[-50%] rounded-none sm:rounded-lg border-gray-300 bg-white">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 flex-shrink-0 border-b border-gray-300">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
            {isEditMode ? "Edit Property" : "Add New Property"}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            {isEditMode 
              ? "Update property details and information"
              : "Enter property information to get started"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 md:py-6 space-y-4 sm:space-y-5 md:space-y-6 pb-6 sm:pb-8 md:pb-10">
            {/* Row 1: Property Name & Property Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-gray-900">Property Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter property name"
                        className="h-12 text-base border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-gray-900">Property Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 text-base border-gray-300">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Plaza">Plaza</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Plot">Plot</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 2: Location & Project Start Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-gray-900">Location / Area</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter location"
                        className="h-12 text-base border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectStartDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium">Project Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-11 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 3: Initial Investment Amount & Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Initial Investment Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="500"
                        placeholder="Enter amount"
                        className="h-11"
                        value={field.value === 0 ? "" : field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? 0 : parseFloat(value) || 0);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Bank">Bank</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 4: Bank Selection (conditional) */}
            {paymentMethod === "Bank" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Bank</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select bank" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {banks.map((bank) => (
                            <SelectItem key={bank.id} value={bank.name}>
                              {bank.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Partners Section - Compact & Collapsible */}
            <div className="space-y-4 pt-4 border-t border-border/30">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Partners (Optional)</h3>
                <div className="flex items-center gap-3">
                  <FormField
                    control={form.control}
                    name="ownershipType"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value || "Single"}>
                            <SelectTrigger className="h-10 w-[150px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Single">Single Owner</SelectItem>
                              <SelectItem value="Joint">Joint</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {ownershipType === "Joint" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ name: "", investmentAmount: undefined, sharePercentage: undefined })}
                      className="h-10 gap-2 shadow-sm hover:shadow-md"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  )}
                </div>
              </div>

              {ownershipType === "Joint" && fields.length > 0 && (
                <div className="space-y-3 border border-border rounded-xl p-4 bg-muted/20">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-3 gap-3 items-end">
                      <FormField
                        control={form.control}
                        name={`partners.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">Partner Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Name"
                                className="h-10 text-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`partners.${index}.investmentAmount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">Investment Amount</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="500"
                                placeholder="Enter amount"
                                className="h-10 text-sm"
                                value={field.value === 0 || !field.value ? "" : field.value}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value === "" ? undefined : parseFloat(value) || undefined);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`partners.${index}.sharePercentage`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="text-xs font-medium">Share %</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="%"
                                  className="h-10 text-sm"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="h-10 w-10 shrink-0 rounded-md hover:bg-destructive/10 text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {ownershipType === "Single" && (
                <p className="text-sm text-muted-foreground">Single owner - 100% ownership</p>
              )}
            </div>

            {/* Property Images Section */}
            <div className="space-y-4 pt-4 border-t border-border/30">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Property Images (Optional)</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(["Front View", "Inside", "Construction Progress", "After Completion"] as const).map((category) => {
                  const categoryImages = images.filter(img => img.category === category);
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-muted-foreground">{category}</label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id={`image-upload-${category}`}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(category, file);
                                e.target.value = ""; // Reset input
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`image-upload-${category}`)?.click()}
                            className="h-8 gap-1.5 text-xs"
                          >
                            <Upload className="h-3.5 w-3.5" />
                            Add
                          </Button>
                        </div>
                      </div>
                      
                      {categoryImages.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {categoryImages.map((image) => (
                            <div key={image.id} className="relative group aspect-square overflow-hidden border border-border rounded-md bg-muted">
                              <img
                                src={image.url}
                                alt={category}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteImage(image.id)}
                                className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {images.length === 0 && (
                <div className="flex items-center justify-center p-6 border border-dashed border-border rounded-lg bg-muted/20">
                  <div className="text-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No images uploaded</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Click "Add" to upload images by category</p>
                  </div>
                </div>
              )}
            </div>

            {/* Notes Section - Full Width */}
            <div className="pt-4 border-t border-gray-300">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-base font-semibold mb-2 block text-gray-900">Notes / Remarks</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional notes or remarks..."
                        className="min-h-[100px] max-h-[200px] text-base resize-y border-gray-300"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>

            </div>
            <DialogFooter className="px-4 sm:px-6 pt-3 sm:pt-4 pb-4 sm:pb-6 gap-2 sm:gap-3 flex-shrink-0 border-t border-gray-300 bg-gray-50">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="w-full sm:w-auto h-10 sm:h-11 px-4 text-sm sm:text-base border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto h-10 sm:h-11 px-4 text-sm sm:text-base bg-primary hover:bg-primary/90 text-white">
                {isEditMode ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
