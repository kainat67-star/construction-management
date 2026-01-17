import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Property, properties as initialProperties, LedgerEntry } from "@/data/properties";
import { AccountsLedger } from "@/components/accounts/AccountsLedger";
import { PropertySelector } from "@/components/accounts/PropertySelector";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Accounts = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Load property when propertyId changes
  useEffect(() => {
    if (propertyId) {
      const property = properties.find((p) => p.id === propertyId);
      if (property) {
        setSelectedProperty(property);
      } else {
        toast({
          title: "Property not found",
          description: "The selected property could not be found.",
          variant: "destructive",
        });
        navigate("/accounts");
      }
    }
  }, [propertyId, properties, navigate, toast]);

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    navigate(`/accounts/${property.id}`);
  };

  const handleAddLedgerEntry = (entry: Omit<LedgerEntry, "id">) => {
    if (!selectedProperty) return;

    const newEntry: LedgerEntry = {
      ...entry,
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedProperty: Property = {
      ...selectedProperty,
      ledgerEntries: [...(selectedProperty.ledgerEntries || []), newEntry],
    };

    setProperties(properties.map((p) => (p.id === selectedProperty.id ? updatedProperty : p)));
    setSelectedProperty(updatedProperty);

    toast({
      title: "Entry added",
      description: "Ledger entry has been added successfully.",
    });
  };

  const handleUpdateLedgerEntry = (entryId: string, entry: Partial<LedgerEntry>) => {
    if (!selectedProperty) return;

    const updatedEntries = (selectedProperty.ledgerEntries || []).map((e) =>
      e.id === entryId ? { ...e, ...entry } : e
    );

    const updatedProperty: Property = {
      ...selectedProperty,
      ledgerEntries: updatedEntries,
    };

    setProperties(properties.map((p) => (p.id === selectedProperty.id ? updatedProperty : p)));
    setSelectedProperty(updatedProperty);

    toast({
      title: "Entry updated",
      description: "Ledger entry has been updated successfully.",
    });
  };

  const handleDeleteLedgerEntry = (entryId: string) => {
    if (!selectedProperty) return;

    const updatedEntries = (selectedProperty.ledgerEntries || []).filter((e) => e.id !== entryId);

    const updatedProperty: Property = {
      ...selectedProperty,
      ledgerEntries: updatedEntries,
    };

    setProperties(properties.map((p) => (p.id === selectedProperty.id ? updatedProperty : p)));
    setSelectedProperty(updatedProperty);

    toast({
      title: "Entry deleted",
      description: "Ledger entry has been deleted successfully.",
    });
  };

  const handleLockAccounts = () => {
    if (!selectedProperty) return;

    const updatedEntries = (selectedProperty.ledgerEntries || []).map((e) => ({
      ...e,
      isLocked: true,
    }));

    const updatedProperty: Property = {
      ...selectedProperty,
      ledgerEntries: updatedEntries,
    };

    setProperties(properties.map((p) => (p.id === selectedProperty.id ? updatedProperty : p)));
    setSelectedProperty(updatedProperty);

    toast({
      title: "Accounts locked",
      description: "All ledger entries for this property have been locked.",
    });
  };

  const handleUnlockAccounts = () => {
    if (!selectedProperty) return;

    const updatedEntries = (selectedProperty.ledgerEntries || []).map((e) => ({
      ...e,
      isLocked: false,
    }));

    const updatedProperty: Property = {
      ...selectedProperty,
      ledgerEntries: updatedEntries,
    };

    setProperties(properties.map((p) => (p.id === selectedProperty.id ? updatedProperty : p)));
    setSelectedProperty(updatedProperty);

    toast({
      title: "Accounts unlocked",
      description: "All ledger entries for this property have been unlocked.",
    });
  };

  // If no property is selected, show property selector
  if (!selectedProperty) {
    return (
      <AppLayout title="Accounts">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Select Property</h1>
            <p className="text-muted-foreground">
              Please select a property to view and manage its accounts.
            </p>
          </div>
          <PropertySelector
            properties={properties}
            onSelectProperty={handlePropertySelect}
          />
        </div>
      </AppLayout>
    );
  }

  // Check if accounts are locked
  const isLocked = selectedProperty.ledgerEntries?.some((e) => e.isLocked) || false;
  const allLocked = selectedProperty.ledgerEntries?.every((e) => e.isLocked) || false;

  return (
    <AppLayout title="Accounts">
      <div className="space-y-6">
        {/* Property Header */}
        <div className="border-b border-border pb-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/accounts")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Select Different Property</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {allLocked ? (
                <Button variant="outline" size="sm" onClick={handleUnlockAccounts} className="w-full sm:w-auto">
                  Unlock Accounts
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={handleLockAccounts} className="w-full sm:w-auto">
                  Lock Accounts
                </Button>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">{selectedProperty.name}</h1>
            <p className="text-base sm:text-lg text-muted-foreground">{selectedProperty.location}</p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
              <span className="text-sm text-muted-foreground">
                Category: <span className="font-medium">{selectedProperty.category}</span>
              </span>
              <span className="text-sm text-muted-foreground hidden sm:inline">•</span>
              <span className="text-sm text-muted-foreground">
                Type: <span className="font-medium">{selectedProperty.type}</span>
              </span>
              <span className="text-sm text-muted-foreground hidden sm:inline">•</span>
              <span className="text-sm text-muted-foreground">
                Status: <span className="font-medium">{selectedProperty.status}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Accounts Ledger */}
        <AccountsLedger
          property={selectedProperty}
          onAddEntry={handleAddLedgerEntry}
          onUpdateEntry={handleUpdateLedgerEntry}
          onDeleteEntry={handleDeleteLedgerEntry}
        />
      </div>
    </AppLayout>
  );
};

export default Accounts;

