import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Type, Image as ImageIcon, Home, CheckCircle2 } from "lucide-react";
import { products } from "@/config/products";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { productSidesConfigs } from "@/components/personalization/config/productSidesConfig";

const LoadingDots = () => (
  <span className="inline-flex space-x-1">
    <motion.span
      className="h-2 w-2 bg-white rounded-full"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.2 }}
    />
    <motion.span
      className="h-2 w-2 bg-white rounded-full"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.2, delay: 0.2 }}
    />
    <motion.span
      className="h-2 w-2 bg-white rounded-full"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.2, delay: 0.4 }}
    />
  </span>
);

const Devis = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [designs, setDesigns] = useState<any[]>([]);
  const designData = location.state;

  useEffect(() => {
    if (designData) {
      const existingDesignsString = sessionStorage.getItem('designs');
      const existingDesigns = existingDesignsString ? JSON.parse(existingDesignsString) : [];
      
      const designExists = existingDesigns.some(
        (design: any) => design.designNumber === designData.designNumber
      );
      
      if (!designExists) {
        const updatedDesigns = [...existingDesigns, designData];
        sessionStorage.setItem('designs', JSON.stringify(updatedDesigns));
        setDesigns(updatedDesigns);
      } else {
        setDesigns(existingDesigns);
      }
    }
  }, [designData]);

  useEffect(() => {
    if (!location.state) {
      const cachedDesigns = sessionStorage.getItem('designs');
      if (cachedDesigns) {
        setDesigns(JSON.parse(cachedDesigns));
      }
    }
  }, [location.state]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    additionalNotes: ''
  });

  const totalQuantity = designs.reduce((sum, design) => sum + design.quantity, 0);
  const isQuoteRequestEnabled = designs.length > 0 && totalQuantity >= 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isQuoteRequestEnabled) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins un produit au devis",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Form submitted:', { ...formData, designs });
    sessionStorage.removeItem('designs');
    setIsLoading(false);
    setIsSuccess(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleBack = () => {
    if (isSuccess) {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  const getTextStyleDescription = (style: any) => {
    const styles = [];
    if (style.bold) styles.push('Gras');
    if (style.italic) styles.push('Italique');
    if (style.underline) styles.push('Souligné');
    styles.push(`Aligné ${style.align === 'center' ? 'au centre' : style.align === 'right' ? 'à droite' : 'à gauche'}`);
    return styles.join(', ');
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg mx-auto text-center space-y-6 bg-white p-8 rounded-lg shadow-lg"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-800">Merci pour votre demande !</h2>
          <p className="text-gray-600">
            Nous avons bien reçu votre demande de devis. Notre équipe l'examine et vous enverra une réponse détaillée par email dans les plus brefs délais.
          </p>
          
          <Button
            onClick={handleBack}
            className="mt-6"
            size="lg"
          >
            <Home className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        onClick={handleBack}
        className="mb-6 hover:bg-gray-100"
        disabled={isLoading}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div className="max-w-5xl mx-auto">
        {designs.length > 0 && (
          <Card className="p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">
                Devis - {designs.length} produit{designs.length > 1 ? 's' : ''}
              </h2>
              <div className="bg-primary/5 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Total articles:</span>
                  <Badge variant="secondary">{totalQuantity} unités</Badge>
                </div>
              </div>
            </div>

            <ScrollArea className="h-[600px]">
              {designs.map((design, index) => (
                <div key={index} className="mb-8 last:mb-0">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium">
                      Design ({design.designNumber}) - {design.productName}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Taille:</span>
                        <Badge variant="secondary">{design.selectedSize}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Quantité:</span>
                        <Badge variant="secondary">{design.quantity} unités</Badge>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-6">
                    {Object.entries(design.designs || {}).map(([key, designFace]: [string, any]) => {
                      // Find the product config and side title
                      const productConfig = productSidesConfigs.find(config => config.id === design.productId);
                      const side = productConfig?.sides.find(s => s.id === designFace.faceId);
                      const faceTitle = side?.title || designFace.faceTitle || designFace.faceId;

                      return (
                        <div key={key} className="mb-8 last:mb-0">
                          <h3 className="font-medium mb-4 flex items-center gap-2">
                            <Badge variant="outline">Face: {faceTitle}</Badge>
                          </h3>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <img 
                                src={designFace.canvasImage} 
                                alt={`Design ${faceTitle}`}
                                className="w-full rounded-lg border shadow-sm"
                              />
                            </div>
                            
                            <div className="space-y-4">
                              {designFace.textElements?.length > 0 && (
                                <div className="space-y-3">
                                  <h4 className="font-medium flex items-center gap-2">
                                    <Type className="h-4 w-4" />
                                    Textes
                                  </h4>
                                  {designFace.textElements.map((text: any, idx: number) => (
                                    <Card key={idx} className="p-3 bg-gray-50">
                                      <p className="font-medium text-sm">{text.content}</p>
                                      <div className="mt-2 flex flex-wrap gap-2">
                                        <Badge variant="secondary" className="text-xs">
                                          {text.font}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                          <div 
                                            className="w-2 h-2 rounded-full" 
                                            style={{ backgroundColor: text.color }}
                                          />
                                          {text.color}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                          {text.size}px
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-2">
                                        {getTextStyleDescription(text.style)}
                                      </p>
                                    </Card>
                                  ))}
                                </div>
                              )}

                              {designFace.uploadedImages?.length > 0 && (
                                <div className="space-y-3">
                                  <h4 className="font-medium flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4" />
                                    Images ({designFace.uploadedImages.length})
                                  </h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {designFace.uploadedImages.map((img: any, idx: number) => (
                                      <div key={idx} className="relative aspect-square rounded-md overflow-hidden border">
                                        <img 
                                          src={img.url} 
                                          alt={img.name}
                                          className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                                          <p className="text-xs text-white truncate">
                                            {img.name}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </Card>
        )}

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h1 className="text-2xl font-bold text-primary mb-6">Demande de Devis Personnalisé</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description détaillée</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Décrivez votre projet en détail..."
                  className="min-h-[100px]"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Notes supplémentaires</Label>
                <Textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  placeholder="Autres informations importantes..."
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full md:w-auto px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isQuoteRequestEnabled || isLoading}
              >
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center space-x-2"
                  >
                    <span>Envoi en cours</span>
                    <LoadingDots />
                  </motion.div>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer la demande
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Devis;
