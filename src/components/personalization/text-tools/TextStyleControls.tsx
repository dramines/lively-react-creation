import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Text } from "fabric";

interface TextStyleControlsProps {
  activeText: Text | null;
  textStyle: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    align: string;
  };
  onStyleUpdate: (property: string, value: any) => void;
  disabled?: boolean;
}

const TextStyleControls = ({ activeText, textStyle, onStyleUpdate, disabled }: TextStyleControlsProps) => {
  console.log('Current text styles:', textStyle);
  
  return (
    <div className="flex gap-2">
      <ToggleGroup type="multiple" className={`justify-start bg-gray-50 p-1 rounded-md ${disabled ? 'opacity-50' : ''}`}>
        <ToggleGroupItem 
          value="bold" 
          aria-label="Toggle bold"
          onClick={() => !disabled && onStyleUpdate('fontWeight', textStyle.bold ? 'normal' : 'bold')}
          className={`h-8 w-8 p-0 transition-colors ${
            textStyle.bold 
              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
              : 'hover:bg-gray-100'
          }`}
          data-state={textStyle.bold ? 'on' : 'off'}
          disabled={disabled}
        >
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="italic" 
          aria-label="Toggle italic"
          onClick={() => !disabled && onStyleUpdate('fontStyle', textStyle.italic ? 'normal' : 'italic')}
          className={`h-8 w-8 p-0 transition-colors ${
            textStyle.italic 
              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
              : 'hover:bg-gray-100'
          }`}
          data-state={textStyle.italic ? 'on' : 'off'}
          disabled={disabled}
        >
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="underline" 
          aria-label="Toggle underline"
          onClick={() => !disabled && onStyleUpdate('underline', !textStyle.underline)}
          className={`h-8 w-8 p-0 transition-colors ${
            textStyle.underline 
              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
              : 'hover:bg-gray-100'
          }`}
          data-state={textStyle.underline ? 'on' : 'off'}
          disabled={disabled}
        >
          <Underline className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup 
        type="single" 
        className={`justify-start bg-gray-50 p-1 rounded-md ${disabled ? 'opacity-50' : ''}`}
        value={textStyle.align}
        onValueChange={(value) => !disabled && value && onStyleUpdate('textAlign', value)}
        disabled={disabled}
      >
        <ToggleGroupItem 
          value="left" 
          aria-label="Align left"
          className={`h-8 w-8 p-0 transition-colors ${
            textStyle.align === 'left' 
              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
              : 'hover:bg-gray-100'
          }`}
          disabled={disabled}
        >
          <AlignLeft className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="center" 
          aria-label="Align center"
          className={`h-8 w-8 p-0 transition-colors ${
            textStyle.align === 'center' 
              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
              : 'hover:bg-gray-100'
          }`}
          disabled={disabled}
        >
          <AlignCenter className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="right" 
          aria-label="Align right"
          className={`h-8 w-8 p-0 transition-colors ${
            textStyle.align === 'right' 
              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
              : 'hover:bg-gray-100'
          }`}
          disabled={disabled}
        >
          <AlignRight className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default TextStyleControls;