
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ProductTestimonials = () => {
  const { t } = useTranslation();
  
  const testimonials = [
    {
      id: 1,
      letter: 'A',
      clientTitle: t('testimonials.client_satisfied'),
      text: t('testimonials.testimonial_1')
    },
    {
      id: 2,
      letter: 'B',
      clientTitle: t('testimonials.client_satisfied'),
      text: t('testimonials.testimonial_2')
    },
    {
      id: 3,
      letter: 'C',
      clientTitle: t('testimonials.client_satisfied'),
      text: t('testimonials.testimonial_3')
    }
  ];

  return (
    <div className="mt-24 mb-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-playfair text-[#700100] mb-4">
          {t('testimonials.what_clients_say')}
        </h2>
        <div className="w-24 h-1 bg-[#96cc39] mx-auto mb-4"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: testimonial.id * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#FDF6F0] flex items-center justify-center mr-4">
                <span className="text-[#700100] font-semibold">{testimonial.letter}</span>
              </div>
              <div>
                <h4 className="font-semibold">{testimonial.clientTitle}</h4>
                <div className="flex text-[#96cc39]">
                  {Array(5).fill(0).map((_, j) => (
                    <svg key={j} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "{testimonial.text}"
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductTestimonials;
