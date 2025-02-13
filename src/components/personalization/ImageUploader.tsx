
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import { toast } from "sonner";
import { Canvas } from "fabric";

interface ImageUploaderProps {
  canvas: Canvas | null;
  selectedCategory: string | null;
  onImageUpload: (file: File) => void;
}

const ImageUploader = ({ canvas, onImageUpload, selectedCategory }: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCategory) {
      toast.error("Veuillez sélectionner un produit d'abord");
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    onImageUpload(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Ajouter une Image</Label>
      <div className="flex flex-col gap-2">
        <Input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
          disabled={!selectedCategory}
        />
        <Button 
          onClick={() => {
            if (!selectedCategory) {
              toast.error("Veuillez sélectionner un produit d'abord");
              return;
            }
            fileInputRef.current?.click();
          }}
          className="w-full"
          variant="secondary"
          disabled={!selectedCategory}
        >
          <Upload className="h-4 w-4 mr-2" />
          Télécharger une Image
        </Button>
      </div>
    </div>
  );
};

export default ImageUploader;

