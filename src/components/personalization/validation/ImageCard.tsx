import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";

interface UploadedImage {
  name: string;
  url: string;
}

interface ImageCardProps {
  image: UploadedImage;
  onDownload: (imageUrl: string, imageName: string) => void;
}

const ImageCard = ({ image, onDownload }: ImageCardProps) => {
  return (
    <Card className="p-4 border border-gray-100 hover:border-primary/20 transition-colors">
      <div className="aspect-square w-full mb-3">
        <img 
          src={image.url} 
          alt={image.name}
          className="w-full h-full object-contain rounded-lg border"
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{image.name}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDownload(image.url, image.name)}
          className="hover:bg-primary/5"
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger
        </Button>
      </div>
    </Card>
  );
};

export default ImageCard;