
import { Users, Award, Globe, Leaf, Book, Trees, Flag, Scroll } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  
  const values = [
    {
      icon: Users,
      titleKey: "about.respect_title",
      descriptionKey: "about.respect_description"
    },
    {
      icon: Award,
      titleKey: "about.excellence_title",
      descriptionKey: "about.excellence_description"
    },
    {
      icon: Globe,
      titleKey: "about.sustainability_title",
      descriptionKey: "about.sustainability_description"
    },
    {
      icon: Leaf,
      titleKey: "about.production_title",
      descriptionKey: "about.production_description"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      <div className="relative h-[350px] mb-24 pt-24">
        <div className="absolute inset-0 pt-30">
          <img
            src="AboutBanner.png"
            alt="Tazart Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#64381b]/20" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center ">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl text-center"
          >
            <h1 className="text-5xl md:text-6xl font-playfair text-black mb-6 mt-16">
              {t('about.our_story')}
            </h1>

            <p className="text-xl md:text-2xl leading-relaxed text-black opacity-90">
              {t('about.tradition_excellence')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-24 pb-24">
        {/* Mission Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-playfair text-[#64381b] mb-6">
                {t('about.our_mission')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('about.mission_text_1')}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {t('about.mission_text_2')}
              </p>
            </div>
            <div className="relative flex md:justify-end justify-center">
              <div className="absolute inset-0 bg-[#64381b]/10 rounded-2xl transform rotate-3"></div>
              <img
                src="aboutpage.jpg"
                alt={t('about.our_mission')}
                className="relative rounded-2xl w-[95%] md:w-[85%] h-[340px] object-cover"
              />
            </div>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-playfair text-[#64381b] mb-12">
            {t('about.our_values')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.titleKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <value.icon className="w-12 h-12 text-[#64381b] mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">{t(value.titleKey)}</h3>
                <p className="text-gray-600">{t(value.descriptionKey)}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Heritage Section - Enhanced with better styling */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-[#64381b] p-6 md:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full opacity-10">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#ffffff" d="M42.8,-65.1C56.9,-56.3,70.7,-46.7,77.7,-33.2C84.7,-19.7,84.9,-2.3,81.2,14.1C77.5,30.6,70,46.1,58.5,58.5C47.1,70.9,31.8,80.1,15.5,82.7C-0.9,85.3,-18.3,81.4,-32.5,73.1C-46.7,64.8,-57.8,52.1,-65.8,37.8C-73.8,23.5,-78.8,7.6,-78.1,-8.2C-77.4,-24.1,-70.9,-39.9,-59.9,-49.8C-48.9,-59.7,-33.3,-63.6,-19.3,-67.5C-5.2,-71.3,7.3,-75,21.5,-75.1C35.8,-75.3,51.8,-71.8,42.8,-65.1Z" transform="translate(100 100)" />
              </svg>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 flex flex-col items-center"
            >
              <span className="text-white/70 uppercase tracking-wider text-sm font-medium mb-1">
                {t('about.discover')}
              </span>
              
              <div className="flex items-center justify-center space-x-4 mb-3">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <Book className="w-5 h-5 text-white" />
                </motion.div>
                
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair">
                  {t('about.our_heritage')}
                </h2>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <Scroll className="w-5 h-5 text-white" />
                </motion.div>
              </div>
              
              <p className="text-center text-white/90 max-w-2xl mb-4 text-base">
                {t('about.heritage_subtitle')}
              </p>
              
              <div className="w-24 h-0.5 bg-white/30 rounded-full" />
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 md:p-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#f8f4f1] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <Trees className="w-6 h-6 text-[#64381b] mr-3" />
                <h3 className="text-xl font-semibold text-[#64381b]">{t('about.heritage_text_1_title')}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t('about.heritage_text_1')}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#f8f4f1] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <Flag className="w-6 h-6 text-[#64381b] mr-3" />
                <h3 className="text-xl font-semibold text-[#64381b]">{t('about.heritage_text_2_title')}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t('about.heritage_text_2')}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#f8f4f1] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <Globe className="w-6 h-6 text-[#64381b] mr-3" />
                <h3 className="text-xl font-semibold text-[#64381b]">{t('about.heritage_text_3_title')}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t('about.heritage_text_3')}
              </p>
            </motion.div>
          </div>
          
          <div className="p-8 md:p-12 bg-[#f8f4f1]/50 border-t border-gray-100">
            <div className="flex items-center justify-center">
              <img 
                src="https://i.ibb.co/KxkCnFLR/logo-tazart-page-0001-removebg-preview.png" 
                alt="Tazart Logo" 
                className="w-16 h-16 object-contain mr-4"
              />
              <p className="text-lg font-medium text-[#64381b] italic">
                {t('about.heritage_footer')}
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;