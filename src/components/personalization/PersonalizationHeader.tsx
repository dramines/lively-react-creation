import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PersonalizationHeaderProps {
  selectedCategory: string | null;
  onBack: () => void;
}

const PersonalizationHeader = ({ selectedCategory, onBack }: PersonalizationHeaderProps) => {
  if (!selectedCategory) return null;

  return (
    <div className="mb-8">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4 text-primary hover:text-primary/80"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux produits
      </Button>
      <h1 className="text-3xl font-bold text-primary text-center">
        Personnalisation de votre produit
      </h1>
      <p className="text-center text-gray-600 mt-2">
        Créez votre design unique
      </p>
    </div>
  );
};

export default PersonalizationHeader;