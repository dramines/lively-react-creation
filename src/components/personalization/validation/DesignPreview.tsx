
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";
import TextElementCard from "./TextElementCard";
import ImageCard from "./ImageCard";
import { products } from "@/config/products";
import { productSidesConfigs } from "../config/productSidesConfig";

interface DesignPreviewProps {
  design: any;
  onDownloadText: (text: any) => void;
  onDownloadImage: (imageUrl: string, imageName: string) => void;
}

const DesignPreview = ({ design, onDownloadText, onDownloadImage }: DesignPreviewProps) => {
  console.log("Design in preview:", design); // Debug log

  // Find the product details
  const product = products.find(p => p.id === design.productId);
  if (!product) return null;

  // Find the product side configuration
  const productConfig = productSidesConfigs.find(config => config.id === design.productId);
  const side = productConfig?.sides.find(side => side.id === design.faceId);
  if (!side) return null;
  
  const sideName = side.title || design.faceId;

  // Handle empty design case
  if (design.isEmpty) {
    return (
      <Card className="p-6 mb-6 border-none shadow-lg bg-white/80 backdrop-blur-sm">
        <div className="space-y-4 mb-6">
          <h3 className="text-xl font-semibold text-primary">
            Design - {sideName}
          </h3>
          <div className="text-center py-8 text-gray-500">
            <p>Aucun design n'a été créé pour cette face.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-6 border-none shadow-lg bg-white/80 backdrop-blur-sm">
      <div className="space-y-4 mb-6">
        <h3 className="text-xl font-semibold text-primary">
          Design - {sideName}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <p><span className="font-medium">Produit:</span> {product.name}</p>
          <p><span className="font-medium">Face:</span> {sideName}</p>
          {product.description && (
            <p className="text-xs italic">{product.description}</p>
          )}
        </div>
      </div>
      
      {design.canvasImage && (
        <div className="aspect-video w-full relative rounded-lg overflow-hidden border mb-6 bg-white shadow-inner">
          <img 
            src={design.canvasImage} 
            alt={`Design ${sideName}`}
            className="w-full h-full object-contain"
          />
        </div>
      )}

      <div className="space-y-6">
        {design.textElements && design.textElements.length > 0 && (
          <div>
            <h4 className="font-medium mb-4 text-primary flex items-center gap-2">
              <span className="p-1 rounded-full bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </span>
              Éléments de texte
            </h4>
            <div className="grid gap-4">
              {design.textElements.map((text: any, index: number) => (
                <TextElementCard 
                  key={index} 
                  text={text} 
                  onDownload={() => onDownloadText(text)}
                />
              ))}
            </div>
          </div>
        )}

        {design.uploadedImages && design.uploadedImages.length > 0 && (
          <div>
            <h4 className="font-medium mb-4 text-primary flex items-center gap-2">
              <span className="p-1 rounded-full bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </span>
              Images
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {design.uploadedImages.map((image: any, index: number) => (
                <ImageCard
                  key={index}
                  image={image}
                  onDownload={onDownloadImage}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DesignPreview;

