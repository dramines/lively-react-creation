import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { productSidesConfigs } from "./config/productSidesConfig";

interface ContentItem {
  id: string;
  type: 'text' | 'image';
  content: string;
  side: string;
}

interface ContentSectionProps {
  items: ContentItem[];
  onDeleteItem: (id: string) => void;
  onSelectItem: (id: string) => void;
  selectedCategory: string;
}

const ContentSection = ({ items, onDeleteItem, onSelectItem, selectedCategory }: ContentSectionProps) => {
  const getSideTitle = (sideId: string): string => {
    const productConfig = productSidesConfigs.find(config => config.id === selectedCategory);
    if (!productConfig) return sideId;
    
    const side = productConfig.sides.find(side => side.id === sideId);
    return side?.title || sideId;
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Contenu</h3>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
        {items.map((item, index) => (
  <div
    key={item.id}
    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
    onClick={() => onSelectItem(item.id)}
  >
    <div className="flex items-center space-x-2">
      <span className="text-sm truncate max-w-[200px]">
        {item.type === 'text' ? item.content : `Image ${index + 1}`}
      </span>
      <Badge variant="secondary" className="text-xs">
        {getSideTitle(item.side)}
      </Badge>
    </div>
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
      onClick={(e) => {
        e.stopPropagation();
        onDeleteItem(item.id);
      }}
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ContentSection;