import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Product } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface ValidationSidebarProps {
  product: Product | undefined;
  onRequestQuote: () => void;
  designData: any;
  sizeQuantities: { [size: string]: number };
  totalQuantity: number;
  selectedSize: string;
  quantity: number;
}

const ValidationSidebar = ({
  product,
  onRequestQuote,
  selectedSize,
  quantity
}: ValidationSidebarProps) => {
  const [showValidationDialog, setShowValidationDialog] = useState(false);

  const handleRequestQuote = () => {
    if (!selectedSize || quantity <= 0) {
      setShowValidationDialog(true);
      return;
    }
    onRequestQuote();
  };

  return (
    <div className="space-y-4">
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">
          {product?.name || "Votre produit personnalisé"}
        </h2>
        
        <div className="space-y-4">          
          <Button
            onClick={handleRequestQuote}
            className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 py-6"
            size="lg"
          >
            <FileText className="mr-2 h-5 w-5" />
            Demander un devis
          </Button>
        </div>
      </div>

      <Dialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              Information Requise
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center">
            <p className="text-gray-600">
              Veuillez sélectionner une taille et une quantité avant de demander un devis.
            </p>
            <Button 
              className="mt-4"
              onClick={() => setShowValidationDialog(false)}
            >
              D'accord
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ValidationSidebar;