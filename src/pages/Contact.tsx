
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Send, Phone, Mail, MapPin, Clock, CheckCircle2, Heart, ThumbsUp, Smile } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const TAZART_POSITION: [number, number] = [36.7547584, 10.2391717];

export const Contact = () => {
  // Get client type from App context
  const { clientType } = useApp();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [isVisible, setIsVisible] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const isB2B = clientType === 'B2B';
  const contactEmail = isB2B ? 'contact@tazart.tn' : 'qualite@tazart.tn';

  const BUSINESS_HOURS = [
    { day: t('contact.monday_friday'), hours: t('contact.hours_1'), isOpen: true },
    { day: t('contact.saturday'), hours: t('contact.hours_2'), isOpen: true },
    { day: t('contact.sunday'), hours: t('contact.closed'), isOpen: false },
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateForm = () => {
    const errors: Partial<FormData> = {};
    
    if (!formData.firstName.trim()) errors.firstName = t('contact.field_required');
    if (!formData.lastName.trim()) errors.lastName = t('contact.field_required');
    if (!formData.email.trim()) errors.email = t('contact.field_required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('contact.invalid_email');
    }
    if (!formData.phone.trim()) errors.phone = t('contact.field_required');
    else if (!/^\+?[\d\s-]{8,}$/.test(formData.phone)) {
      errors.phone = t('contact.invalid_phone');
    }
    if (!formData.message.trim()) errors.message = t('contact.field_required');

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowThankYou(true);
    
    // Reset the form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    setFormErrors({});
    
    // Hide the thank you message after 5 seconds
    setTimeout(() => {
      setTimeout(() => setShowThankYou(false), 500);
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const thankYouIcons = [Heart, ThumbsUp, Smile, CheckCircle2];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white pt-36 pb-16 mt-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div 
            className={`text-center mb-16 transition-all duration-1000 transform ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-playfair mb-4 text-gray-900 relative inline-block">
              {isB2B ? t('contact.contact_us') : t('contact.consumer_service')}
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#96cc39] transform origin-left transition-transform duration-1000 delay-500 scale-x-100"></span>
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto mt-6 text-lg">
              {isB2B ? t('contact.intro_b2b') : t('contact.intro_b2c')}
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Phone,
                title: t('contact.phone_section'),
                subtitle: isB2B ? t('contact.phone_subtitle') + " " + t('contact.according_to_hours') : t('contact.phone_subtitle') + " " + t('contact.according_to_hours'),
                info: t('contact_info.phone'),
                link: 'tel:+21671385385',
                color: '#96cc39',
                delay: 200,
              },
              {
                icon: Mail,
                title: t('contact.email_section'),
                subtitle: t('contact.email_subtitle'),
                info: contactEmail,
                link: `mailto:${contactEmail}`,
                color: '#64381b',
                delay: 400,
              },
              {
                icon: MapPin,
                title: t('contact.address_section'),
                subtitle: t('contact.address_subtitle'),
                info: t('contact_info.address'),
                color: '#96cc39',
                delay: 600,
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${item.delay}ms` }}
              >
                <div className={`w-14 h-14 bg-opacity-10 rounded-full flex items-center justify-center mb-4`}
                     style={{ backgroundColor: `${item.color}20` }}>
                  <item.icon size={24} style={{ color: item.color }} />
                </div>
                <h3 className="font-playfair text-xl mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-3">{item.subtitle}</p>
                {item.link ? (
                  <a
                    href={item.link}
                    className="hover:underline transition-colors text-lg"
                    style={{ color: item.color }}
                  >
                    {item.info}
                  </a>
                ) : (
                  <span style={{ color: item.color }} className="text-lg">{item.info}</span>
                )}
              </div>
            ))}
          </div>

          <div className={`grid lg:grid-cols-2 gap-8 items-start`}>
            {/* Contact Form */}
            <div 
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-700 transform h-full ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
              }`}
              style={{ 
                transitionDelay: '400ms', 
                width: '100%'
              }}
            >
              <h2 className="text-2xl md:text-3xl font-playfair mb-6 flex items-center">
                <Send className="mr-3 text-[#96cc39]" size={28} />
                {isB2B ? t('contact.form_title') : t('contact.form_title_b2c')}
              </h2>
              
              <AnimatePresence mode="wait">
                {showThankYou ? (
                  <motion.div
                    key="thank-you"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20 
                    }}
                    className="bg-[#96cc39]/10 rounded-xl p-8 text-center relative overflow-hidden"
                    style={{ minHeight: "400px" }}
                  >
                    <motion.div 
                      className="absolute inset-0 z-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.05 }}
                    >
                      {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute"
                          initial={{ 
                            x: Math.random() * 100 - 50 + "%", 
                            y: Math.random() * 100 + "%",
                            opacity: 0
                          }}
                          animate={{ 
                            y: [null, "-100%"],
                            opacity: [0, 1, 0],
                            rotate: Math.random() * 360
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 3 + Math.random() * 2,
                            delay: Math.random() * 2
                          }}
                        >
                          {React.createElement(
                            thankYouIcons[Math.floor(Math.random() * thankYouIcons.length)], 
                            { 
                              size: 16 + Math.floor(Math.random() * 18),
                              className: "text-[#96cc39]/30" 
                            }
                          )}
                        </motion.div>
                      ))}
                    </motion.div>

                    <motion.div 
                      className="relative z-10 flex flex-col items-center justify-center h-full"
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.1, type: "spring" }}
                    >
                      <motion.div 
                        className="flex justify-center mb-6"
                        initial={{ scale: 0.5, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div className="bg-[#96cc39] w-24 h-24 rounded-full flex items-center justify-center text-white">
                          <CheckCircle2 size={48} />
                        </div>
                      </motion.div>
                      
                      <motion.h3 
                        className="text-3xl md:text-4xl font-semibold text-[#64381b] mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {t('contact.thank_you_title')}
                      </motion.h3>
                      
                      <motion.p 
                        className="text-gray-600 text-lg md:text-xl max-w-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {isB2B ? t('contact.thank_you_b2b') : t('contact.thank_you_b2c')}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="contact-form"
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          {t('contact.first_name')} *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            formErrors.firstName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#96cc39]'
                          } focus:ring-2 focus:border-transparent transition-all`}
                          placeholder={t('contact.first_name_placeholder')}
                        />
                        {formErrors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          {t('contact.last_name')} *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            formErrors.lastName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#96cc39]'
                          } focus:ring-2 focus:border-transparent transition-all`}
                          placeholder={t('contact.last_name_placeholder')}
                        />
                        {formErrors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          {t('contact.email')} *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            formErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#96cc39]'
                          } focus:ring-2 focus:border-transparent transition-all`}
                          placeholder={t('contact.email_placeholder')}
                        />
                        {formErrors.email && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          {t('contact.phone')} *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            formErrors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#96cc39]'
                          } focus:ring-2 focus:border-transparent transition-all`}
                          placeholder={t('contact.phone_placeholder')}
                        />
                        {formErrors.phone && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('contact.subject')}
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#96cc39] focus:border-transparent transition-all"
                        placeholder={t('contact.subject_placeholder')}
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        {isB2B ? t('contact.message') : t('contact.complaint')} *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          formErrors.message ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#96cc39]'
                        } focus:ring-2 focus:border-transparent transition-all resize-none`}
                        placeholder={isB2B ? t('contact.message_placeholder') : t('contact.complaint_placeholder')}
                      />
                      {formErrors.message && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`
                        w-full px-6 py-4 rounded-lg bg-gradient-to-r from-[#96cc39] to-[#7ba32f] text-white font-medium text-lg
                        flex items-center justify-center space-x-2
                        transform transition-all duration-300
                        ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:translate-y-[-2px] hover:shadow-lg'}
                      `}
                    >
                      <span>{isSubmitting ? t('contact.sending') : (isB2B ? t('contact.send_message') : t('contact.send_complaint'))}</span>
                      <Send size={20} className={isSubmitting ? 'animate-pulse' : ''} />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Business Hours & Map Container - Now shown for both B2B and B2C */}
            <div 
              className={`space-y-6 transition-all duration-700 transform h-full flex flex-col ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              {/* Business Hours - Show for both B2B and B2C */}
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-playfair mb-6 flex items-center">
                  <Clock className="mr-3 text-[#96cc39]" size={24} />
                  {t('contact.business_hours')}
                </h2>

                <div className="space-y-3">
                  {BUSINESS_HOURS.map((schedule, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-3 rounded-lg transition-colors ${
                        schedule.isOpen ? 'bg-green-50' : 'bg-gray-50'
                      }`}
                    >
                      <span className="text-base font-medium">{schedule.day}</span>
                      <span
                        className={`text-base ${
                          schedule.isOpen ? 'text-[#96cc39] font-medium' : 'text-gray-500'
                        }`}
                      >
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map - Show only for B2B */}
              {isB2B && (
                <div className="bg-white rounded-xl p-8 shadow-lg flex-1">
                  <h2 className="text-2xl md:text-3xl font-playfair mb-6 flex items-center">
                    <MapPin className="mr-3 text-[#96cc39]" size={28} />
                    {t('contact.our_location')}
                  </h2>
                  
                  <div className="h-[350px] w-full rounded-lg overflow-hidden shadow-md relative z-10">
                    <MapContainer 
                      center={TAZART_POSITION} 
                      zoom={15} 
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={TAZART_POSITION}>
                        <Popup>
                          <div className="font-medium">Tazart</div>
                          <div className="text-sm text-gray-600">{t('contact_info.address')}</div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
