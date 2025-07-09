import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useDeliveryConfig } from '@/hooks/useDeliveryConfig';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CalendarIcon, ArrowLeft, ShoppingBag, Check, CreditCard, Trash2, User, Phone, Mail, MapPin, Tag, Percent, Banknote, ChevronRight, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCurrency } from '@/context/CurrencyContext';
import { submitOrderWithPayment, type CustomerData, type OrderData, type OrderItem } from '@/services/orderService';
import { paymentConfig } from '@/config/paymentConfig';

const checkoutSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  telephone: z.string().min(8, 'Numéro de téléphone invalide'),
  adresse: z.string().min(5, 'Adresse requise'),
  ville: z.string().min(2, 'Ville requise'),
  code_postal: z.string().min(4, 'Code postal requis'),
  pays: z.string().min(2, 'Pays requis'),
  notes: z.string().optional(),
  paymentMethod: z.enum(['card', 'cash_on_delivery']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { state, clearCart, removeFromCart, updateQuantity, getTotalPrice, getOriginalTotalPrice, getTotalDiscount } = useCart();
  const { 
    applyPromoCode, 
    removePromoCode, 
    getOrderSummary, 
    formatPrice,
    appliedPromoCode,
    appliedDiscount 
  } = useDeliveryConfig();
  const { convertPrice } = useCurrency();
  
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountMessage, setDiscountMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, size: string, name: string} | null>(null);
  const [hasNewsletterDiscount, setHasNewsletterDiscount] = useState(false);

  // Check for newsletter discount on component mount
  useEffect(() => {
    const isNewsletter = localStorage.getItem('isNewsletter');
    if (isNewsletter === 'true') {
      setHasNewsletterDiscount(true);
    }
  }, []);

  const steps = [
    { id: 1, title: 'Informations personnelles', icon: User },
    { id: 2, title: 'Détails de livraison', icon: MapPin },
    { id: 3, title: 'Paiement', icon: CreditCard }
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      pays: 'France',
      paymentMethod: paymentConfig.bypassPayment ? 'cash_on_delivery' : 'card',
    }
  });

  const deliveryCost = getOrderSummary(getTotalPrice(), watch('pays') || 'France').deliveryPrice;
  const subtotal = getTotalPrice();
  const discount = getTotalDiscount();
  
  // Calculate newsletter discount (5% of subtotal)
  const newsletterDiscount = hasNewsletterDiscount ? subtotal * 0.05 : 0;
  
  // Calculate total with newsletter discount
  const totalAfterNewsletterDiscount = subtotal + deliveryCost - newsletterDiscount;
  const total = totalAfterNewsletterDiscount - appliedDiscount;

  const handleDiscountCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setDiscountCode(code);
    
    if (code.trim() === '') {
      removePromoCode();
      setDiscountMessage('');
      return;
    }
    
    const result = applyPromoCode(code, getTotalPrice());
    setDiscountMessage(result.message);
  };

  const handleDeleteItem = (id: string, size: string, name: string) => {
    setItemToDelete({ id, size, name });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete.id, itemToDelete.size);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof CheckoutFormData)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['prenom', 'nom', 'email', 'telephone'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['adresse', 'ville', 'code_postal', 'pays'];
    }

    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      if (currentStep === 2 && !deliveryDate) {
        toast.error('Veuillez sélectionner une date de livraison');
        return;
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmitOrder = async (formData: CheckoutFormData) => {
    if (state.items.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    if (!deliveryDate) {
      toast.error('Veuillez sélectionner une date de livraison');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare customer data
      const customerData: CustomerData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        adresse: formData.adresse,
        ville: formData.ville,
        code_postal: formData.code_postal,
        pays: formData.pays,
      };

      // Prepare order items
      const orderItems: OrderItem[] = state.items.map(item => ({
        product_id: parseInt(item.id),
        nom_product: item.name,
        reference: `REF-${item.id}`,
        price: item.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        discount: item.isDiscounted ? (item.originalPrice || item.price) - item.price : 0,
      }));

      // Determine payment method
      let paymentMethod: 'card' | 'cash_on_delivery' | 'test' = formData.paymentMethod;
      if (paymentConfig.bypassPayment) {
        paymentMethod = 'test';
      }

      // Calculate total discount including newsletter discount
      const totalDiscountAmount = discount + appliedDiscount + newsletterDiscount;

      // Prepare order data
      const orderData: OrderData = {
        items: orderItems,
        sous_total: subtotal,
        discount_amount: totalDiscountAmount,
        delivery_cost: deliveryCost,
        total_order: total,
        notes: formData.notes,
      };

      // Submit order
      const orderResult = await submitOrderWithPayment({
        customer: customerData,
        order: orderData,
      }, paymentMethod);

      if (!orderResult.success) {
        throw new Error(orderResult.message);
      }

      console.log('Order created successfully:', orderResult);
      
      // Remove newsletter discount after successful order
      if (hasNewsletterDiscount) {
        localStorage.removeItem('isNewsletter');
        setHasNewsletterDiscount(false);
      }
      
      clearCart();
      
      const paymentMethodParam = paymentMethod === 'test' ? 'test' : formData.paymentMethod;
      navigate(`/payment-success?order_id=${orderResult.order_number}&payment_method=${paymentMethodParam}`);

    } catch (error) {
      console.error('Error processing order:', error);
      toast.error(`Une erreur est survenue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCurrentStepValid = () => {
    const formData = watch();
    if (currentStep === 1) {
      return formData.prenom && formData.nom && formData.email && formData.telephone;
    } else if (currentStep === 2) {
      return formData.adresse && formData.ville && formData.code_postal && formData.pays && deliveryDate;
    }
    return true;
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <div className="flex-1 bg-background flex items-center justify-center">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-serif text-foreground mb-4">Votre panier est vide</h1>
            <p className="text-muted-foreground mb-8">Ajoutez des articles à votre panier pour procéder au checkout</p>
            <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Continuer vos achats
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-muted rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif text-foreground">Finaliser votre commande</h1>
              <p className="text-muted-foreground mt-1">Complétez vos informations pour finaliser votre achat</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors",
                    currentStep >= step.id 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : "border-muted-foreground text-muted-foreground"
                  )}>
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-20 h-0.5 mx-4",
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    )} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <div className="flex space-x-8">
                {steps.map((step) => (
                  <div key={step.id} className="text-center">
                    <p className={cn(
                      "text-sm font-medium",
                      currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                    )}>
                      {step.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form Steps */}
            <div className="space-y-6">
              {/* Products Card */}
              <Card className="bg-card shadow-sm border border-border">
                <CardHeader className="border-b border-border bg-muted/50">
                  <CardTitle className="text-xl font-serif text-foreground">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Vos produits</h3>
                        <p className="text-sm text-muted-foreground font-normal">
                          {state.items.length} {state.items.length > 1 ? 'articles' : 'article'}
                        </p>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {state.items.map((item, index) => (
                      <div key={`${item.id}-${item.size}`} className="p-4 sm:p-6 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="relative flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg bg-card border border-border shadow-sm"
                            />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                              {item.quantity}
                            </div>
                            {item.isDiscounted && (
                              <div className="absolute -top-1 -left-1 bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full font-medium">
                                -{item.discountPercentage}%
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-foreground text-base sm:text-lg leading-tight">{item.name}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteItem(item.id, item.size, item.name)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <span className="flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                Taille: {item.size}
                              </span>
                              <span>Couleur: {item.color}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                  className="w-8 h-8 p-0"
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                  className="w-8 h-8 p-0"
                                >
                                  +
                                </Button>
                              </div>
                              
                              <div className="text-right">
                                {item.isDiscounted && item.originalPrice && (
                                  <div className="text-xs text-muted-foreground line-through">
                                    {formatPrice((item.originalPrice * item.quantity))}
                                  </div>
                                )}
                                <div className="font-semibold text-lg text-foreground">
                                  {formatPrice(item.price * item.quantity)}
                                </div>
                                {item.isDiscounted && (
                                  <div className="text-xs text-green-600 font-medium">
                                    {formatPrice(((item.originalPrice || item.price) - item.price) * item.quantity)} économisé
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Form Steps */}
              <Card className="bg-card shadow-sm border border-border">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit(handleSubmitOrder)} className="space-y-6">
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Informations personnelles
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="prenom">Prénom *</Label>
                            <Input
                              id="prenom"
                              {...register('prenom')}
                              className={errors.prenom ? 'border-destructive' : ''}
                            />
                            {errors.prenom && <p className="text-xs text-destructive mt-1">{errors.prenom.message}</p>}
                          </div>
                          <div>
                            <Label htmlFor="nom">Nom *</Label>
                            <Input
                              id="nom"
                              {...register('nom')}
                              className={errors.nom ? 'border-destructive' : ''}
                            />
                            {errors.nom && <p className="text-xs text-destructive mt-1">{errors.nom.message}</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              {...register('email')}
                              className={errors.email ? 'border-destructive' : ''}
                            />
                            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                          </div>
                          <div>
                            <Label htmlFor="telephone">Téléphone *</Label>
                            <Input
                              id="telephone"
                              {...register('telephone')}
                              className={errors.telephone ? 'border-destructive' : ''}
                            />
                            {errors.telephone && <p className="text-xs text-destructive mt-1">{errors.telephone.message}</p>}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Delivery Details */}
                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          Détails de livraison
                        </h3>
                        
                        <div>
                          <Label htmlFor="adresse">Adresse complète *</Label>
                          <Input
                            id="adresse"
                            {...register('adresse')}
                            className={errors.adresse ? 'border-destructive' : ''}
                          />
                          {errors.adresse && <p className="text-xs text-destructive mt-1">{errors.adresse.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="ville">Ville *</Label>
                            <Input
                              id="ville"
                              {...register('ville')}
                              className={errors.ville ? 'border-destructive' : ''}
                            />
                            {errors.ville && <p className="text-xs text-destructive mt-1">{errors.ville.message}</p>}
                          </div>
                          <div>
                            <Label htmlFor="code_postal">Code postal *</Label>
                            <Input
                              id="code_postal"
                              {...register('code_postal')}
                              className={errors.code_postal ? 'border-destructive' : ''}
                            />
                            {errors.code_postal && <p className="text-xs text-destructive mt-1">{errors.code_postal.message}</p>}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="pays">Pays *</Label>
                          <Input
                            id="pays"
                            {...register('pays')}
                            className={errors.pays ? 'border-destructive' : ''}
                          />
                          {errors.pays && <p className="text-xs text-destructive mt-1">{errors.pays.message}</p>}
                        </div>

                        <div>
                          <Label>Date de livraison souhaitée *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !deliveryDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {deliveryDate ? format(deliveryDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={deliveryDate}
                                onSelect={setDeliveryDate}
                                disabled={(date) =>
                                  date < new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div>
                          <Label htmlFor="notes">Notes spéciales</Label>
                          <Textarea
                            id="notes"
                            {...register('notes')}
                            placeholder="Instructions de livraison ou commentaires..."
                            rows={3}
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 3: Payment */}
                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                          <CreditCard className="w-5 h-5" />
                          Mode de paiement
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="card"
                              value="card"
                              {...register('paymentMethod')}
                              className="w-4 h-4"
                            />
                            <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                              <CreditCard className="w-4 h-4" />
                              Paiement par carte
                            </Label>
                          </div>
                          
                          {paymentConfig.enableCashOnDelivery && (
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="cash_on_delivery"
                                value="cash_on_delivery"
                                {...register('paymentMethod')}
                                className="w-4 h-4"
                              />
                              <Label htmlFor="cash_on_delivery" className="flex items-center gap-2 cursor-pointer">
                                <Banknote className="w-4 h-4" />
                                Paiement à la livraison
                              </Label>
                            </div>
                          )}
                        </div>

                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Shield className="w-4 h-4" />
                            <span>Paiement sécurisé SSL</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Vos informations de paiement sont cryptées et sécurisées.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6">
                      {currentStep > 1 && (
                        <Button type="button" variant="outline" onClick={prevStep}>
                          Précédent
                        </Button>
                      )}
                      
                      {currentStep < 3 ? (
                        <Button 
                          type="button" 
                          onClick={nextStep}
                          disabled={!isCurrentStepValid()}
                          className="ml-auto"
                        >
                          Suivant
                        </Button>
                      ) : (
                        <Button 
                          type="submit" 
                          disabled={isSubmitting || !isCurrentStepValid()}
                          className="ml-auto"
                        >
                          {isSubmitting ? 'Traitement en cours...' : 'Confirmer la commande'}
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <Card className="bg-card shadow-sm border border-border sticky top-4">
                <CardHeader>
                  <CardTitle className="text-xl font-serif text-foreground">Récapitulatif de commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Promo Code */}
                  <div>
                    <Label htmlFor="discountCode">Code de réduction</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="discountCode"
                        value={discountCode}
                        onChange={handleDiscountCodeChange}
                        placeholder="Entrez votre code"
                      />
                    </div>
                    {discountMessage && (
                      <p className={cn(
                        "text-xs mt-1",
                        appliedDiscount > 0 ? "text-green-600" : "text-destructive"
                      )}>
                        {discountMessage}
                      </p>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Sous-total original</span>
                        <span>{formatPrice(getOriginalTotalPrice())}</span>
                      </div>
                    )}
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Remises produits</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span>Sous-total</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>

                    {hasNewsletterDiscount && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Réduction newsletter (5%)</span>
                        <span>-{formatPrice(newsletterDiscount)}</span>
                      </div>
                    )}

                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Code promo</span>
                        <span>-{formatPrice(appliedDiscount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span>Livraison</span>
                      <span>{deliveryCost > 0 ? formatPrice(deliveryCost) : 'Gratuite'}</span>
                    </div>
                    
                    <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                      <span>Total</span>
                      <div className="text-right">
                        <div>{formatPrice(Math.max(0, total))}</div>
                        <div className="text-xs text-muted-foreground font-normal">
                          (≈ €{(Math.max(0, total) * 0.29).toFixed(2)} - Paiement en TND)
                        </div>
                      </div>
                    </div>

                    {(discount + appliedDiscount + newsletterDiscount) > 0 && (
                      <div className="text-center text-sm text-green-600 font-medium">
                        Total économisé: {formatPrice(discount + appliedDiscount + newsletterDiscount)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir retirer "{itemToDelete?.name}" de votre panier ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Checkout;