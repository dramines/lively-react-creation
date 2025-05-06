import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { COMPOSITION_DATES } from '../../config/dates-composition';
import { Button } from '../ui/button';
import { AspectRatio } from '../ui/aspect-ratio';
import { Check, Phone, User, Mail } from 'lucide-react';
import { toast } from '../ui/use-toast';
import { useApp } from '../../context/AppContext';
import { EMAIL_RECIPIENTS, formatSelectedDatesForEmail, sendEmail } from '../../services/emailService';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  phone: z.string().min(8, { message: "Numéro de téléphone invalide" }),
  message: z.string().optional(),
});

const DateFarcieComposer = () => {
  const { t } = useTranslation();
  const { clientType } = useApp();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    },
  });
  
  const handleToggleDateSelection = (dateId: string) => {
    if (selectedDates.includes(dateId)) {
      setSelectedDates(selectedDates.filter(id => id !== dateId));
    } else {
      if (selectedDates.length < 8) {
        setSelectedDates([...selectedDates, dateId]);
      } else {
        toast({
          title: t('date_composer.max_selection_reached'),
          description: t('date_composer.remove_some')
        });
      }
    }
  };
  
  const handleConfirm = () => {
    if (selectedDates.length > 0) {
      setConfirmed(true);
      toast({
        title: t('date_composer.thank_you_title'),
        description: t('date_composer.thank_you_description')
      });
    } else {
      toast({
        title: t('date_composer.select_dates'),
        description: t('date_composer.select_at_least_one')
      });
    }
  };
  
  const handleReset = () => {
    setSelectedDates([]);
    setConfirmed(false);
    setFormSubmitted(false);
    form.reset();
  };

  // Get the selected date objects
  const selectedDateObjects = COMPOSITION_DATES.filter(date => 
    selectedDates.includes(date.id)
  );
  
  // Handle form submission to send email
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Determine recipient based on client type
      const recipientEmail = clientType === 'B2B' 
        ? EMAIL_RECIPIENTS.B2B
        : EMAIL_RECIPIENTS.B2C;
        
      // Format selected dates for email
      const selectedDatesFormatted = formatSelectedDatesForEmail(selectedDateObjects);
      
      // Build email content in French
      const emailContent = `
Demande de composition de dattes farcies

Informations du client:
Nom: ${data.lastName}
Prénom: ${data.firstName}
Email: ${data.email}
Téléphone: ${data.phone}
Type de client: ${clientType === 'B2B' ? 'Professionnel (B2B)' : 'Particulier (B2C)'}

Composition sélectionnée:
${selectedDatesFormatted}

${data.message ? `Message: ${data.message}` : ''}
      
Date d'envoi: ${new Date().toLocaleString('fr-FR')}
      `;
      
      // Send email
      await sendEmail(
        recipientEmail,
        'Composition pack farcie', 
        emailContent
      );
      
      // Show success message and update state
      toast({
        title: "Demande envoyée",
        description: "Nous vous contacterons bientôt pour finaliser votre commande."
      });
      
      setFormSubmitted(true);
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi de votre demande. Veuillez réessayer.",
        variant: "destructive"
      });
      console.error('Error sending email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      {!confirmed ? (
        // ... keep existing code (date selection UI)
        <>
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-[#700100] mb-4">
              {t('date_composer.title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('date_composer.subtitle')}
            </p>
            <div className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded-lg inline-block">
              <p className="text-amber-800">
                {t('date_composer.selection_count', { current: selectedDates.length, max: 8 })}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-10">
            {COMPOSITION_DATES.map((date) => (
              <motion.div
                key={date.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`relative rounded-lg overflow-hidden shadow-md border-2 transition-colors cursor-pointer ${
                  selectedDates.includes(date.id) 
                    ? 'border-[#700100] bg-[#700100]/5' 
                    : 'border-transparent hover:border-gray-300'
                }`}
                onClick={() => handleToggleDateSelection(date.id)}
              >
                <div className="relative">
                  <div className="w-full">
                    <AspectRatio ratio={1/1}>
                      <img 
                        src={date.image} 
                        alt={t(`stuffed_dates.compositions.${date.id}`)}
                        className="object-cover w-full h-full rounded-t-lg"
                      />
                    </AspectRatio>
                  </div>
                  {selectedDates.includes(date.id) && (
                    <div className="absolute top-2 right-2 bg-[#700100] text-white rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg">{t(`stuffed_dates.compositions.${date.id}`)}</h3>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <Button 
              onClick={handleConfirm}
              size="lg" 
              className="bg-[#700100] hover:bg-[#500100] text-white font-medium text-lg px-8 py-6"
            >
              {t('date_composer.confirm_button')}
            </Button>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t('date_composer.thank_you_title')}
            </h2>
            <p className="text-gray-600 mb-8">
              {t('date_composer.thank_you_message')}
            </p>

            {/* Display selected items */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#700100] mb-4">
                {t('date_composer.selected_items')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedDateObjects.map(date => (
                  <div key={date.id} className="flex items-center p-3 border rounded-lg bg-gray-50">
                    <div className="w-12 h-12 flex-shrink-0 mr-3 overflow-hidden rounded-md">
                      <img 
                        src={date.image} 
                        alt={t(`stuffed_dates.compositions.${date.id}`)}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium">{t(`stuffed_dates.compositions.${date.id}`)}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form - Now displayed directly on the page instead of in a dialog */}
            <div className="my-8 space-y-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {formSubmitted 
                  ? "Merci pour votre demande ! Nous vous contacterons bientôt."
                  : "Pour finaliser votre commande, veuillez remplir le formulaire:"}
              </h3>

              {!formSubmitted ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prénom</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                  <Input 
                                    placeholder="Votre prénom" 
                                    className="pl-9" 
                                    {...field} 
                                  />
                                </div>
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
                              <FormLabel>Nom</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                  <Input 
                                    placeholder="Votre nom" 
                                    className="pl-9" 
                                    {...field} 
                                  />
                                </div>
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input 
                                  type="email" 
                                  placeholder="votre@email.com" 
                                  className="pl-9" 
                                  {...field} 
                                />
                              </div>
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
                              <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input 
                                  placeholder="+216 XX XXX XXX" 
                                  className="pl-9" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message (Optionnel)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Instructions ou commentaires supplémentaires..." 
                                className="min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-center pt-4">
                        <Button 
                          type="submit" 
                          className="bg-[#700100] hover:bg-[#500100] w-full sm:w-auto px-8"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Envoi en cours...
                            </div>
                          ) : (
                            "Confirmer ma commande"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-green-700">
                  <p className="flex items-center justify-center">
                    <Check className="h-5 w-5 mr-2" />
                    Votre demande a été envoyée avec succès !
                  </p>
                  
                  <div className="text-gray-600 mt-4">
                    <p>Un membre de notre équipe vous contactera prochainement pour finaliser votre commande.</p>
                  </div>
                </div>
              )}
              
              {formSubmitted && (
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="mt-6"
                >
                  {t('date_composer.start_over')}
                </Button>
              )}
            </div>

            {!formSubmitted && (
              <div className="mt-6 text-sm text-gray-500">
                <p>Vous pouvez également nous contacter par téléphone au:</p>
                <p className="font-bold text-[#700100] mt-1">{t('date_composer.contact_number')}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DateFarcieComposer;