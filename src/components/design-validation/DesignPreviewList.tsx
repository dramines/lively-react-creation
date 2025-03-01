
import { FaceDesign } from "@/components/personalization/types/faceDesign";
import DesignPreview from "@/components/personalization/validation/DesignPreview";
import { productSidesConfigs } from "@/components/personalization/config/productSidesConfig";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

interface DesignPreviewListProps {
  designs: { [key: string]: FaceDesign };
  onDownloadText: (text: any) => void;
  onDownloadImage: (imageUrl: string, imageName: string) => void;
}

const DesignPreviewList = ({ designs, onDownloadText, onDownloadImage }: DesignPreviewListProps) => {
  const [allSidesDesigns, setAllSidesDesigns] = useState<Array<{key: string; design: any}>>([]);
  const [defaultTab, setDefaultTab] = useState<string>("");

  useEffect(() => {
    if (!designs || Object.keys(designs).length === 0) return;

    // Get the product ID from the first design's key (they all share the same product)
    const firstDesignKey = Object.keys(designs)[0];
    const productId = firstDesignKey.split('-')[1];
    
    // Get the product configuration to know all available sides
    const productConfig = productSidesConfigs.find(config => config.id === productId);
    
    if (!productConfig) return;

    // Create a list of all possible sides for this product
    const sidesDesigns = productConfig.sides.map(side => {
      const designKey = `design-${productId}-${side.id}`;
      const existingDesign = designs[designKey];
      
      // Return both empty and non-empty designs
      return {
        key: designKey,
        design: {
          ...(existingDesign || {
            faceId: side.id,
            canvasImage: '',
            textElements: [],
            uploadedImages: [],
            isEmpty: true
          }),
          productId,
          faceTitle: side.title
        }
      };
    });

    console.log("Processed sides designs:", sidesDesigns); // Debug log
    setAllSidesDesigns(sidesDesigns);
    if (sidesDesigns.length > 0) {
      setDefaultTab(sidesDesigns[0].design.faceId);
    }
  }, [designs]);

  if (!designs || Object.keys(designs).length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-yellow-600">
          <AlertTriangle className="h-5 w-5" />
          <p>Ce produit ne contient aucun design.</p>
        </div>
      </Card>
    );
  }

  console.log("Current designs object:", designs); // Debug log
  console.log("All sides designs state:", allSidesDesigns); // Debug log

  if (allSidesDesigns.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-yellow-600">
          <AlertTriangle className="h-5 w-5" />
          <p>Configuration du produit introuvable.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-white/50 backdrop-blur-sm">
            {allSidesDesigns.map(({ design }) => (
              <TabsTrigger 
                key={design.faceId} 
                value={design.faceId}
                className="flex-1"
              >
                {design.faceTitle || design.faceId}
              </TabsTrigger>
            ))}
          </TabsList>

          {allSidesDesigns.map(({ key, design }) => (
            <TabsContent key={design.faceId} value={design.faceId}>
              <DesignPreview
                key={key}
                design={design}
                onDownloadText={onDownloadText}
                onDownloadImage={onDownloadImage}
              />
            </TabsContent>
          ))}
        </Tabs>
      </ScrollArea>
    </div>
  );
};

export default DesignPreviewList;
