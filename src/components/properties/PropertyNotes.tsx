import { useState } from "react";
import { Save, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface PropertyNotesProps {
  notes: string;
  onSaveNotes?: (notes: string) => void;
}

export function PropertyNotes({ notes, onSaveNotes }: PropertyNotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(notes);

  const handleSave = () => {
    if (onSaveNotes) {
      onSaveNotes(editedNotes);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedNotes(notes);
    setIsEditing(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Maintenance & Notes</h3>
        {!isEditing && onSaveNotes && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Edit Notes
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <Label htmlFor="notes" className="text-sm font-medium">Property Notes</Label>
          <Textarea
            id="notes"
            placeholder="Enter notes about maintenance, utility issues, agent follow-ups, or any other property-related information..."
            value={editedNotes}
            onChange={(e) => setEditedNotes(e.target.value)}
            className="min-h-[150px] text-sm"
            rows={6}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save Notes
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-4 border border-border bg-muted/30 min-h-[150px]">
          {notes ? (
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{notes}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              No notes available. Click "Edit Notes" to add property-specific notes, maintenance reminders, utility issues, or agent follow-ups.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

