import { Text } from "fabric";
import TextInput from "./text-tools/TextInput";
import FontControls from "./text-tools/FontControls";
import TextStyleControls from "./text-tools/TextStyleControls";
import TextSizeControls from "./text-tools/TextSizeControls";
import { Label } from "@/components/ui/label";

interface DesignToolsProps {
  text: string;
  setText: (text: string) => void;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  activeText: Text | null;
  canvas: Canvas | null;
  onAddText: (text: string) => void;
  selectedCategory: string | null;
  fontSize: number;
  textStyle: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    align: string;
  };
  onStyleUpdate: (property: string, value: any) => void;
}

const DesignTools = ({
  text,
  setText,
  selectedFont,
  textColor,
  activeText,
  canvas,
  onAddText,
  selectedCategory,
  fontSize,
  textStyle,
  onStyleUpdate,
}: DesignToolsProps) => {
  const isEditingEnabled = activeText !== null;

  return (
    <div className="space-y-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <TextInput
        text={text}
        setText={setText}
        activeText={activeText}
        canvas={canvas}
        onAddText={onAddText}
        selectedCategory={selectedCategory}
      />

      <FontControls
        selectedFont={selectedFont}
        textColor={textColor}
        activeText={activeText}
        onStyleUpdate={onStyleUpdate}
        isEditingEnabled={isEditingEnabled}
      />

      <div className="space-y-2">
        <Label className="text-xs font-medium text-gray-700">Style du Texte</Label>
        <TextStyleControls 
          activeText={activeText}
          textStyle={textStyle}
          onStyleUpdate={onStyleUpdate}
          disabled={!isEditingEnabled}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-gray-700">Taille du Texte</Label>
        <TextSizeControls 
          activeText={activeText}
          fontSize={fontSize}
          onSizeUpdate={(increase) => {
            const newSize = increase ? fontSize + 2 : fontSize - 2;
            if (newSize >= 8 && newSize <= 72) {
              onStyleUpdate('fontSize', newSize);
            }
          }}
          disabled={!isEditingEnabled}
        />
      </div>
    </div>
  );
};

export default DesignTools;