
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "fabric";
import { toast } from "sonner";
import { productSidesConfigs } from "../config/productSidesConfig";
import { products } from "@/config/products";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface DesignValidationHandlerProps {
  canvas: Canvas | null;
  selectedCategory: string | null;
  selectedSide: string;
}

export const DesignValidationHandler = ({
  canvas,
  selectedCategory,
  selectedSide
}: DesignValidationHandlerProps) => {
  const navigate = useNavigate();
  const [showDesignPrompt, setShowDesignPrompt] = useState(false);

  const saveCurrentDesign = () => {
    if (!canvas || !selectedCategory) return;

    // Get the product information
    const product = products.find(p => p.id === selectedCategory);
    if (!product) {
      toast.error("Produit non trouvé");
      return;
    }

    // Save current face design
    const textElements = canvas.getObjects('text').map((obj: any) => ({
      content: obj.text || '',
      font: obj.fontFamily || '',
      color: obj.fill?.toString() || '',
      size: obj.fontSize || 16,
      style: {
        bold: obj.fontWeight === 'bold',
        italic: obj.fontStyle === 'italic',
        underline: obj.underline || false,
        align: obj.textAlign || 'center'
      }
    }));

    // Get and format the selected color
    const selectedColor = localStorage.getItem('selectedProductColor');
    let formattedColor;
    
    if (!selectedColor) {
      formattedColor = 'Non spécifiée';
      console.warn('No color selected in localStorage');
    } else {
      console.log('Selected color from localStorage:', selectedColor);
      switch (selectedColor.toLowerCase()) {
        case '#000000':
          formattedColor = 'Noir';
          break;
        case '#ffffff':
          formattedColor = 'Blanc';
          break;
        default:
          formattedColor = selectedColor;
      }
    }

    const designData = {
      faceId: selectedSide,
      productId: selectedCategory,
      productName: product.name,
      selectedColor: formattedColor,
      canvasImage: canvas.toDataURL(),
      textElements,
      uploadedImages: canvas.getObjects('image').map((obj: any) => ({
        name: obj.name || 'image',
        url: obj._element?.src || ''
      }))
    };

    const designKey = `design-${selectedCategory}-${selectedSide}`;
    localStorage.setItem(designKey, JSON.stringify(designData));
    
    // Store the product name separately to ensure it's always available
    localStorage.setItem('selectedProductName', product.name);
    localStorage.setItem('selectedProductId', selectedCategory);
  };

  const hasUndesignedSides = () => {
    if (!selectedCategory) return false;
    
    const productConfig = productSidesConfigs.find(config => config.id === selectedCategory);
    if (!productConfig) return false;

    const requiredSides = productConfig.sides;
    const undesignedSides = requiredSides.filter(side => {
      const designKey = `design-${selectedCategory}-${side.id}`;
      const savedDesign = localStorage.getItem(designKey);
      return !savedDesign || savedDesign === 'null';
    });

    return undesignedSides.length > 0;
  };

  const getAllSavedDesigns = () => {
    if (!selectedCategory) return {};
    
    const designs: { [key: string]: any } = {};
    const productConfig = productSidesConfigs.find(config => config.id === selectedCategory);
    
    if (productConfig) {
      productConfig.sides.forEach(side => {
        const designKey = `design-${selectedCategory}-${side.id}`;
        const savedDesign = localStorage.getItem(designKey);
        if (savedDesign && savedDesign !== 'null') {
          designs[designKey] = JSON.parse(savedDesign);
        }
      });
    }
    
    return designs;
  };

  const handleValidateDesign = () => {
    if (!canvas || !selectedCategory) {
      toast.error("Veuillez d'abord créer un design");
      return;
    }

    // Save current face design first
    saveCurrentDesign();

    if (hasUndesignedSides()) {
      setShowDesignPrompt(true);
      return;
    }

    // If all sides are designed or user confirms to proceed
    proceedToValidation();
  };

  const proceedToValidation = () => {
    const designs = getAllSavedDesigns();
    if (Object.keys(designs).length === 0) {
      toast.error("Aucun design n'a été créé pour ce produit");
      return;
    }
    navigate('/design-validation', { state: { designs } });
  };

  return (
    <div className="mt-6">
      <Button
        onClick={handleValidateDesign}
        className="w-full bg-green-500 hover:bg-green-600"
        size="lg"
      >
        <CheckCircle className="mr-2 h-5 w-5" />
        Valider mon design
      </Button>

      <Dialog open={showDesignPrompt} onOpenChange={setShowDesignPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Faces non designées</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Certaines faces du produit n'ont pas encore été designées. Souhaitez-vous continuer avec la validation ou designer les autres faces ?</p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowDesignPrompt(false)}
            >
              Designer les autres faces
            </Button>
            <Button
              onClick={() => {
                setShowDesignPrompt(false);
                proceedToValidation();
              }}
            >
              Valider uniquement ce design
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

