
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Type, Image as ImageIcon, Home, CheckCircle2, Upload, Trash2, Eye, FileText } from "lucide-react";
import { products } from "@/config/products";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { productSidesConfigs } from "@/components/personalization/config/productSidesConfig";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  company: z.string().optional(),
  productName: z.string().min(2, "Nom du produit requis"),
  quantity: z.number().min(1, "La quantité minimum est de 1"),
  size: z.string().min(1, "Taille requise"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  deadline: z.string().optional(),
  additionalNotes: z.string().optional(),
});

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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const designData = location.state;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      productName: "",
      quantity: 1,
      size: "",
      description: "",
      deadline: "",
      additionalNotes: "",
    },
  });

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const validFiles = files.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Erreur",
          description: `${file.name} dépasse la taille maximale de 5MB`,
          variant: "destructive",
        });
        return false;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast({
          title: "Erreur",
          description: `${file.name} n'est pas un type de fichier autorisé`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const totalQuantity = designs.reduce((sum, design) => sum + design.quantity, 0);
  const isQuoteRequestEnabled = designs.length > 0 && totalQuantity >= 1;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    // Create FormData to handle file uploads
    const formData = new FormData();
    uploadedFiles.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });

    // Add form values to FormData
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    // Add designs if any
    if (designs.length > 0) {
      formData.append('designs', JSON.stringify(designs));
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', {
        formValues: values,
        designs,
        files: uploadedFiles
      });
      
      sessionStorage.removeItem('designs');
      setIsSuccess(true);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi du formulaire",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (isSuccess) {
      navigate('/');
    } else {
      navigate(-1);
    }
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

            <ScrollArea className="h-[300px] lg:h-[400px]">
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

                  {Object.entries(design.designs || {}).map(([key, designFace]: [string, any]) => {
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
                                    </div>
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
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Votre nom" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="Votre email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" placeholder="Votre numéro" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entreprise (optionnel)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nom de votre entreprise" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="productName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du produit</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nom du produit souhaité" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantité</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="1"
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taille</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Taille souhaitée" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date souhaitée (optionnel)</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description détaillée</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Décrivez votre projet en détail..."
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes supplémentaires (optionnel)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          placeholder="Autres informations importantes..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <Label>Fichiers joints (optionnel)</Label>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Ajouter des fichiers
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept={ALLOWED_FILE_TYPES.join(',')}
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>
                    
                    {uploadedFiles.length > 0 && (
                      <ScrollArea className="h-[200px] w-full rounded-md border border-input p-4">
                        <div className="space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <FileText className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{file.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => window.open(URL.createObjectURL(file))}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:text-destructive"
                                  onClick={() => removeFile(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full md:w-auto px-6 py-2"
                  disabled={!form.formState.isValid || isLoading}
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
            </Form>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Devis;
