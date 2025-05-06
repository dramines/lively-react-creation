
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Battery, Apple, Heart, Zap, Activity } from 'lucide-react';
import BenefitModal from './BenefitModal';
import { useTranslation } from 'react-i18next';

const DatesBenefits = () => {
  const [selectedBenefit, setSelectedBenefit] = useState<typeof benefits[0] | null>(null);
  const { t } = useTranslation();

  const benefits = [
    { 
      id: 1, 
      title: t('dates_benefits.detail_benefits.fiber.title'), 
      icon: <Leaf className="w-6 h-6 text-[#96cc39]" />,
      top: "0%",
      left: "40%",
      content: t('dates_benefits.detail_benefits.fiber.content')
    },
    { 
      id: 2, 
      title: t('dates_benefits.detail_benefits.potassium.title'), 
      icon: <Battery className="w-6 h-6 text-[#96cc39]" />,
      top: "20%",
      left: "72%",
      content: t('dates_benefits.detail_benefits.potassium.content')
    },
    { 
      id: 3, 
      title: t('dates_benefits.detail_benefits.energy.title'), 
      icon: <Zap className="w-6 h-6 text-[#96cc39]" />,
      top: "60%",
      left: "74%",
      content: t('dates_benefits.detail_benefits.energy.content')
    },
    { 
      id: 4, 
      title: t('dates_benefits.detail_benefits.superfood.title'), 
      icon: <Apple className="w-6 h-6 text-[#96cc39]" />,
      top: "75%",
      left: "40%",
      content: t('dates_benefits.detail_benefits.superfood.content')
    },
    { 
      id: 5, 
      title: t('dates_benefits.detail_benefits.antioxidants.title'), 
      icon: <Heart className="w-6 h-6 text-[#96cc39]" />,
      top: "60%",
      left: "7%",
      content: t('dates_benefits.detail_benefits.antioxidants.content')
    },
    { 
      id: 6, 
      title: t('dates_benefits.detail_benefits.vitamins.title'), 
      icon: <Activity className="w-6 h-6 text-[#96cc39]" />,
      top: "20%",
      left: "9%",
      content: t('dates_benefits.detail_benefits.vitamins.content')
    },
  ];

  // Benefits data for the left side text section
  const benefitsList = [
    {
      id: 1,
      title: t('dates_benefits.benefits.nutrition.title'),
      description: t('dates_benefits.benefits.nutrition.description'),
      icon: <Apple className="w-5 h-5" />
    },
    {
      id: 2,
      title: t('dates_benefits.benefits.energy.title'),
      description: t('dates_benefits.benefits.energy.description'),
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 3,
      title: t('dates_benefits.benefits.digestive.title'),
      description: t('dates_benefits.benefits.digestive.description'),
      icon: <Leaf className="w-5 h-5" />
    },
    {
      id: 4,
      title: t('dates_benefits.benefits.antioxidant.title'),
      description: t('dates_benefits.benefits.antioxidant.description'),
      icon: <Heart className="w-5 h-5" />
    },
    {
      id: 5,
      title: t('dates_benefits.benefits.mineral.title'),
      description: t('dates_benefits.benefits.mineral.description'),
      icon: <Battery className="w-5 h-5" />
    }
  ];

  return (
    <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 sm:mb-16"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair text-[#700100] mb-4">
          {t('dates_benefits.title')}
        </h2>
        <div className="w-16 md:w-24 h-1 bg-[#96cc39] mx-auto"></div>
        <p className="mt-6 max-w-2xl mx-auto text-gray-600 px-4">
          {t('dates_benefits.subtitle')}
        </p>
      </motion.div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Left Side - Benefits List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6 md:space-y-8 pr-0 lg:pr-8 order-2 lg:order-1"
        >
          
          {benefitsList.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start gap-3 sm:gap-4 group"
            >
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-[#96cc39]/10 to-[#96cc39]/20 
                            group-hover:from-[#96cc39]/20 group-hover:to-[#96cc39]/30 
                            transition-colors duration-300 mt-1 flex-shrink-0">
                <div className="text-[#96cc39]">
                  {item.icon}
                </div>
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2 group-hover:text-[#700100] transition-colors duration-300">
                  {item.title}
                </h4>
                <p className="text-sm sm:text-base text-gray-600">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-gray-500 italic text-sm sm:text-base">
              "{t('dates_benefits.quote')}"
            </p>
            <p className="mt-2 text-xs sm:text-sm text-gray-400">— {t('dates_benefits.quote_source')}</p>
          </div>
        </motion.div>

        {/* Right Side - Interactive Circle Diagram */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full aspect-square mx-auto max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-full order-1 lg:order-2 mb-8 lg:mb-0"
        >
          <div className="relative w-full h-full">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute left-[30%] top-[27%] -translate-x-1/2 -translate-y-1/2 
                       w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-56 lg:h-56 xl:w-72 xl:h-72 
                       rounded-full overflow-hidden border-4 border-[#96cc39] shadow-xl z-10"
            >
              <img
                src="https://lh3.googleusercontent.com/p/AF1QipOPKVFIo-1nEWX3sPtQLjcHEhyXMcHtfv7d0d39=s1360-w1360-h1020"
                alt="Dates"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.id}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.1 * index,
                  type: "spring",
                  stiffness: 100
                }}
                className="absolute"
                style={{
                  top: benefit.top,
                  left: benefit.left
                }}
              >
                <div 
                  className="absolute left-1/2 top-1/2 h-[2px] bg-gradient-to-r from-[#96cc39]/20 to-[#96cc39] origin-left"
                  style={{
                    width: '30px',
                    transform: 'rotate(45deg)',
                  }}
                />

                <motion.div
                  whileHover={{ 
                    scale: 1.1,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32
                           rounded-full bg-white/90 shadow-lg border border-[#96cc39]/20 
                           flex flex-col items-center justify-center p-2 sm:p-3 md:p-3 lg:p-4
                           cursor-pointer group hover:bg-[#96cc39] hover:border-[#96cc39] 
                           transition-all duration-300 backdrop-blur-sm"
                  onClick={() => setSelectedBenefit(benefit)}
                >
                  <div className="text-[#96cc39] group-hover:text-white transition-colors duration-300">
                    {React.cloneElement(benefit.icon as React.ReactElement, {
                      className: "w-5 h-5 sm:w-6 sm:h-6"
                    })}
                  </div>
                  <p className="text-[9px] sm:text-[10px] md:text-xs xl:text-sm font-medium text-gray-700 
                               group-hover:text-white mt-1 
                               transition-colors duration-300 whitespace-pre-line 
                               text-center leading-tight">
                    {benefit.title}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4 text-center text-xs sm:text-sm text-gray-500">
            <p>{t('dates_benefits.click_info')}</p>
          </div>
        </motion.div>
      </div>

      <BenefitModal
        isOpen={!!selectedBenefit}
        onClose={() => setSelectedBenefit(null)}
        title={selectedBenefit?.title ?? ''}
        content={selectedBenefit?.content ?? ''}
        icon={selectedBenefit?.icon}
      />
    </div>
  );
};

export default DatesBenefits;
