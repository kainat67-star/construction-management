import { useState } from "react";
import { Plus, Building2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PropertiesTable } from "@/components/properties/PropertiesTable";
import { AddPropertyModal } from "@/components/properties/AddPropertyModal";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Property, getProperties, setProperties as saveProperties } from "@/data/properties";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  
  // Load properties from localStorage on mount
  useEffect(() => {
    setProperties(getProperties());
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const { toast } = useToast();

  const handleAddProperty = (propertyData: Omit<Property, "id">) => {
    // Generate a new ID
    const currentProperties = getProperties();
    const numericIds = currentProperties
      .map((p) => {
        const num = Number(p.id);
        return isNaN(num) ? 0 : num;
      })
      .filter((n) => n > 0);
    const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
    const newId = String(maxId + 1);

    const newProperty: Property = {
      ...propertyData,
      id: newId,
    };

    const updatedProperties = [...currentProperties, newProperty];
    setProperties(updatedProperties);
    saveProperties(updatedProperties);
    toast({
      title: "Property added",
      description: `${newProperty.name} has been added successfully.`,
    });
  };

  const handleUpdateProperty = (id: string, propertyData: Omit<Property, "id">) => {
    const currentProperties = getProperties();
    const updatedProperty: Property = {
      ...propertyData,
      id,
    };

    const updatedProperties = currentProperties.map((p) => (p.id === id ? updatedProperty : p));
    setProperties(updatedProperties);
    saveProperties(updatedProperties);
    setEditingProperty(null);
    toast({
      title: "Property updated",
      description: `${updatedProperty.name} has been updated successfully.`,
    });
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleDelete = (property: Property) => {
    setDeletingProperty(property);
  };

  const confirmDelete = () => {
    if (!deletingProperty) return;
    
    const currentProperties = getProperties();
    const updatedProperties = currentProperties.filter((p) => p.id !== deletingProperty.id);
    setProperties(updatedProperties);
    saveProperties(updatedProperties);
    toast({
      title: "Property deleted",
      description: `${deletingProperty.name} has been removed.`,
    });
    setDeletingProperty(null);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingProperty(null);
    }
  };

  return (
    <AppLayout title="">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-1">Properties</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage your property records and investments
            </p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)} 
            className="gap-2 h-9 px-3 sm:px-4 text-sm bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add New Property</span>
            <span className="sm:hidden">Add Property</span>
          </Button>
        </div>

        {/* Property Listing */}
        <div className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl shadow-lg overflow-hidden">
          <PropertiesTable properties={properties} onEdit={handleEdit} onDelete={handleDelete} />
        </div>

        {/* Add/Edit Property Modal */}
        <AddPropertyModal
          open={isModalOpen}
          onOpenChange={handleModalClose}
          onAddProperty={handleAddProperty}
          onUpdateProperty={handleUpdateProperty}
          editingProperty={editingProperty}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingProperty} onOpenChange={(open) => !open && setDeletingProperty(null)}>
          <AlertDialogContent className="border-border/50 glass-card w-[95vw] sm:w-full max-w-md shadow-modal">
            <AlertDialogHeader className="pb-4 border-b border-border/30">
              <AlertDialogTitle className="text-base sm:text-lg font-semibold">Delete Property</AlertDialogTitle>
              <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground">
                Are you sure you want to delete <strong className="font-medium">{deletingProperty?.name}</strong>? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-4 flex-col-reverse sm:flex-row gap-2">
              <AlertDialogCancel className="h-9 px-4 text-sm border-border/50 hover:bg-muted/50 w-full sm:w-auto">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="h-9 px-4 text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20 w-full sm:w-auto"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
};

export default Properties;
