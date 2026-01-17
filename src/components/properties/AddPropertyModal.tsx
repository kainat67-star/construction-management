import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const partnerSchema = z.object({
  name: z.string().min(1, "Partner name is required"),
  sharePercentage: z.number().min(0).max(100).optional(),
});

const propertyFormSchema = z.object({
  name: z.string().min(1, "Property name or code is required"),
  location: z.string().min(1, "Location or area is required"),
  category: z.enum(["Land Only", "Built House (Purchased)", "Land + Construction"], {
    required_error: "Please select a property category",
  }),
  type: z.enum(["Sale", "Rent"], {
    required_error: "Please select a property type",
  }),
  status: z.enum(["Ongoing", "Sold", "Rented"], {
    required_error: "Please select a property status",
  }),
  purchaseDate: z.date({
    required_error: "Purchase date is required",
  }),
  purchasePrice: z.number().min(1, "Purchase price must be greater than 0"),
  ownershipType: z.enum(["Single", "Joint"]).optional(),
  partners: z.array(partnerSchema).optional(),
  constructionStartDate: z.date().optional(),
  expectedCompletionDate: z.date().optional(),
  contractorName: z.string().optional(),
  tenantName: z.string().optional(),
  tenantCNIC: z.string().optional(),
  tenantPhoneNumber: z.string().optional(),
  monthlyRentAmount: z.number().min(0).optional(),
  rentDueDate: z.number().min(1).max(31).optional(),
  securityAdvanceAmount: z.number().min(0).optional(),
  notes: z.string().optional(),
  agentName: z.string().optional(),
  agentPhoneNumber: z.string().optional(),
  agentCommissionAmount: z.number().min(0).optional(),
  agentCommissionPercentage: z.number().min(0).max(100).optional(),
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
      location: "",
      category: undefined,
      type: undefined,
      status: undefined,
      purchaseDate: undefined as any,
      purchasePrice: 0,
      ownershipType: undefined,
      partners: [],
      constructionStartDate: undefined as any,
      expectedCompletionDate: undefined as any,
      contractorName: "",
      tenantName: "",
      tenantCNIC: "",
      tenantPhoneNumber: "",
      monthlyRentAmount: 0,
      rentDueDate: undefined,
      securityAdvanceAmount: 0,
      notes: "",
      agentName: "",
      agentPhoneNumber: "",
      agentCommissionAmount: 0,
      agentCommissionPercentage: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "partners",
  });

  const ownershipType = form.watch("ownershipType");
  const category = form.watch("category");
  const propertyType = form.watch("type");

  // Update form when editing property changes
  useEffect(() => {
    if (editingProperty) {
      form.reset({
        name: editingProperty.name,
        location: editingProperty.location,
        category: editingProperty.category,
        type: editingProperty.type,
        status: editingProperty.status,
        purchaseDate: new Date(editingProperty.purchaseDate),
        purchasePrice: editingProperty.purchasePrice,
        ownershipType: editingProperty.ownershipType,
        partners: editingProperty.partners || [],
        constructionStartDate: editingProperty.constructionDetails?.constructionStartDate
          ? new Date(editingProperty.constructionDetails.constructionStartDate)
          : undefined as any,
        expectedCompletionDate: editingProperty.constructionDetails?.expectedCompletionDate
          ? new Date(editingProperty.constructionDetails.expectedCompletionDate)
          : undefined as any,
        contractorName: editingProperty.constructionDetails?.contractorName || "",
        tenantName: editingProperty.rentalDetails?.tenantName || "",
        tenantCNIC: editingProperty.rentalDetails?.tenantCNIC || "",
        tenantPhoneNumber: editingProperty.rentalDetails?.tenantPhoneNumber || "",
        monthlyRentAmount: editingProperty.rentalDetails?.monthlyRentAmount || 0,
        rentDueDate: editingProperty.rentalDetails?.rentDueDate,
        securityAdvanceAmount: editingProperty.rentalDetails?.securityAdvanceAmount || 0,
        notes: editingProperty.notes || "",
        agentName: editingProperty.agentInformation?.name || "",
        agentPhoneNumber: editingProperty.agentInformation?.phoneNumber || "",
        agentCommissionAmount: editingProperty.agentInformation?.commissionAmount || 0,
        agentCommissionPercentage: editingProperty.agentInformation?.commissionPercentage,
      });
    } else {
      form.reset({
        name: "",
        location: "",
        category: undefined,
        type: undefined,
        status: undefined,
        purchaseDate: undefined as any,
        purchasePrice: 0,
        ownershipType: undefined,
        partners: [],
        constructionStartDate: undefined as any,
        expectedCompletionDate: undefined as any,
        contractorName: "",
        tenantName: "",
        tenantCNIC: "",
        tenantPhoneNumber: "",
        monthlyRentAmount: 0,
        rentDueDate: undefined,
        securityAdvanceAmount: 0,
        notes: "",
        agentName: "",
        agentPhoneNumber: "",
        agentCommissionAmount: 0,
        agentCommissionPercentage: undefined,
      });
    }
  }, [editingProperty, form]);

  // Reset form when modal closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  const onSubmit = (values: PropertyFormValues) => {
    const propertyData: Omit<Property, "id"> = {
      name: values.name,
      location: values.location,
      category: values.category,
      type: values.type,
      status: values.status,
      purchaseDate: values.purchaseDate.toISOString().split("T")[0],
      purchasePrice: values.purchasePrice,
      ownershipType: values.ownershipType,
      partners: values.ownershipType === "Joint" && values.partners && values.partners.length > 0 
        ? values.partners.map(p => ({ name: p.name, sharePercentage: p.sharePercentage }))
        : undefined,
      constructionDetails: values.category === "Land + Construction" && values.constructionStartDate
        ? {
            constructionStartDate: values.constructionStartDate.toISOString().split("T")[0],
            expectedCompletionDate: values.expectedCompletionDate
              ? values.expectedCompletionDate.toISOString().split("T")[0]
              : undefined,
            contractorName: values.contractorName || undefined,
          }
        : undefined,
      rentalDetails: values.type === "Rent" && values.tenantName
        ? {
            tenantName: values.tenantName,
            tenantCNIC: values.tenantCNIC || undefined,
            tenantPhoneNumber: values.tenantPhoneNumber || undefined,
            monthlyRentAmount: values.monthlyRentAmount || 0,
            rentDueDate: values.rentDueDate || 1,
            securityAdvanceAmount: values.securityAdvanceAmount || undefined,
          }
        : undefined,
      notes: values.notes || undefined,
      agentInformation: values.agentName
        ? {
            name: values.agentName,
            phoneNumber: values.agentPhoneNumber || undefined,
            commissionAmount: values.agentCommissionAmount || undefined,
            commissionPercentage: values.agentCommissionPercentage || undefined,
          }
        : undefined,
    };

    if (isEditMode && editingProperty && onUpdateProperty) {
      onUpdateProperty(editingProperty.id, propertyData);
    } else {
      onAddProperty(propertyData);
    }
    form.reset();
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl h-[100dvh] sm:h-auto sm:max-h-[90vh] flex flex-col p-0 sm:p-5 gap-0 sm:gap-4 overflow-hidden sm:overflow-y-auto top-0 sm:top-[50%] left-0 sm:left-[50%] translate-x-0 sm:translate-x-[-50%] translate-y-0 sm:translate-y-[-50%] rounded-none sm:rounded-lg">
        <DialogHeader className="px-4 sm:px-0 pt-4 sm:pt-0 pb-2 sm:pb-3 flex-shrink-0 border-b sm:border-b-0">
          <DialogTitle className="text-base sm:text-lg font-semibold">
            {isEditMode ? "Edit Property" : "Add New Property"}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm mt-0.5 sm:mt-1">
            {isEditMode 
              ? "Update property information. All fields are required."
              : "Enter basic property information. All fields are required."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto px-4 sm:px-0 py-3 sm:py-0 space-y-3 sm:space-y-4">
            {/* Property Name / Code */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Property Name / Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Property-001 or Main Street House"
                      className="text-sm h-9 sm:h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Enter a unique name or code to identify this property
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location / Area */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Location / Area</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Karachi, Sindh or Lahore, Punjab"
                      className="text-sm h-9 sm:h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Enter the city and province/state where the property is located
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Property Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Property Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-sm h-9 sm:h-10">
                        <SelectValue placeholder="Select property category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Land Only">Land Only</SelectItem>
                      <SelectItem value="Built House (Purchased)">Built House (Purchased)</SelectItem>
                      <SelectItem value="Land + Construction">Land + Construction</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    Select the type of property you own
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Property Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Property Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-sm h-9 sm:h-10">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Sale">Sale</SelectItem>
                      <SelectItem value="Rent">Rent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    Is this property for sale or rent?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Property Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Property Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-sm h-9 sm:h-10">
                        <SelectValue placeholder="Select property status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Ongoing">Ongoing</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                      <SelectItem value="Rented">Rented</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    Current status of the property
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Purchase Date */}
            <FormField
              control={form.control}
              name="purchaseDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-sm font-medium">Purchase Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full text-sm h-9 sm:h-10 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
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
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                  <FormDescription className="text-xs">
                    When did you purchase this property?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Purchase Price */}
            <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Purchase Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="text-sm h-9 sm:h-10"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Enter the total amount paid for this property
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ownership & Partner Information Section */}
            <div className="pt-3 sm:pt-4 border-t border-border space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base font-semibold">Ownership & Partner Information</h3>
              <p className="text-xs text-muted-foreground">This section is optional</p>

              {/* Ownership Type */}
              <FormField
                control={form.control}
                name="ownershipType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Ownership Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-sm h-9 sm:h-10">
                          <SelectValue placeholder="Select ownership type (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Joint">Joint</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Select if the property is owned by a single person or jointly
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Partners Section - Only show if Joint is selected */}
              {ownershipType === "Joint" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base font-semibold">Partner Name(s)</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ name: "", sharePercentage: undefined })}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Partner
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start p-2 sm:p-3 border border-border">
                      <div className="flex-1 space-y-2 sm:space-y-3">
                        <FormField
                          control={form.control}
                          name={`partners.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium">Partner Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter partner name"
                                  className="text-sm h-9 sm:h-10"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`partners.${index}.sharePercentage`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium">Ownership Share % (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="e.g., 50"
                                  className="text-sm h-9 sm:h-10"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                Percentage of ownership (0-100)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="mt-6"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {fields.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Click "Add Partner" to add partner information
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Construction Details Section (Conditional - Only for Land + Construction) */}
            {category === "Land + Construction" && (
              <div className="pt-3 sm:pt-4 border-t border-border space-y-3 sm:space-y-4">
                <h3 className="text-sm sm:text-base font-semibold">Construction Details</h3>
                <p className="text-xs text-muted-foreground">Enter construction information (optional)</p>

                <FormField
                  control={form.control}
                  name="constructionStartDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium">Construction Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full text-sm h-9 sm:h-10 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
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
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription className="text-xs">
                        When did construction start?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedCompletionDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium">Expected Completion Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full text-sm h-9 sm:h-10 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date (optional)</span>
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
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription className="text-xs">
                        When is construction expected to complete?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contractorName"
                  render={({ field }) => (
                    <FormItem>
                  <FormLabel className="text-sm font-medium">Contractor Name (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter contractor name"
                      className="text-sm h-9 sm:h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Name of the construction contractor
                  </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Rental Details Section (Conditional - Only for Rent type) */}
            {propertyType === "Rent" && (
              <div className="pt-3 sm:pt-4 border-t border-border space-y-3 sm:space-y-4">
                <h3 className="text-sm sm:text-base font-semibold">Rental Details</h3>
                <p className="text-xs text-muted-foreground">Enter tenant and rental information (optional)</p>

                <FormField
                  control={form.control}
                  name="tenantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Tenant Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter tenant name"
                          className="text-sm h-9 sm:h-10"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Full name of the tenant
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tenantCNIC"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Tenant CNIC (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 42101-1234567-1"
                          className="text-sm h-9 sm:h-10"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        National ID card number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tenantPhoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Tenant Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., +92-300-1234567"
                          className="text-sm h-9 sm:h-10"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Contact phone number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthlyRentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Monthly Rent Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          className="text-sm h-9"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Monthly rental amount
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rentDueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Rent Due Date</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 5"
                          min={1}
                          max={31}
                          className="text-sm h-9 sm:h-10"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Day of the month when rent is due (1-31)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="securityAdvanceAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Security / Advance Amount (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          className="text-sm h-9"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Security deposit or advance payment amount
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Agent / Dealer Information Section (Optional) */}
            <div className="pt-3 sm:pt-4 border-t border-border space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base font-semibold">Agent / Dealer Information</h3>
              <p className="text-xs text-muted-foreground">This section is optional</p>

              <FormField
                control={form.control}
                name="agentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Agent / Dealer Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter agent or dealer name"
                        className="text-sm h-9 sm:h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Name of the real estate agent or dealer
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agentPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                      <FormLabel className="text-sm font-medium">Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., +92-300-1234567"
                          className="text-sm h-9 sm:h-10"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Contact phone number
                      </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="agentCommissionAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Commission Amount (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          className="text-sm h-9 sm:h-10"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Fixed commission amount
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agentCommissionPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Commission Percentage (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 2.5"
                          min={0}
                          max={100}
                          step={0.1}
                          className="text-sm h-9 sm:h-10"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Commission percentage (0-100)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Maintenance & Notes Section */}
            <div className="pt-3 sm:pt-4 border-t border-border space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base font-semibold">Maintenance & Notes</h3>
              <p className="text-xs text-muted-foreground">Add property-specific notes (optional)</p>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Property Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter notes about maintenance, utility issues, agent follow-ups, or any other property-related information..."
                        className="min-h-[100px] sm:min-h-[120px] text-sm"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Free-text notes area for property-specific information
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            </div>
            <DialogFooter className="px-4 sm:px-0 pt-3 sm:pt-0 pb-4 sm:pb-0 gap-2 flex-shrink-0 border-t sm:border-t-0 mt-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                {isEditMode ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
