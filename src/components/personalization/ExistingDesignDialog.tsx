
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
import { useNavigate } from "react-router-dom";

interface ExistingDesignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClearDesign: () => void;
}

const ExistingDesignDialog = ({
  open,
  onOpenChange,
}: ExistingDesignDialogProps) => {
  const navigate = useNavigate();

  const handleContinueToQuote = () => {
    onOpenChange(false);
    navigate('/devis');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Design existant détecté</AlertDialogTitle>
          <AlertDialogDescription>
            Voulez-vous continuer vers la demande de devis avec le design actuel ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinueToQuote} className="bg-primary">
            Continuer vers le devis
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExistingDesignDialog;
