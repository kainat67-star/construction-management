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
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-300 pb-3 sm:pb-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-1 sm:mb-2">Properties</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage your property records and investments
            </p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)} 
            className="gap-2 h-10 px-4 text-base bg-primary hover:bg-primary/90 text-white"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add New Property</span>
            <span className="sm:hidden">Add Property</span>
          </Button>
        </div>

        {/* Property Listing */}
        <div className="rounded border border-gray-300 bg-gray-50 overflow-hidden">
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
          <AlertDialogContent className="border-gray-300 bg-white w-[95vw] sm:w-full max-w-md">
            <AlertDialogHeader className="pb-4 border-b border-gray-300">
              <AlertDialogTitle className="text-xl font-semibold text-gray-900">Delete Property</AlertDialogTitle>
              <AlertDialogDescription className="text-base text-gray-600">
                Are you sure you want to delete <strong className="font-semibold">{deletingProperty?.name}</strong>? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-4 flex-col-reverse sm:flex-row gap-3">
              <AlertDialogCancel className="h-10 px-4 text-base border-gray-300 hover:bg-gray-50 w-full sm:w-auto">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="h-10 px-4 text-base bg-red-600 text-white hover:bg-red-700 w-full sm:w-auto"
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
