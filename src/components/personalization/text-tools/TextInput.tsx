import { Plus, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Text } from "fabric";
import { toast } from "sonner";

interface TextInputProps {
  text: string;
  setText: (text: string) => void;
  activeText: Text | null;
  canvas: Canvas | null;
  onAddText: (text: string) => void;
  selectedCategory: string | null;
}

const TextInput = ({
  text,
  setText,
  activeText,
  canvas,
  onAddText,
  selectedCategory,
}: TextInputProps) => {
  const handleTextInput = (value: string) => {
    if (value.length <= 30) {
      setText(value);
      if (activeText) {
        activeText.set('text', value);
        canvas?.renderAll();
      }
    }
  };

  const handleAddOrUpdateText = () => {
    if (!selectedCategory) {
      toast.error("Veuillez sélectionner un produit d'abord");
      return;
    }

    if (text.trim()) {
      if (activeText) {
        activeText.set('text', text);
        canvas?.renderAll();
        setText('');
        toast.success("Texte mis à jour avec succès !");
      } else {
        onAddText(text);
        toast.success("Texte ajouté avec succès !");
      }
    } else {
      toast.error("Veuillez entrer du texte avant d'ajouter");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-gray-700">
          {activeText ? "Modifier le texte" : "Ajouter un texte"}
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Info className="h-4 w-4 text-gray-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent 
              className="bg-white border border-gray-200 shadow-lg p-4 rounded-lg max-w-[300px] z-50"
              sideOffset={5}
            >
              <div className="space-y-2 text-gray-700">
                <p className="font-medium">Comment utiliser le texte :</p>
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  <li>Tapez votre texte (max 30 caractères)</li>
                  <li>Personnalisez le style avant d'ajouter</li>
                  <li>Cliquez sur + pour ajouter</li>
                  <li>Cliquez sur un texte existant pour le modifier</li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => handleTextInput(e.target.value)}
          placeholder={text ? undefined : "Tapez votre texte... (max 30 caractères)"}
          className="flex-1 h-9 text-sm"
          maxLength={30}
          disabled={!selectedCategory}
        />
        <Button
          onClick={handleAddOrUpdateText}
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0"
          disabled={!selectedCategory}
        >
          {activeText ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default TextInput;