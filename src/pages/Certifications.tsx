
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Shield, FileCheck, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { useIsMobile } from '../hooks/use-mobile';

const Certifications = () => {
  const [selectedCert, setSelectedCert] = useState<number | null>(null);
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const certifications = [
    {
      id: 1,
      title: t('certifications.iso_22000.title'),
      icon: <Shield className="w-8 h-8 text-[#96cc39]" />,
      image: "https://i0.wp.com/www.delice.tn/wp-content/uploads/2019/02/second-certificat.png?w=304&ssl=1",
      description: t('certifications.iso_22000.description'),
      year: "2023",
      issuer: t('certifications.iso_22000.issuer')
    },
    {
      id: 2,
      title: t('certifications.bio.title'),
      icon: <FileCheck className="w-8 h-8 text-[#96cc39]" />,
      image: "https://i0.wp.com/www.delice.tn/wp-content/uploads/2019/02/second-certificat.png?w=304&ssl=1",
      description: t('certifications.bio.description'),
      year: "2023",
      issuer: t('certifications.bio.issuer')
    }
  ];

  // Certification bodies logos
  const certificationBodies = [
    {
      id: 1,
      name: "Bureau Veritas Certification",
      logo: "https://i.ibb.co/ycH2nmtk/Bureau-Veritas-Certification.jpg",
      link: "https://www.bureauveritas.fr/certification"
    },
    {
      id: 2,
      name: "UKAS",
      logo: "https://i.ibb.co/Gvy21TSL/OIP.jpg",
      link: "https://www.ukas.com/"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7F4] to-white pt-28 pb-16 relative mt-8">
      <Helmet>
        <title>{t('certifications.meta.title')}</title>
        <meta name="description" content={t('certifications.meta.description')} />
      </Helmet>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#96cc39]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#700100]/5 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 text-center mb-16"
      >
        <h1 className="text-4xl font-playfair text-[#700100] mb-4">{t('certifications.title')}</h1>
        <div className="w-24 h-1 bg-[#96cc39] mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('certifications.subtitle')}
        </p>
      </motion.div>


      {/* Featured Large Certificate */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 mb-16"
      >
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 relative overflow-hidden">
          <div className="mb-10 flex justify-center">
            <img 
              src="/lovable-uploads/794151aa-42f6-4d37-9e97-38e9561198f9.png"
              alt={t('certifications.fssc_22000.alt')} 
              className="h-[500px] w-auto object-contain transition-transform duration-700 hover:scale-105"
            />
          </div>
          
          <h2 className="text-3xl font-playfair text-[#700100] text-center mb-6">
            {t('certifications.fssc_22000.title')}
          </h2>
          
          
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">{t('certifications.issued_by')}</p>
              <p className="font-medium text-[#700100] text-lg">{t('certifications.fssc_22000.issuer')}</p>
            </div>
           
          </div>
          
          <p className="text-gray-600 leading-relaxed text-center max-w-3xl mx-auto mb-8">
            {t('certifications.fssc_22000.description')}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="px-4 py-2 bg-[#96cc39]/10 text-[#64381b] rounded-full text-sm">
              {t('certifications.fssc_22000.tag1')}
            </span>
            <span className="px-4 py-2 bg-[#96cc39]/10 text-[#64381b] rounded-full text-sm">
              {t('certifications.fssc_22000.tag2')}
            </span>
            <span className="px-4 py-2 bg-[#96cc39]/10 text-[#64381b] rounded-full text-sm">
              {t('certifications.fssc_22000.tag3')}
            </span>
          </div>

          {/* Certification Bodies Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="container mx-auto px-4 mb-16"
          >
            <div className="max-w-3xl mx-auto flex justify-center gap-8">
              {certificationBodies.map((body) => (
                <motion.div
                  key={body.id}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col items-center transition-all duration-300"
                >
                  <div className="h-16 mb-4 flex items-center justify-center">
                    <img 
                      src={body.logo} 
                      alt={body.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`border-[#96cc39] ${isMobile ? 'text-[#700100] bg-white hover:bg-[#96cc39]/20' : 'text-[#700100] hover:bg-[#96cc39]'} hover:text-white text-xs bg-white dark:bg-white dark:text-[#700100]`}
                    onClick={() => window.open(body.link, '_blank')}
                  >
                    {t('partners.visit_website') || "Visiter le site"} <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="flex justify-center">
            <Button 
              variant="default" 
              className={`${isMobile ? 'bg-[#700100] text-white' : 'bg-[#700100]'} hover:bg-[#96cc39] text-white transition-colors duration-300`}
              onClick={() => window.open('https://www.fssc.com/public-register/TUN-1-6756-936662/', '_blank')}
            >
              {t('certifications.verify_button')} <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#700100] text-white hover:bg-[#96cc39] transition-colors"
              >
                <X size={20} />
              </button>
              
              {certifications.find(c => c.id === selectedCert) && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    {certifications.find(c => c.id === selectedCert)?.icon}
                    <h2 className="text-2xl font-playfair text-[#700100]">
                      {certifications.find(c => c.id === selectedCert)?.title}
                    </h2>
                  </div>
                  <div className="relative overflow-hidden rounded-xl">
                    <motion.img
                      src={certifications.find(c => c.id === selectedCert)?.image}
                      alt={certifications.find(c => c.id === selectedCert)?.title}
                      className="w-full rounded-lg shadow-md cursor-zoom-in transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">{t('certifications.issued_by')}</p>
                      <p className="font-medium text-[#700100]">
                        {certifications.find(c => c.id === selectedCert)?.issuer}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">{t('certifications.year')}</p>
                      <p className="font-medium text-[#700100]">
                        {certifications.find(c => c.id === selectedCert)?.year}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {certifications.find(c => c.id === selectedCert)?.description}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quality Statement */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="container mx-auto px-4 max-w-4xl"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-center mb-6">
            <Award className="w-12 h-12 text-[#96cc39]" />
          </div>
          <h2 className="text-3xl font-playfair text-[#700100] text-center mb-6">
            {t('certifications.quality_statement.title')}
          </h2>
          <div className="space-y-4 text-center">
            <p className="text-gray-600 leading-relaxed">
              {t('certifications.quality_statement.paragraph1')}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {t('certifications.quality_statement.paragraph2')}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Certifications;