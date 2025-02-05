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
import { useState } from "react";

interface BulkActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
}

export function BulkActions({ selectedCount, onBulkDelete }: BulkActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onBulkDelete();
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="p-4 bg-muted/50 border-b flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {selectedCount} {selectedCount === 1 ? 'survey' : 'surveys'} selected
        </p>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDeleteClick}
        >
          Delete Selected
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Surveys</AlertDialogTitle>
            <AlertDialogDescription>
              Are you absolutely sure you want to delete {selectedCount} {selectedCount === 1 ? 'survey' : 'surveys'}? This action cannot be undone.
              All survey data including questions, responses, and insights will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Surveys
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}