
import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Users, Headset } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WhyChooseUs = () => {
  const { t } = useTranslation();
  
  const reasons = [
    {
      id: 1,
      title: t("why_choose_us.quality_title"),
      description: t("why_choose_us.quality_description"),
      icon: <BadgeCheck className="w-8 h-8 text-[#96cc39]" />,
      color: "#96cc39"
    },
    {
      id: 2,
      title: t("why_choose_us.expertise_title"),
      description: t("why_choose_us.expertise_description"),
      icon: <Users className="w-8 h-8 text-[#64381b]" />,
      color: "#64381b"
    },
    {
      id: 3,
      title: t("why_choose_us.service_title"),
      description: t("why_choose_us.service_description"),
      icon: <Headset className="w-8 h-8 text-[#96cc39]" />,
      color: "#96cc39"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-playfair text-[#700100] mb-4">
            {t("why_choose_us.title")}
          </h2>
          <div className="w-24 h-1 bg-[#96cc39] mx-auto"></div>
          <p className="mt-6 max-w-2xl mx-auto text-gray-600">
            {t("why_choose_us.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white rounded-xl p-8 h-full flex flex-col shadow-lg border-t-4"
              style={{ borderColor: reason.color }}
            >
              <div className="flex justify-center mb-6">
                <div className="p-3 rounded-full bg-gray-50">
                  {reason.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                {reason.title}
              </h3>
              
              <p className="text-gray-600 text-center flex-grow">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
