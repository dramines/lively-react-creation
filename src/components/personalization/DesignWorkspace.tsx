import { useState, useEffect } from "react";
import { Canvas, Text as FabricText, Image as FabricImage } from "fabric";
import { toast } from "sonner";
import { ProductCategory, UploadedImage } from "@/components/personalization/types";
import { useDesignState } from "@/components/personalization/hooks/useDesignState";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { productZoneConfigs } from "@/components/personalization/config/zoneConfig";
import { products } from "@/config/products";
import DesignTools from "./DesignTools";
import ImageUploader from "./ImageUploader";
import UploadedImagesList from "./UploadedImagesList";
import CanvasContainer from "./CanvasContainer";
import ContentSection from "./ContentSection";
import ProductSwitchDialog from "./ProductSwitchDialog";
import { DesignValidationHandler } from "./design-validation/DesignValidationHandler";
import DesignPreviewModal from "./DesignPreviewModal";

interface DesignWorkspaceProps {
  canvas: Canvas | null;
  setCanvas: (canvas: Canvas | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string) => void;
  isMobile: boolean;
  text: string;
  setText: (text: string) => void;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  onObjectDelete: () => void;
}

const DesignWorkspace = ({
  canvas,
  setCanvas,
  selectedCategory,
  setSelectedCategory,
  isMobile,
  text,
  setText,
  selectedFont,
  setSelectedFont,
  onObjectDelete,
}: DesignWorkspaceProps) => {
  const {
    textColor,
    setTextColor,
    activeText,
    setActiveText,
    uploadedImages,
    setUploadedImages,
    contentItems,
    setContentItems,
    selectedSide,
    setSelectedSide,
    fontSize,
    setFontSize,
    textStyle,
    setTextStyle
  } = useDesignState();

  const [showProductSwitch, setShowProductSwitch] = useState(false);
  const [targetProduct, setTargetProduct] = useState<string>("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handlePreviewClick = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2
    });
    setPreviewImage(dataURL);
    setPreviewOpen(true);
  };

  const handleClearDesigns = () => {
    if (!canvas) return;
    
    // Store the background image and customization zone
    const backgroundImage = canvas.backgroundImage;
    const zoneObject = canvas.getObjects().find(obj => 
      obj.type === 'rect' && !obj.selectable && !obj.evented
    );
    
    // Clear only content objects (not background or zone)
    const objects = canvas.getObjects();
    objects.forEach(obj => {
      if (obj !== backgroundImage && obj !== zoneObject) {
        canvas.remove(obj);
      }
    });
    
    // Clear localStorage designs
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('design-')) {
        localStorage.removeItem(key);
      }
    });
    
    setText('');
    setActiveText(null);
    setUploadedImages([]);
    setContentItems([]);
    
    canvas.renderAll();
    toast.success("Design précédent effacé !");
  };

  const handleDeleteActiveObject = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
      
      if (activeObject.type === 'image') {
        const imageUrl = (activeObject as any)._element?.src;
        const updatedImages = uploadedImages.filter(img => img.url !== imageUrl);
        setUploadedImages(updatedImages);
        
        const updatedContentItems = contentItems.filter(item => 
          !(item.type === 'image' && item.content === imageUrl)
        );
        setContentItems(updatedContentItems);
      }
      
      if (activeObject.type === 'text') {
        const textContent = (activeObject as any).text;
        const updatedContentItems = contentItems.filter(item => 
          !(item.type === 'text' && item.content === textContent)
        );
        setContentItems(updatedContentItems);
        setText('');
        setActiveText(null);
      }
      
      toast.success("Élément supprimé !");
    }
  };

  const centerObjectInZone = (object: any, selectedCategory: string | null, selectedSide: string) => {
    if (!object || !selectedCategory) return;
    
    const zoneConfig = productZoneConfigs.find(config => config.id === selectedCategory);
    if (!zoneConfig) return;

    const face = zoneConfig.faces.find(face => face.sideId === selectedSide);
    if (!face?.zone) return;

    const zone = face.zone;

    // Calculate center position of the zone
    const centerX = zone.left + (zone.width / 2);
    const centerY = zone.top + (zone.height / 2);

    // Get object dimensions
    const objWidth = object.getScaledWidth();
    const objHeight = object.getScaledHeight();

    // Set object position to center of zone with proper offset
    object.set({
      left: centerX - (objWidth / 2),
      top: centerY - (objHeight / 2),
      originX: 'left',
      originY: 'top'
    });

    // Ensure the object stays within zone boundaries
    const objBounds = object.getBoundingRect();
    if (objBounds.left < zone.left) {
      object.set('left', zone.left);
    }
    if (objBounds.top < zone.top) {
      object.set('top', zone.top);
    }
    if (objBounds.left + objBounds.width > zone.left + zone.width) {
      object.set('left', zone.left + zone.width - objBounds.width);
    }
    if (objBounds.top + objBounds.height > zone.top + zone.height) {
      object.set('top', zone.top + zone.height - objBounds.height);
    }

    object.setCoords();
    canvas?.renderAll();
  };

  const handleProductSwitch = () => {
    setSelectedCategory(targetProduct);
    setContentItems([]);
    setUploadedImages([]);
    setText("");
    setActiveText(null);
    if (canvas) {
      canvas.clear();
      canvas.renderAll();
    }
    setShowProductSwitch(false);
    toast.success("Produit changé avec succès !");
  };

  useEffect(() => {
    if (!canvas) return;

    // Add event listeners for object selection
    canvas.on('selection:created', (e) => {
      const selectedObject = e.selected?.[0];
      if (selectedObject?.type === 'text') {
        const textObject = selectedObject as FabricText;
        setActiveText(textObject);
        setText(textObject.text || '');
        setFontSize(textObject.fontSize || 16);
        setTextColor(textObject.fill?.toString() || '#000000');
        setSelectedFont(textObject.fontFamily || 'Montserrat');
        setTextStyle({
          bold: textObject.fontWeight === 'bold',
          italic: textObject.fontStyle === 'italic',
          underline: textObject.underline || false,
          align: textObject.textAlign || 'center'
        });
      }
    });

    canvas.on('selection:cleared', () => {
      setActiveText(null);
      setText('');
    });

    // Cleanup event listeners
    return () => {
      canvas.off('selection:created');
      canvas.off('selection:cleared');
    };
  }, [canvas, setActiveText, setText, setFontSize, setTextColor, setSelectedFont, setTextStyle]);

  const handleStyleUpdate = (property: string, value: any) => {
    if (!activeText || !canvas) return;

    switch (property) {
      case 'fontSize':
        activeText.set('fontSize', value);
        setFontSize(value);
        break;
      case 'fontFamily':
        activeText.set('fontFamily', value);
        setSelectedFont(value);
        break;
      case 'fill':
        activeText.set('fill', value);
        setTextColor(value);
        break;
      case 'fontWeight':
        activeText.set('fontWeight', value);
        setTextStyle(prev => ({ ...prev, bold: value === 'bold' }));
        break;
      case 'fontStyle':
        activeText.set('fontStyle', value);
        setTextStyle(prev => ({ ...prev, italic: value === 'italic' }));
        break;
      case 'underline':
        activeText.set('underline', value);
        setTextStyle(prev => ({ ...prev, underline: value }));
        break;
      case 'textAlign':
        activeText.set('textAlign', value);
        setTextStyle(prev => ({ ...prev, align: value }));
        break;
    }
    canvas.renderAll();
  };

  const handleImageUpload = (file: File) => {
    if (!canvas || !selectedCategory) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target?.result as string;
      
      // Get the current zone configuration
      const zoneConfig = productZoneConfigs.find(config => config.id === selectedCategory);
      const currentZone = zoneConfig?.faces.find(face => face.sideId === selectedSide)?.zone;
      
      if (!currentZone) {
        toast.error("Zone de personnalisation non trouvée");
        return;
      }
      
      FabricImage.fromURL(imgUrl, {
        crossOrigin: 'anonymous'
      }).then((img) => {
        // Calculate the maximum dimensions based on a percentage of the zone size
        // Use 50% of the zone size as the maximum dimension
        const maxWidth = currentZone.width * 0.5;
        const maxHeight = currentZone.height * 0.5;
        
        // Calculate scale to fit within the maximum dimensions while maintaining aspect ratio
        const scaleX = maxWidth / img.width!;
        const scaleY = maxHeight / img.height!;
        const scale = Math.min(scaleX, scaleY);
        
        // Apply the scale
        img.scale(scale);
        
        // Center the image in the zone
        const centerX = currentZone.left + (currentZone.width / 2);
        const centerY = currentZone.top + (currentZone.height / 2);
        
        img.set({
          left: centerX,
          top: centerY,
          originX: 'center',
          originY: 'center',
        });
        
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();

        const newImage: UploadedImage = {
          id: Date.now().toString(),
          name: file.name,
          url: imgUrl,
        };
        setUploadedImages([...uploadedImages, newImage]);
        
        // Add to content items
        const newItem = {
          id: Date.now().toString(),
          type: 'image' as const,
          content: imgUrl,
          side: selectedSide
        };
        setContentItems([...contentItems, newItem]);
        
        toast.success("Image ajoutée avec succès !");
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAddText = (newText: string) => {
    if (!canvas || !selectedCategory) return;

    const fabricText = new FabricText(newText, {
      fontSize: fontSize,
      fill: textColor,
      fontFamily: selectedFont,
      fontWeight: textStyle.bold ? 'bold' : 'normal',
      fontStyle: textStyle.italic ? 'italic' : 'normal',
      underline: textStyle.underline,
      textAlign: textStyle.align as any,
      originX: 'center',
      originY: 'center',
      hasControls: true,
      hasBorders: true,
      lockUniScaling: false,
      transparentCorners: false,
      cornerColor: 'rgba(102,153,255,0.5)',
      cornerSize: 12,
      padding: 5
    });

    canvas.add(fabricText);
    centerObjectInZone(fabricText, selectedCategory, selectedSide);
    canvas.setActiveObject(fabricText);
    canvas.renderAll();

    const newItem = {
      id: Date.now().toString(),
      type: 'text' as const,
      content: newText,
      side: selectedSide
    };
    setContentItems([...contentItems, newItem]);
    setText('');
    toast.success("Texte ajouté avec succès !");
  };

  const handleImageClick = (image: UploadedImage) => {
    if (!canvas) return;
    const obj = canvas.getObjects().find(
      (obj) => obj.type === "image" && (obj as any)._element?.src === image.url
    );
    if (obj) {
      canvas.setActiveObject(obj);
      canvas.renderAll();
    }
  };

  const handleOpacityChange = (image: UploadedImage, opacity: number) => {
    if (!canvas) return;
    const obj = canvas.getObjects().find(
      (obj) => obj.type === "image" && (obj as any)._element?.src === image.url
    );
    if (obj) {
      obj.set("opacity", opacity);
      canvas.renderAll();
    }
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = contentItems.find(item => item.id === id);
    if (itemToDelete) {
      if (!canvas) return;
      
      const objectToDelete = canvas.getObjects().find(obj => {
        if (itemToDelete.type === 'text') {
          return obj.type === 'text' && (obj as any).text === itemToDelete.content;
        } else {
          return obj.type === 'image' && (obj as any)._element?.src.includes(itemToDelete.content);
        }
      });

      if (objectToDelete) {
        canvas.setActiveObject(objectToDelete);
        canvas.renderAll();
        handleDeleteActiveObject();
      }
      
      setContentItems(contentItems.filter(item => item.id !== id));
    }
  };

  const handleSelectItem = (id: string) => {
    if (!canvas) return;
    const item = contentItems.find(i => i.id === id);
    if (!item) return;

    const fabricObject = canvas.getObjects().find(obj => {
      if (item.type === 'text') {
        return obj.type === 'text' && (obj as any).text === item.content;
      } else {
        return obj.type === 'image' && (obj as any)._element?.src.includes(item.content);
      }
    });

    if (fabricObject) {
      canvas.setActiveObject(fabricObject);
      canvas.renderAll();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
      <div className="lg:col-span-3 space-y-4">
        <Card className="p-4 lg:p-6">
          <Button 
            onClick={handlePreviewClick} 
            className="w-full mb-4"
            variant="outline"
          >
            <Eye className="mr-2 h-4 w-4" />
            Prévisualiser le design
          </Button>

          <DesignTools
            text={text}
            setText={setText}
            selectedFont={selectedFont}
            setSelectedFont={setSelectedFont}
            textColor={textColor}
            setTextColor={setTextColor}
            activeText={activeText}
            canvas={canvas}
            onAddText={handleAddText}
            selectedCategory={selectedCategory}
            fontSize={fontSize}
            textStyle={textStyle}
            onStyleUpdate={handleStyleUpdate}
          />
          
          <ImageUploader
            canvas={canvas}
            onImageUpload={handleImageUpload}
            selectedCategory={selectedCategory}
          />
          
          <UploadedImagesList
            images={uploadedImages}
            canvas={canvas}
            onImageClick={handleImageClick}
            onOpacityChange={handleOpacityChange}
            onDeleteImage={handleDeleteActiveObject}
          />
        </Card>
      </div>

      <div className="lg:col-span-6">
        <CanvasContainer
          canvas={canvas}
          setCanvas={setCanvas}
          isMobile={isMobile}
          selectedCategory={selectedCategory}
          selectedSide={selectedSide}
          onSideSelect={setSelectedSide}
          text={text}
          selectedFont={selectedFont}
          onObjectDelete={onObjectDelete}
        />
        
        <DesignValidationHandler 
          canvas={canvas}
          selectedCategory={selectedCategory}
          selectedSide={selectedSide}
        />
      </div>

      <div className="lg:col-span-3">
        <ContentSection
          items={contentItems}
          onDeleteItem={handleDeleteItem}
          onSelectItem={handleSelectItem}
          selectedCategory={selectedCategory}
        />
      </div>

      <ProductSwitchDialog
        open={showProductSwitch}
        onOpenChange={setShowProductSwitch}
        currentProduct={products.find(p => p.id === selectedCategory)?.name || ""}
        targetProduct={products.find(p => p.id === targetProduct)?.name || ""}
        onConfirm={handleProductSwitch}
      />

      <DesignPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        designImage={previewImage}
      />
    </div>
  );
};

export default DesignWorkspace;
