import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface FaceConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFace: string;
  targetFace: string;
  onConfirm: () => void;
}

const FaceConfirmationDialog = ({
  open,
  onOpenChange,
  currentFace,
  targetFace,
  onConfirm,
}: FaceConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sauvegarder le design actuel ?</DialogTitle>
          <DialogDescription>
            Voulez-vous sauvegarder le design de la {currentFace} avant de passer à la {targetFace} ?
            Vous pourrez toujours revenir modifier ce design plus tard.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onConfirm} className="bg-green-500 hover:bg-green-600">
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder et continuer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FaceConfirmationDialog;