
import { motion } from 'framer-motion';
import DateFarcieComposer from '../components/dates/DateFarcieComposer';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useApp } from '../context/AppContext';
import ScrollToTop from '../components/ScrollToTop';

const DateFarcie = () => {
  const { t } = useTranslation();
  const { clientType } = useApp();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{t('date_composer.page_title')} | Tazart</title>
      </Helmet>
      
      <Navbar 
        clientType={clientType || 'B2C'} 
        onPageChange={() => {}}
        currentPage="dattes-farcies"
        onClientTypeChange={() => {}}
      />
      
      <motion.div
        className="flex-grow pt-32 pb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <DateFarcieComposer />
      </motion.div>
      
      <ScrollToTop />
    </div>
  );
};

export default DateFarcie;
