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

interface ProductSwitchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProduct: string;
  targetProduct: string;
  onConfirm: () => void;
}

const ProductSwitchDialog = ({
  open,
  onOpenChange,
  currentProduct,
  targetProduct,
  onConfirm,
}: ProductSwitchDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Changer de produit ?</AlertDialogTitle>
          <AlertDialogDescription>
            Vous êtes sur le point de passer de {currentProduct} à {targetProduct}. 
            Votre design actuel sera effacé. Voulez-vous continuer ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Confirmer et changer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProductSwitchDialog;