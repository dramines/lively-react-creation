import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "fabric";

interface TextSizeControlsProps {
  activeText: Text | null;
  fontSize: number;
  onSizeUpdate: (increase: boolean) => void;
  disabled?: boolean;
}

const TextSizeControls = ({ activeText, fontSize, onSizeUpdate, disabled }: TextSizeControlsProps) => {
  return (
    <div className="flex gap-2 items-center">
      <Button 
        onClick={() => onSizeUpdate(false)} 
        size="icon" 
        variant="outline"
        className={`h-8 w-8 ${disabled ? 'opacity-50' : ''}`}
        disabled={disabled}
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium">{fontSize}px</span>
      <Button 
        onClick={() => onSizeUpdate(true)} 
        size="icon" 
        variant="outline"
        className={`h-8 w-8 ${disabled ? 'opacity-50' : ''}`}
        disabled={disabled}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TextSizeControls;