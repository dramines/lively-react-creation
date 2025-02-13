import { useState, useEffect } from "react";
import { Canvas, Text } from "fabric";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { ProductCategory, UploadedImage } from "@/components/personalization/types";
import MinimizedProductCarousel from "@/components/personalization/MinimizedProductCarousel";
import PersonalizationHero from "@/components/personalization/PersonalizationHero";
import ProcessSection from "@/components/personalization/ProcessSection";
import LoadingScreen from "@/components/LoadingScreen";
import { useIsMobile } from "@/hooks/use-mobile";
import { products } from "@/config/products";
import PersonalizationHeader from "@/components/personalization/PersonalizationHeader";
import DesignWorkspace from "@/components/personalization/DesignWorkspace";
import ProductSwitchDialog from "@/components/personalization/ProductSwitchDialog";
import { productSidesConfigs } from "@/components/personalization/config/productSidesConfig";

const Personalization = () => {
  const location = useLocation();
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [selectedFont, setSelectedFont] = useState("Montserrat");
  const [activeText, setActiveText] = useState<Text | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    location.state?.selectedProduct || null
  );
  const [contentItems, setContentItems] = useState<any[]>([]);
  const [selectedSide, setSelectedSide] = useState<string>('front');
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  const [showProductSwitch, setShowProductSwitch] = useState(false);
  const [targetProduct, setTargetProduct] = useState<string>("");

  const getCurrentSideName = (sideId: string) => {
    if (!selectedCategory) return sideId;
    const productConfig = productSidesConfigs.find(config => config.id === selectedCategory);
    if (!productConfig) return sideId;
    const side = productConfig.sides.find(side => side.id === sideId);
    return side?.title || sideId;
  };

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === selectedCategory) {
      clearDesign();
      toast.success("Zone de design réinitialisée !");
      return;
    }

    if (selectedCategory && contentItems.length > 0) {
      setTargetProduct(categoryId);
      setShowProductSwitch(true);
    } else {
      setSelectedCategory(categoryId);
      clearDesign();
    }
  };

  const clearDesign = () => {
    if (canvas) {
      canvas.clear();
      canvas.renderAll();
    }
    setContentItems([]);
    setUploadedImages([]);
    setText("");
    setActiveText(null);
    
    // Clear localStorage for the current design
    if (selectedCategory) {
      localStorage.removeItem(`design-${selectedCategory}`);
    }
    localStorage.removeItem('personalization-content');
  };

  const handleProductSwitch = () => {
    setSelectedCategory(targetProduct);
    clearDesign();
    setShowProductSwitch(false);
    toast.success("Produit changé avec succès !");
  };

  const handleBack = () => {
    setSelectedCategory(null);
    clearDesign();
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
        
        if (selectedCategory) {
          localStorage.setItem(`design-${selectedCategory}`, JSON.stringify(updatedContentItems));
        }
        localStorage.setItem('personalization-content', JSON.stringify(updatedContentItems));
      }
      
      if (activeObject.type === 'text') {
        const textContent = (activeObject as any).text;
        const updatedContentItems = contentItems.filter(item => 
          !(item.type === 'text' && item.content === textContent)
        );
        setContentItems(updatedContentItems.map(item => ({
          ...item,
          side: getCurrentSideName(item.side)
        })));
        
        if (selectedCategory) {
          localStorage.setItem(`design-${selectedCategory}`, JSON.stringify(updatedContentItems));
        }
        localStorage.setItem('personalization-content', JSON.stringify(updatedContentItems));
        
        setText('');
        setActiveText(null);
      }
      
      toast.success("Élément supprimé !");
    }
  };

  useEffect(() => {
    if (location.state?.selectedProduct) {
      setSelectedCategory(location.state.selectedProduct);
      clearDesign();
    }
  }, [location.state?.selectedProduct]);

  return (
    <div className="max-w-[100vw] overflow-x-hidden">
      {!selectedCategory && (
        <>
          <PersonalizationHero 
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
          <ProcessSection />
        </>
      )}
      
      <div className="container mx-auto py-6 px-4 lg:py-12">
        <div className="max-w-[1600px] mx-auto">
          {selectedCategory && (
            <>
              <PersonalizationHeader 
                selectedCategory={selectedCategory}
                onBack={handleBack}
              />
              
              <MinimizedProductCarousel
                products={products}
                selectedProduct={selectedCategory}
                onProductSelect={handleCategorySelect}
              />

              <DesignWorkspace
                canvas={canvas}
                setCanvas={setCanvas}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                isMobile={isMobile}
                text={text}
                setText={setText}
                selectedFont={selectedFont}
                setSelectedFont={setSelectedFont}
                onObjectDelete={handleDeleteActiveObject}
              />

              <ProductSwitchDialog
                open={showProductSwitch}
                onOpenChange={setShowProductSwitch}
                currentProduct={products.find(p => p.id === selectedCategory)?.name || ""}
                targetProduct={products.find(p => p.id === targetProduct)?.name || ""}
                onConfirm={handleProductSwitch}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Personalization;
