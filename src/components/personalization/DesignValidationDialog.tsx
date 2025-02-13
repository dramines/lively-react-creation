
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, FileText, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CartItem } from "@/types/cart";
import { toast } from "sonner";

interface DesignValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  designData: {
    productName: string;
    productType: string;
    canvasImage: string;
    textElements: Array<{
      content: string;
      font: string;
      color: string;
      size: number;
      style: {
        bold: boolean;
        italic: boolean;
        underline: boolean;
        align: string;
      };
    }>;
    uploadedImages: Array<{
      name: string;
      url: string;
    }>;
  };
}

const DesignValidationDialog = ({
  open,
  onOpenChange,
  designData,
}: DesignValidationDialogProps) => {
  const navigate = useNavigate();

  const handleRequestQuote = () => {
    const allDesigns = getAllSavedDesigns();
    const productName = localStorage.getItem('selectedProductName') || designData.productName;
    
    navigate('/devis', { 
      state: { 
        designs: allDesigns,
        productName: productName,
        selectedSize: localStorage.getItem('selectedSize') || '',
        quantity: localStorage.getItem('selectedQuantity') || '1',
        designNumber: 1
      } 
    });
  };

  const getTextStyleDescription = (style: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    align: string;
  }) => {
    const styles = [];
    if (style.bold) styles.push('Gras');
    if (style.italic) styles.push('Italique');
    if (style.underline) styles.push('Souligné');
    styles.push(`Aligné ${style.align === 'center' ? 'au centre' : style.align === 'right' ? 'à droite' : 'à gauche'}`);
    return styles.join(', ');
  };

  const downloadTextPreview = (text: string, font: string, color: string, size: number, style: any) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size - 10x larger than the actual size
    canvas.width = 1000;
    canvas.height = 200;

    // Set text properties with 10x larger size
    ctx.fillStyle = color;
    const fontWeight = style.bold ? 'bold' : 'normal';
    const fontStyle = style.italic ? 'italic' : 'normal';
    ctx.font = `${fontWeight} ${fontStyle} ${size * 10}px ${font}`;
    ctx.textAlign = style.align as CanvasTextAlign;
    ctx.textBaseline = 'middle';

    // Draw text
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    if (style.underline) {
      const textMetrics = ctx.measureText(text);
      const xStart = (canvas.width - textMetrics.width) / 2;
      ctx.beginPath();
      ctx.moveTo(xStart, canvas.height / 2 + size * 5);
      ctx.lineTo(xStart + textMetrics.width, canvas.height / 2 + size * 5);
      ctx.strokeStyle = color;
      ctx.lineWidth = size / 2;
      ctx.stroke();
    }

    // Create download link
    const link = document.createElement('a');
    link.download = `text-preview-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success("Aperçu du texte téléchargé !");
  };

  const downloadImage = (imageUrl: string, imageName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `image-${imageName}-${Date.now()}.png`;
    link.click();
    toast.success("Image téléchargée !");
  };

  // Get all saved designs from localStorage
  const getAllSavedDesigns = () => {
    const designs: { [key: string]: any } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('design-')) {
        const value = localStorage.getItem(key);
        if (value) {
          designs[key] = JSON.parse(value);
        }
      }
    }
    return designs;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Validation de votre design
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] px-1">
          <div className="space-y-6">
            {Object.entries(getAllSavedDesigns()).map(([key, design]) => (
              <div key={key} className="border-b pb-6">
                <h3 className="font-semibold mb-4">Design - {design.faceId}</h3>
                <div className="aspect-video w-full relative rounded-lg overflow-hidden border">
                  <img 
                    src={design.canvasImage} 
                    alt={`Design ${design.faceId}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  {design.textElements.map((text: any, index: number) => (
                    <div key={index} className="text-sm text-gray-600">
                      <p>Texte: {text.content}</p>
                      <p>Police: {text.font}</p>
                      <p>Couleur: {text.color}</p>
                      <p>Taille: {text.size}px</p>
                      <p>Style: {getTextStyleDescription(text.style)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2">
                  {design.uploadedImages.map((image: any, index: number) => (
                    <div key={index} className="text-sm text-gray-600">
                      <p>Image: {image.name}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => downloadImage(image.url, image.name)}
                        className="h-8 w-8"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-4 mt-6">
          <Button
            onClick={handleRequestQuote}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <FileText className="mr-2 h-4 w-4" />
            Demander un devis
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DesignValidationDialog;
