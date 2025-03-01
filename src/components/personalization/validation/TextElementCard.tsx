import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface TextStyle {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  align: string;
}

interface TextElement {
  content: string;
  font: string;
  color: string;
  size: number;
  style: TextStyle;
}

interface TextElementCardProps {
  text: TextElement;
  onDownload: (text: TextElement) => void;
}

const getTextStyleDescription = (style: TextStyle) => {
  const styles = [];
  if (style.bold) styles.push('Gras');
  if (style.italic) styles.push('Italique');
  if (style.underline) styles.push('Souligné');
  styles.push(`Aligné ${style.align === 'center' ? 'au centre' : style.align === 'right' ? 'à droite' : 'à gauche'}`);
  return styles.join(', ');
};

const TextElementCard = ({ text, onDownload }: TextElementCardProps) => {
  return (
    <Card className="p-4 border border-gray-100 hover:border-primary/20 transition-colors">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="font-medium">{text.content}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{text.font}</Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: text.color }} />
              {text.color}
            </Badge>
            <Badge variant="outline">{text.size}px</Badge>
          </div>
          <p className="text-sm text-gray-600">
            {getTextStyleDescription(text.style)}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDownload(text)}
          className="hover:bg-primary/5"
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger l'aperçu
        </Button>
      </div>
    </Card>
  );
};

export default TextElementCard;