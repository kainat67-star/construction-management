import { useState } from "react";
import { Plus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PropertiesTable } from "@/components/properties/PropertiesTable";
import { AddPropertyModal } from "@/components/properties/AddPropertyModal";
import { Button } from "@/components/ui/button";
import { Property, properties as initialProperties } from "@/data/properties";
import { useToast } from "@/hooks/use-toast";

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const { toast } = useToast();

  const handleAddProperty = (propertyData: Omit<Property, "id">) => {
    // Generate a new ID
    const newId = String(Math.max(...properties.map((p) => Number(p.id)), 0) + 1);

    const newProperty: Property = {
      ...propertyData,
      id: newId,
    };

    setProperties([...properties, newProperty]);
    toast({
      title: "Property added",
      description: `${newProperty.name} has been added successfully.`,
    });
  };

  const handleUpdateProperty = (id: string, propertyData: Omit<Property, "id">) => {
    const updatedProperty: Property = {
      ...propertyData,
      id,
    };

    setProperties(properties.map((p) => (p.id === id ? updatedProperty : p)));
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

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingProperty(null);
    }
  };

  return (
    <AppLayout title="Properties">
      {/* Header with Add Button */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Manage your property records</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Property
        </Button>
      </div>

      {/* Property Listing Table */}
      <PropertiesTable properties={properties} onEdit={handleEdit} />

      {/* Add/Edit Property Modal */}
      <AddPropertyModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onAddProperty={handleAddProperty}
        onUpdateProperty={handleUpdateProperty}
        editingProperty={editingProperty}
      />
    </AppLayout>
  );
};

export default Properties;
