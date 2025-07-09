
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import frTranslations from './locales/fr.json';
import enTranslations from './locales/en.json';
import frLegalTranslations from './locales/legal/fr.json';
import enLegalTranslations from './locales/legal/en.json';
import frContactTranslations from './locales/contact/fr.json';
import enContactTranslations from './locales/contact/en.json';
import frFooterTranslations from './locales/footer/fr.json';
import enFooterTranslations from './locales/footer/en.json';
import frNewsletterTranslations from './locales/newsletter/fr.json';
import enNewsletterTranslations from './locales/newsletter/en.json';
import frProductsTranslations from './locales/products/fr.json';
import enProductsTranslations from './locales/products/en.json';
import frCheckoutTranslations from './locales/checkout/fr.json';
import enCheckoutTranslations from './locales/checkout/en.json';
import frInvoiceTranslations from './locales/invoice/fr.json';
import enInvoiceTranslations from './locales/invoice/en.json';
import frAllProductsTranslations from './locales/all-products/fr.json';
import enAllProductsTranslations from './locales/all-products/en.json';
import frWishlistTranslations from './locales/wishlist/fr.json';
import enWishlistTranslations from './locales/wishlist/en.json';
import frStoreTranslations from './locales/store/fr.json';
import enStoreTranslations from './locales/store/en.json';
import frBookingTranslations from './locales/booking/fr.json';
import enBookingTranslations from './locales/booking/en.json';
import frAnnouncementTranslations from './locales/announcement/fr.json';
import enAnnouncementTranslations from './locales/announcement/en.json';
import frDeliveryTranslations from './locales/delivery/fr.json';
import enDeliveryTranslations from './locales/delivery/en.json';
import frMobileSidebarTranslations from './locales/mobile-sidebar/fr.json';
import enMobileSidebarTranslations from './locales/mobile-sidebar/en.json';
import frHeroButtonsTranslations from './locales/hero-buttons/fr.json';
import enHeroButtonsTranslations from './locales/hero-buttons/en.json';
import frCategoryTitlesTranslations from './locales/category-titles/fr.json';
import enCategoryTitlesTranslations from './locales/category-titles/en.json';

const resources = {
  fr: {
    translation: frTranslations,
    legal: frLegalTranslations,
    contact: frContactTranslations,
    footer: frFooterTranslations,
    newsletter: frNewsletterTranslations,
    products: frProductsTranslations,
    checkout: frCheckoutTranslations,
    invoice: frInvoiceTranslations,
    allProducts: frAllProductsTranslations,
    wishlist: frWishlistTranslations,
    store: frStoreTranslations,
    booking: frBookingTranslations,
    announcement: frAnnouncementTranslations,
    delivery: frDeliveryTranslations,
    mobileSidebar: frMobileSidebarTranslations,
    heroButtons: frHeroButtonsTranslations,
    categoryTitles: frCategoryTitlesTranslations,
  },
  en: {
    translation: enTranslations,
    legal: enLegalTranslations,
    contact: enContactTranslations,
    footer: enFooterTranslations,
    newsletter: enNewsletterTranslations,
    products: enProductsTranslations,
    checkout: enCheckoutTranslations,
    invoice: enInvoiceTranslations,
    allProducts: enAllProductsTranslations,
    wishlist: enWishlistTranslations,
    store: enStoreTranslations,
    booking: enBookingTranslations,
    announcement: enAnnouncementTranslations,
    delivery: enDeliveryTranslations,
    mobileSidebar: enMobileSidebarTranslations,
    heroButtons: enHeroButtonsTranslations,
    categoryTitles: enCategoryTitlesTranslations,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // default language
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
