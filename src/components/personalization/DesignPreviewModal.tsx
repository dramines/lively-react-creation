
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, ZoomIn, ZoomOut } from "lucide-react";
import { toast } from "sonner";

interface DesignPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  designImage: string | null;
}

const DesignPreviewModal = ({
  open,
  onOpenChange,
  designImage
}: DesignPreviewModalProps) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleDownload = () => {
    if (!designImage) return;

    // Create a temporary canvas to manipulate the image
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Set canvas dimensions to match the image
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      
      if (tempCtx) {
        // Draw the image
        tempCtx.drawImage(img, 0, 0);
        
        // Get the data URL without the customization zones
        const finalImage = tempCanvas.toDataURL('image/png');
        
        // Create download link
        const link = document.createElement("a");
        link.download = "my-design.png";
        link.href = finalImage;
        link.click();
        toast.success("Design téléchargé !");
      }
    };
    
    img.src = designImage;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-2 p-4 bg-white/50 backdrop-blur-sm border-b">
          <h2 className="text-lg font-semibold text-gray-900">Prévisualisation du design</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleZoomOut}
              className="hover:bg-gray-100 transition-colors"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleZoomIn}
              className="hover:bg-gray-100 transition-colors"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleDownload}
              className="hover:bg-gray-100 transition-colors"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="overflow-auto max-h-[80vh]">
          <div className="flex items-center justify-center min-h-[60vh] p-8">
            {designImage && (
              <div className="relative rounded-lg overflow-hidden shadow-xl bg-white">
                <img
                  src={designImage}
                  alt="Design Preview"
                  className="transition-transform duration-300 ease-out max-w-full h-auto"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DesignPreviewModal;

