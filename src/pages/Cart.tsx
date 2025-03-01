import { useState, useRef, useEffect } from 'react';
import { Minus, Plus, X, ShoppingBag, ArrowLeft, Upload, Save, Edit2, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from '@/components/cart/CartProvider';
import { products } from '@/config/products';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OrderForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  file?: FileList;
}

const Cart = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [savedInfo, setSavedInfo] = useState<Partial<OrderForm> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const form = useForm<OrderForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    },
  });

  const [hasInfoSaved, setHasInfoSaved] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('customerInfo');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setSavedInfo(parsedData);
      form.reset(parsedData);
      setHasInfoSaved(true);
    }
  }, []);

  const { watch } = form;
  const formValues = watch();
  const isStep1Valid = formValues.firstName && formValues.lastName && formValues.email && formValues.phone && formValues.address;
  const isFormValid = isStep1Valid;

  const handleSaveInfo = () => {
    if (!isFormValid) {
      toast({
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    const formData = form.getValues();
    localStorage.setItem('customerInfo', JSON.stringify(formData));
    setSavedInfo(formData);
    setHasInfoSaved(true);
    setIsEditing(false);
    toast({
      description: "✨ Vos informations ont été sauvegardées",
      duration: 2000,
    });
  };

  const handleEditInfo = () => {
    setIsEditing(true);
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    if (!isStep1Valid) {
      toast({
        description: "Veuillez remplir tous les champs obligatoires de l'étape 1",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const cartItemsWithDetails = items.map(item => {
    const product = products.find(p => p.id === item.product_id.toString());
    return {
      ...item,
      name: product?.name || item.itemgroup_product,
      price: product?.startingPrice ? parseFloat(product.startingPrice) : 49.99,
      image: product?.image || "/placeholder.svg"
    };
  });

  const handleUpdateQuantity = (id: string, change: number) => {
    const item = items.find(item => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      updateQuantity(id, newQuantity);
      
      toast({
        description: "Quantité mise à jour",
        duration: 2000,
      });
    }
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    
    toast({
      description: "Article supprimé du panier",
      duration: 2000,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        description: "Fichier ajouté",
        duration: 2000,
      });
    }
  };

  const onSubmit = (data: OrderForm) => {
    setIsProcessingPayment(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      
      toast({
        description: "✨ Paiement effectué avec succès! Pour toute assistance, contactez-nous au : +216 9984785",
        duration: 5000,
      });
    }, 5000);
  };

  const subtotal = cartItemsWithDetails.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal >= 255 ? 0 : 7.99;
  const total = subtotal + shipping;

  const renderDeliveryForm = () => {
    if (!isEditing && savedInfo) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Informations de livraison</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEditInfo}
              className="flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Modifier
            </Button>
          </div>
          <div className="space-y-3">
            <p className="font-medium">{savedInfo.firstName} {savedInfo.lastName}</p>
            <p>{savedInfo.email}</p>
            <p>{savedInfo.phone}</p>
            <p className="text-gray-600">{savedInfo.address}</p>
            {savedInfo.notes && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Notes:</p>
                <p className="text-gray-600">{savedInfo.notes}</p>
              </div>
            )}
            {selectedFile && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Fichier joint:</p>
                <p className="text-gray-600">{selectedFile.name}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Informations de livraison</h2>
            <div className="text-sm text-gray-500">
              Étape {currentStep}/2
            </div>
          </div>

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Votre prénom" 
                          {...field} 
                          className="bg-white border-gray-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Votre nom" 
                          {...field} 
                          className="bg-white border-gray-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="votre@email.com" 
                        {...field}
                        className="bg-white border-gray-200"
                      />
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
                    <FormLabel>Téléphone *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Votre numéro de téléphone" 
                        {...field}
                        className="bg-white border-gray-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Votre adresse complète" 
                        {...field}
                        className="bg-white border-gray-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                className="w-full"
                onClick={handleNextStep}
                disabled={!isStep1Valid}
              >
                Suivant
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes sur la commande</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Instructions spéciales ou commentaires sur votre commande"
                        className="min-h-[100px] bg-white border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label htmlFor="file">Document supplémentaire</Label>
                <div className="mt-1">
                  <Input
                    id="file"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-white border-gray-200"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {selectedFile ? selectedFile.name : "Ajouter un fichier"}
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-white border-gray-200"
                  onClick={handlePrevStep}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={handleSaveInfo}
                  disabled={!isStep1Valid}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    );
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowSuccessModal(true);
    }, 2000);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    clearCart();
    navigate('/');
  };

  if (cartItemsWithDetails.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-400" />
          <h2 className="text-2xl font-semibold">Votre panier est vide</h2>
          <p className="text-gray-600">Découvrez nos produits et commencez votre shopping</p>
          <Link to="/">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continuer mes achats
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Payment Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={handleSuccessClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl">Paiement réussi !</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Votre commande a été traitée avec succès. Merci pour votre achat !
            </p>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleSuccessClose}>
              Retour à l'accueil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isProcessingPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center space-y-4 animate-scale-in">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <p className="text-lg font-medium">Traitement du paiement en cours...</p>
            <p className="text-sm text-gray-500 mt-2">Veuillez patienter...</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Mon Panier</h1>
        <Link to="/" className="text-sm text-gray-600 hover:text-primary transition-colors">
          <span className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continuer mes achats
          </span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4 mb-8">
            {cartItemsWithDetails.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                  <div className="mt-1 text-sm text-gray-600">
                    <span className="mr-4">Taille: {item.size}</span>
                    <span>Couleur: {item.color}</span>
                  </div>
                  <p className="text-primary font-medium mt-1">{item.price.toFixed(2)} TND</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, -1)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Diminuer la quantité"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, 1)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Augmenter la quantité"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Supprimer l'article"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            ))}
          </div>

          {renderDeliveryForm()}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4 sticky top-4">
            <h2 className="text-xl font-semibold">Résumé de la commande</h2>
            
            {savedInfo && hasInfoSaved && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Informations sauvegardées</h3>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Vérifié
                  </span>
                </div>
                <div className="space-y-1 text-gray-600">
                  <p className="font-medium text-gray-900">{savedInfo.firstName} {savedInfo.lastName}</p>
                  <p>{savedInfo.email}</p>
                  <p>{savedInfo.phone}</p>
                  <p className="text-gray-500">{savedInfo.address}</p>
                </div>
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-medium">{subtotal.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Livraison</span>
                <span className="font-medium">{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} TND`}</span>
              </div>
              {shipping > 0 && (
                <div className="py-2 px-3 bg-blue-50 text-blue-700 rounded-md text-sm">
                  Plus que {(255 - subtotal).toFixed(2)} TND pour la livraison gratuite
                </div>
              )}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{total.toFixed(2)} TND</span>
                </div>
              </div>
            </div>

            <Button 
              className="w-full mt-6"
              size="lg"
              disabled={!isFormValid || !hasInfoSaved}
              onClick={handlePayment}
            >
              {!isFormValid ? (
                "Remplissez tous les champs obligatoires"
              ) : !hasInfoSaved ? (
                "Sauvegardez vos informations"
              ) : (
                "Procéder au paiement"
              )}
            </Button>

            {hasInfoSaved && isFormValid && (
              <p className="text-center text-sm text-green-600 mt-2">
                ✨ Vous pouvez maintenant procéder au paiement
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
