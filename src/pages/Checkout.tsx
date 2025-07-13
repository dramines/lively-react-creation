import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
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
import Header from '@/components/layout/Header';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import ContactModal from '@/components/modals/ContactModal';
import StoreFinderModal from '@/components/modals/StoreFinderModal';
import { initKonnectPayment } from '@/services/konnectPayment';
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
  const { t } = useTranslation('checkout');
  const { items, getTotalPrice, getOriginalTotalPrice, getTotalDiscount, clearCart, removeFromCart, updateQuantity } = useCart();
  const { formatPrice: formatCurrencyPrice, currency } = useCurrency();
  const { 
    applyPromoCode, 
    removePromoCode, 
    getOrderSummary, 
    formatPrice: formatTndPrice,
    appliedPromoCode,
    appliedDiscount 
  } = useDeliveryConfig();
  
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountMessage, setDiscountMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isStoreFinderOpen, setIsStoreFinderOpen] = useState(false);
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
    { id: 1, title: t('steps.personalInfo'), icon: User },
    { id: 2, title: t('steps.deliveryDetails'), icon: MapPin },
    { id: 3, title: t('steps.payment'), icon: CreditCard }
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
      pays: 'Tunisia',
      paymentMethod: paymentConfig.bypassPayment ? 'cash_on_delivery' : 'card',
    }
  });

  const deliveryCost = 15;
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

  // Calculate totals including item discounts
  const itemDiscountTotal = getTotalDiscount();
  const subtotalAfterItemDiscounts = getTotalPrice();
  const orderSummary = getOrderSummary(subtotalAfterItemDiscounts, watch('pays') || 'Tunisia');

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
        toast.error(t('form.validation.deliveryDateRequired'));
        return;
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmitOrder = async (formData: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    if (!deliveryDate) {
      toast.error(t('form.validation.deliveryDateRequired'));
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
      const orderItems: OrderItem[] = items.map(item => ({
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

      // Submit order based on payment method
      if (paymentMethod === 'cash_on_delivery' || paymentMethod === 'test') {
        console.log(`Processing ${paymentMethod} order...`);
        
        // Submit order directly for cash on delivery or test mode
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
        
        const paymentMethodParam = paymentMethod === 'test' ? 'test' : 'cash_on_delivery';
        navigate(`/payment-success?order_id=${orderResult.order_number}&payment_method=${paymentMethodParam}`);
        
      } else {
        console.log('Processing card payment order...');
        
        // For card payment, first submit the order (it will be pending)
        const orderResult = await submitOrderWithPayment({
          customer: customerData,
          order: orderData,
        }, 'card');

        if (!orderResult.success) {
          throw new Error(orderResult.message);
        }

        console.log('Order created successfully, initializing payment:', orderResult);

        // Remove newsletter discount after successful order creation
        if (hasNewsletterDiscount) {
          localStorage.removeItem('isNewsletter');
          setHasNewsletterDiscount(false);
        }

        // Generate unique order ID for Konnect
        const konnectOrderId = orderResult.order_number || `ORDER-${Date.now()}`;
        
        // Initialize Konnect payment
        const paymentResult = await initKonnectPayment({
          amount: total,
          firstName: formData.prenom,
          lastName: formData.nom,
          email: formData.email,
          orderId: konnectOrderId,
        });

        console.log('Payment initialized:', paymentResult);

        // Clear cart before redirect
        clearCart();

        // Redirect to Konnect payment page
        window.location.href = paymentResult.payUrl;
      }

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

  const CheckoutFooter = () => {
    const { t } = useTranslation(['checkout', 'footer']);
    
    return (
      <footer className="bg-white border-t border-gray-200 mt-16">
        {/* Help Section */}
        <div className="bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left - Help Text */}
              <div className="flex items-center text-gray-600">
                <p className="text-sm">
                  Besoin d'aide? {' '}
                  <button 
                    onClick={() => setIsContactOpen(true)}
                    className="text-slate-900 hover:text-slate-700 underline font-medium"
                  >
                    Contactez-nous
                  </button>
                </p>
              </div>
              
              {/* Center - Brand */}
              <div className="text-center">
                <img 
                  src="/lovable-uploads/136aa729-e26b-4832-9cbb-97b861235f24.png" 
                  alt="Luccy By EY Logo" 
                  className="h-8 mx-auto"
                />
                <p className="text-xs text-gray-500 mt-1">© 2024 Tous droits réservés</p>
              </div>
              
              {/* Right - Payment Methods */}
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/6ae71c51-8aec-40a3-9ee7-1f91411ff60f.png" 
                  alt="Méthodes de paiement" 
                  className="h-8 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <AnnouncementBar onStoreFinderOpen={() => setIsStoreFinderOpen(true)} />
        <Header 
          onMenuClick={() => {}} 
          onContactOpen={() => setIsContactOpen(true)}
          onBookingOpen={() => {}}
        />
        
        <div className="min-h-screen bg-gray-50 pt-40 pb-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-serif text-gray-900 mb-4">{t('emptyCart.title')}</h1>
            <p className="text-gray-600 mb-8">{t('emptyCart.message')}</p>
            <Button onClick={() => navigate('/')} className="bg-slate-900 hover:bg-slate-800 text-white">
              {t('emptyCart.button')}
            </Button>
          </div>
        </div>

        <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        <StoreFinderModal isOpen={isStoreFinderOpen} onClose={() => setIsStoreFinderOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar onStoreFinderOpen={() => setIsStoreFinderOpen(true)} />
      <Header 
        onMenuClick={() => {}} 
        onContactOpen={() => setIsContactOpen(true)}
        onBookingOpen={() => {}}
      />
      
      <div className="min-h-screen bg-gray-50 pt-40 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif text-gray-900">{t('title')}</h1>
              <p className="text-gray-600 mt-1">{t('subtitle')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form Steps */}
            <div className="space-y-6">
              {/* Products Card */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                  <CardTitle className="text-xl font-serif text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{t('products.title')}</h3>
                        <p className="text-sm text-gray-500 font-normal">
                          {items.length} {items.length > 1 ? t('products.countPlural') : t('products.count')}
                        </p>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100">
                    {items.map((item, index) => (
                      <div key={`${item.id}-${item.size}`} className="p-4 sm:p-6 hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="relative flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg bg-white border border-gray-200 shadow-sm"
                            />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-medium">
                              {item.quantity}
                            </div>
                            {item.isDiscounted && (
                              <div className="absolute -top-1 -left-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                                -{item.discountPercentage}%
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight">{item.name}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteItem(item.id, item.size, item.name)}
                                className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 ml-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                              {item.size !== 'One Size' && (
                                <span className="flex items-center gap-1">
                                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                                  {t('products.size')}: <strong className="text-gray-900">{item.size}</strong>
                                </span>
                              )}
                              {item.color && (
                                <span className="flex items-center gap-1">
                                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                                  {t('products.color')}: <strong className="text-gray-900">{item.color}</strong>
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between flex-wrap gap-4">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                    className="px-2 sm:px-3 py-2 hover:bg-gray-100 text-gray-600 transition-colors"
                                    disabled={item.quantity <= 1}
                                  >
                                    -
                                  </button>
                                  <span className="px-2 sm:px-3 py-2 border-x border-gray-300 bg-gray-50 text-center min-w-[40px] sm:min-w-[50px] font-medium">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                    className="px-2 sm:px-3 py-2 hover:bg-gray-100 text-gray-600 transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="flex flex-col items-end">
                                   {item.isDiscounted && item.originalPrice && (
                                     <p className="text-sm text-gray-400 line-through">
                                       {formatCurrencyPrice(item.originalPrice * item.quantity)}
                                     </p>
                                   )}
                                   <p className="font-bold text-lg sm:text-xl text-gray-900">
                                     {formatCurrencyPrice(item.price * item.quantity)}
                                   </p>
                                   <p className="text-sm text-gray-500">
                                     {formatCurrencyPrice(item.price)} {t('products.unitPrice')}
                                     {item.isDiscounted && item.originalPrice && (
                                       <span className="ml-1 text-red-600">
                                         ({formatCurrencyPrice(item.originalPrice - item.price)} {t('products.saved')})
                                       </span>
                                     )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Step Indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-center max-w-2xl mx-auto">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200",
                        currentStep >= step.id 
                          ? "bg-slate-900 border-slate-900 text-white" 
                          : "bg-white border-gray-300 text-gray-400"
                      )}>
                        <step.icon className="w-5 h-5" />
                      </div>
                      <div className="ml-3 hidden sm:block">
                        <p className={cn(
                          "text-sm font-medium",
                          currentStep >= step.id ? "text-slate-900" : "text-gray-400"
                        )}>
                          {step.title}
                        </p>
                      </div>
                      {index < steps.length - 1 && (
                        <ChevronRight className="w-5 h-5 text-gray-400 mx-4" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Forms */}
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit(handleSubmitOrder)} className="space-y-6">
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <h2 className="text-xl font-serif text-gray-900">{t('form.personalInfo.title')}</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="prenom" className="text-gray-700 font-medium">
                              {t('form.personalInfo.firstName')} *
                            </Label>
                            <Input
                              id="prenom"
                              {...register('prenom')}
                              className="bg-white border-gray-300 focus:border-slate-900 focus:ring-slate-900"
                              placeholder={t('form.personalInfo.firstNamePlaceholder')}
                            />
                            {errors.prenom && (
                              <p className="text-sm text-red-600">{errors.prenom.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nom" className="text-gray-700 font-medium">{t('form.personalInfo.lastName')} *</Label>
                            <Input
                              id="nom"
                              {...register('nom')}
                              className="bg-white border-gray-300 focus:border-slate-900 focus:ring-slate-900"
                              placeholder={t('form.personalInfo.lastNamePlaceholder')}
                            />
                            {errors.nom && (
                              <p className="text-sm text-red-600">{errors.nom.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {t('form.personalInfo.email')} *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            {...register('email')}
                            className="bg-white border-gray-300 focus:border-slate-900 focus:ring-slate-900"
                            placeholder={t('form.personalInfo.emailPlaceholder')}
                          />
                          {errors.email && (
                            <p className="text-sm text-red-600">{errors.email.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="telephone" className="text-gray-700 font-medium flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {t('form.personalInfo.phone')} *
                          </Label>
                          <Input
                            id="telephone"
                            {...register('telephone')}
                            className="bg-white border-gray-300 focus:border-slate-900 focus:ring-slate-900"
                            placeholder={t('form.personalInfo.phonePlaceholder')}
                          />
                          {errors.telephone && (
                            <p className="text-sm text-red-600">{errors.telephone.message}</p>
                          )}
                        </div>

                        <div className="flex justify-end">
                          <Button
                            type="button"
                            onClick={nextStep}
                            className="bg-slate-900 hover:bg-slate-800 text-white"
                          >
                            {t('form.buttons.next')}
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Delivery Details */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-white" />
                          </div>
                          <h2 className="text-xl font-serif text-gray-900">{t('form.delivery.title')}</h2>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="adresse" className="text-gray-700 font-medium">
                            {t('form.delivery.address')} *
                          </Label>
                          <Textarea
                            id="adresse"
                            {...register('adresse')}
                            className="bg-white border-gray-300 focus:border-slate-900 focus:ring-slate-900"
                            rows={3}
                            placeholder={t('form.delivery.addressPlaceholder')}
                          />
                          {errors.adresse && (
                            <p className="text-sm text-red-600">{errors.adresse.message}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="ville" className="text-gray-700 font-medium">{t('form.delivery.city')} *</Label>
                            <Input
                              id="ville"
                              {...register('ville')}
                              className="bg-white border-gray-300 focus:border-slate-900 focus:ring-slate-900"
                              placeholder={t('form.delivery.cityPlaceholder')}
                            />
                            {errors.ville && (
                              <p className="text-sm text-red-600">{errors.ville.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="code_postal" className="text-gray-700 font-medium">{t('form.delivery.postalCode')} *</Label>
                            <Input
                              id="code_postal"
                              {...register('code_postal')}
                              className="bg-white border-gray-300 focus:border-slate-900 focus:ring-slate-900"
                              placeholder={t('form.delivery.postalCodePlaceholder')}
                            />
                            {errors.code_postal && (
                              <p className="text-sm text-red-600">{errors.code_postal.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pays" className="text-gray-700 font-medium">{t('form.delivery.country')} *</Label>
                            <Input
                              id="pays"
                              {...register('pays')}
                              className="bg-white border-gray-300 focus:border-slate-900 focus:ring-slate-900"
                            />
                            {errors.pays && (
                              <p className="text-sm text-red-600">{errors.pays.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-700 font-medium flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            {t('form.delivery.deliveryDate')} *
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal bg-white border-gray-300 hover:bg-gray-50",
                                  !deliveryDate && "text-gray-500"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {deliveryDate ? format(deliveryDate, "PPP", { locale: fr }) : t('form.delivery.selectDate')}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white" align="start">
                              <Calendar
                                mode="single"
                                selected={deliveryDate}
                                onSelect={setDeliveryDate}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notes" className="text-gray-700 font-medium">{t('form.delivery.notes')}</Label>
                          <Textarea
                            id="notes"
                            {...register('notes')}
                            className="bg-white border-gray-300 focus:border-slate-900 focus:ring-slate-900"
                            rows={3}
                            placeholder={t('form.delivery.notesPlaceholder')}
                          />
                        </div>

                        <div className="flex justify-between">
                          <Button
                            type="button"
                            onClick={prevStep}
                            variant="outline"
                            className="border-gray-300"
                          >
                            {t('form.buttons.previous')}
                          </Button>
                          <Button
                            type="button"
                            onClick={nextStep}
                            className="bg-slate-900 hover:bg-slate-800 text-white"
                          >
                            {t('form.buttons.next')}
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Payment */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-white" />
                          </div>
                          <h2 className="text-xl font-serif text-gray-900">{t('payment.title')}</h2>
                        </div>

                        <div className="space-y-4">
                          <div className="flex flex-col gap-3">
                            {!paymentConfig.bypassPayment && (
                              <Button
                                type="submit"
                                variant={watch('paymentMethod') === 'card' ? 'default' : 'outline'}
                                className={`w-full py-3 text-sm sm:text-base ${watch('paymentMethod') === 'card' ? 'bg-slate-900 hover:bg-slate-800' : ''}`}
                                onClick={() => {
                                  setValue('paymentMethod', 'card');
                                  // Auto-submit when card payment is selected
                                  setTimeout(() => handleSubmit(handleSubmitOrder)(), 100);
                                }}
                                disabled={isSubmitting || !deliveryDate || !isCurrentStepValid()}
                              >
                                <CreditCard className="w-4 h-4 mr-2" />
                                {isSubmitting && watch('paymentMethod') === 'card' ? t('form.buttons.processing') : 'Paiement en ligne'}
                              </Button>
                            )}
                            
                            {(paymentConfig.enableCashOnDelivery || paymentConfig.bypassPayment) && (
                              <Button
                                type="submit"
                                variant={watch('paymentMethod') === 'cash_on_delivery' ? 'default' : 'outline'}
                                className={`w-full py-3 text-sm sm:text-base ${watch('paymentMethod') === 'cash_on_delivery' ? 'bg-slate-900 hover:bg-slate-800' : ''}`}
                                onClick={() => {
                                  setValue('paymentMethod', 'cash_on_delivery');
                                  // Auto-submit when cash on delivery is selected
                                  setTimeout(() => handleSubmit(handleSubmitOrder)(), 100);
                                }}
                                disabled={isSubmitting || !deliveryDate || !isCurrentStepValid()}
                              >
                                <Banknote className="w-4 h-4 mr-2" />
                                {isSubmitting && watch('paymentMethod') === 'cash_on_delivery' ? t('form.buttons.processing') : 'Paiement à la livraison'}
                              </Button>
                            )}
                          </div>

                          {watch('paymentMethod') === 'card' && !paymentConfig.bypassPayment && (
                            <div className="text-center pt-4 border-t border-gray-100">
                              <img 
                                src="/lovable-uploads/826629d2-edfb-4f7e-b1fb-e35e63dbe15c.png" 
                                alt="Méthodes de paiement acceptées" 
                                className="inline-block h-8 sm:h-10 opacity-75" 
                              />
                              <p className="text-xs text-gray-500 mt-1">Paiement sécurisé par Konnect</p>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between">
                          <Button
                            type="button"
                            onClick={prevStep}
                            variant="outline"
                            className="border-gray-300"
                          >
                            {t('form.buttons.previous')}
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <Card className="bg-white shadow-sm sticky top-36">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-serif text-gray-900">{t('orderSummary.title')}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-6">
                  {/* Order Totals */}
                  <div className="space-y-3">
                    {/* Show original subtotal if there are item discounts */}
                     {itemDiscountTotal > 0 && (
                       <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-600">{t('orderSummary.originalSubtotal')}</span>
                         <span className="text-gray-500 line-through">{formatCurrencyPrice(getOriginalTotalPrice())}</span>
                       </div>
                     )}
                     <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-600">{t('orderSummary.subtotal')}</span>
                       <div className="flex flex-col items-end">
                         <span className="text-gray-900 font-medium">{formatCurrencyPrice(subtotal)}</span>
                         {currency !== 'TND' && (
                           <span className="text-xs text-gray-500">= {subtotal.toFixed(2)} TND</span>
                         )}
                       </div>
                     </div>
                     {/* Show item discounts separately */}
                     {itemDiscountTotal > 0 && (
                       <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-600 flex items-center gap-1">
                           <Percent className="w-3 h-3" />
                           {t('orderSummary.itemDiscounts')}
                         </span>
                         <span className="text-green-600 font-medium">-{formatCurrencyPrice(itemDiscountTotal)}</span>
                       </div>
                     )}
                     {/* Newsletter discount */}
                     {hasNewsletterDiscount && (
                       <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-600 flex items-center gap-1">
                           <Mail className="w-3 h-3" />
                           Newsletter Discount (5%)
                         </span>
                         <span className="text-green-600 font-medium">-{formatCurrencyPrice(newsletterDiscount)}</span>
                       </div>
                     )}
                     {appliedDiscount > 0 && (
                       <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-600">{t('orderSummary.discount')}</span>
                         <span className="text-green-600 font-medium">-{formatCurrencyPrice(appliedDiscount)}</span>
                       </div>
                     )}
                     <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-600">{t('orderSummary.shipping')}</span>
                       <span className="text-gray-900">{formatCurrencyPrice(deliveryCost)}</span>
                     </div>
                     <div className="flex justify-between items-center text-lg sm:text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                       <span>{t('orderSummary.total')}</span>
                       <div className="flex flex-col items-end">
                         <span>{formatCurrencyPrice(total)}</span>
                         {currency !== 'TND' && (
                           <span className="text-sm text-gray-500 font-normal">= {total.toFixed(2)} TND</span>
                         )}
                       </div>
                     </div>
                     {/* Show total savings */}
                     {(itemDiscountTotal + appliedDiscount + newsletterDiscount) > 0 && (
                       <div className="flex justify-between items-center text-sm bg-green-50 p-2 rounded-lg">
                         <span className="text-green-700 font-medium">{t('orderSummary.totalSavings')}</span>
                         <span className="text-green-700 font-bold">{formatCurrencyPrice(itemDiscountTotal + appliedDiscount + newsletterDiscount)}</span>
                       </div>
                     )}
                  </div>

                  {/* Discount Code */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <Label className="text-gray-700 font-medium flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      {t('orderSummary.discountCode')}
                    </Label>
                    <div className="space-y-2">
                      <Input
                        value={discountCode}
                        onChange={handleDiscountCodeChange}
                        placeholder={t('orderSummary.discountCodePlaceholder')}
                        className="flex-1 text-sm"
                      />
                      {discountMessage && (
                        <p className={cn(
                          "text-sm font-medium",
                          appliedPromoCode ? "text-green-600" : "text-red-600"
                        )}>
                          {discountMessage}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="text-xs text-gray-500 space-y-1 pt-4 border-t border-gray-100">
                    <p>• Livraison gratuite à partir de 299 TND</p>
                    <p>• Échange de produit sous 30 jours (4 TND)</p>
                    <p>• Service client disponible 24/7</p>
                    <p>• Livraison mondial disponible</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <CheckoutFooter />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <StoreFinderModal isOpen={isStoreFinderOpen} onClose={() => setIsStoreFinderOpen(false)} />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteConfirmation.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteConfirmation.message')}
              {itemToDelete && (
                <span className="font-medium text-gray-900 block mt-1">
                  "{itemToDelete.name}"
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('deleteConfirmation.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {t('deleteConfirmation.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Checkout;
