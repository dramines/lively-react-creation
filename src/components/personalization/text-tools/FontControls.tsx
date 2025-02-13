import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Text } from "fabric";

interface FontControlsProps {
  selectedFont: string;
  textColor: string;
  activeText: Text | null;
  onStyleUpdate: (property: string, value: any) => void;
  isEditingEnabled: boolean;
}

const FontControls = ({
  selectedFont,
  textColor,
  activeText,
  onStyleUpdate,
  isEditingEnabled
}: FontControlsProps) => {
  const fonts = [
    { name: "Montserrat", value: "Montserrat" },
    { name: "Open Sans", value: "Open Sans" },
    { name: "Roboto", value: "Roboto" },
    { name: "Lato", value: "Lato" },
    { name: "Oswald", value: "Oswald" },
    { name: "Playfair Display", value: "Playfair Display" },
    { name: "Poppins", value: "Poppins" }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-2">
        <Label className="text-xs font-medium text-gray-700">Police</Label>
        <Select 
          value={selectedFont} 
          onValueChange={(value) => onStyleUpdate('fontFamily', value)}
          disabled={!isEditingEnabled}
        >
          <SelectTrigger className={`h-9 text-sm bg-transparent ${!isEditingEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <SelectValue placeholder="Choisir une police" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {fonts.map((font) => (
              <SelectItem 
                key={font.value} 
                value={font.value}
                style={{ fontFamily: font.value }}
                className="text-sm"
              >
                {font.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-gray-700">Couleur</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={textColor}
            onChange={(e) => onStyleUpdate('fill', e.target.value)}
            className={`w-full h-9 p-1 cursor-pointer ${!isEditingEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isEditingEnabled}
          />
        </div>
      </div>
    </div>
  );
};

export default FontControls;