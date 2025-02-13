import { useLocation } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DesignApiPayload } from '@/types/design';

const DesignSummary = () => {
  const location = useLocation();
  const designData = location.state?.designData as DesignApiPayload;

  if (!designData) {
    return <div>No design data available</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Résumé de la Commande</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Designs</h2>
          <ScrollArea className="h-[400px]">
            {Object.entries(designData.designs).map(([key, design]) => (
              <div key={key} className="mb-6 border-b pb-4">
                <h3 className="font-medium mb-2">Face: {design.faceId}</h3>
                <img 
                  src={design.canvasImage} 
                  alt={`Design ${design.faceId}`}
                  className="w-full max-w-md rounded-lg shadow-sm mb-4"
                />
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Textes:</h4>
                    {design.textElements.map((text, idx) => (
                      <div key={idx} className="text-sm text-gray-600 mb-2">
                        <p>Contenu: {text.content}</p>
                        <p>Police: {text.font}</p>
                        <p>Couleur: {text.color}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Images:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {design.uploadedImages.map((img, idx) => (
                        <div key={idx}>
                          <img 
                            src={img.url} 
                            alt={img.name}
                            className="w-full rounded-md"
                          />
                          <p className="text-sm text-gray-600 mt-1">{img.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quantités par Taille</h2>
          <div className="space-y-4">
            {Object.entries(designData.sizeQuantities).map(([size, quantity]) => (
              <div key={size} className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">{size}</span>
                <span className="text-gray-600">{quantity} unités</span>
              </div>
            ))}
            <div className="pt-4">
              <div className="flex justify-between items-center font-semibold">
                <span>Total</span>
                <span>{designData.totalQuantity} unités</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DesignSummary;