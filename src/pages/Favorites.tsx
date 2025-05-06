
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SavedDesign {
  id: string;
  productName: string;
  date: string;
  designs: {
    [key: string]: {
      canvasImage: string;
      faceId: string;
    };
  };
}

const Favorites = () => {
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSavedDesigns = () => {
      const favoritesStr = localStorage.getItem('favorites');
      if (favoritesStr) {
        try {
          const favorites = JSON.parse(favoritesStr);
          // Filter out duplicates based on product name and designs
          const uniqueDesigns = favorites.reduce((acc: SavedDesign[], current: SavedDesign) => {
            const x = acc.find(item => 
              item.productName === current.productName && 
              JSON.stringify(item.designs) === JSON.stringify(current.designs)
            );
            if (!x) {
              return acc.concat([current]);
            }
            return acc;
          }, []);
          setSavedDesigns(uniqueDesigns);
          // Update localStorage with deduplicated list
          localStorage.setItem('favorites', JSON.stringify(uniqueDesigns));
        } catch (error) {
          console.error('Error parsing favorites:', error);
          setSavedDesigns([]);
        }
      }
    };

    loadSavedDesigns();
  }, []);

  const handleDelete = (id: string) => {
    const updatedDesigns = savedDesigns.filter(design => design.id !== id);
    setSavedDesigns(updatedDesigns);
    localStorage.setItem('favorites', JSON.stringify(updatedDesigns));
    toast.success("Design supprimé des favoris");
  };

  const handleContinueDesign = (design: SavedDesign) => {
    // Restore the design state
    Object.entries(design.designs).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
    navigate('/design-validation');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 hover:bg-gray-100"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <h1 className="text-3xl font-bold mb-8">Mes Designs Favoris</h1>

      {savedDesigns.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Aucun design sauvegardé pour le moment
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedDesigns.map((design) => (
            <Card key={design.id} className="p-4 space-y-4">
              <div className="aspect-video relative rounded-lg overflow-hidden border">
                {Object.values(design.designs)[0]?.canvasImage && (
                  <img
                    src={Object.values(design.designs)[0].canvasImage}
                    alt={design.productName}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">{design.productName}</h3>
                <p className="text-sm text-gray-500">
                  Sauvegardé le {new Date(design.date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleContinueDesign(design)}
                >
                  Continuer
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(design.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
