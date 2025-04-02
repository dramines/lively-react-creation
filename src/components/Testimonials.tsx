
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Alex Johnson',
    title: 'Product Designer',
    quote: "The attention to detail is remarkable. Every aspect of this product reflects a deep understanding of user needs and an unwavering commitment to quality.",
    image: 'https://placehold.co/100/f5f5f7/1d1d1f?text=AJ'
  },
  {
    id: 2,
    name: 'Sarah Chen',
    title: 'Creative Director',
    quote: "I've used many similar products, but none compare to the thoughtfulness and refinement found here. It's clear that every decision was made with purpose.",
    image: 'https://placehold.co/100/f5f5f7/1d1d1f?text=SC'
  },
  {
    id: 3,
    name: 'Michael Roberts',
    title: 'Design Enthusiast',
    quote: "Simplicity that doesn't sacrifice functionality. The intuitive design makes complex tasks effortless, all while maintaining an elegant aesthetic.",
    image: 'https://placehold.co/100/f5f5f7/1d1d1f?text=MR'
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="testimonials" className="section-padding bg-off-white overflow-hidden">
      <div className="container-padding max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="chip mb-4">What People Say</div>
          <h2 className="mb-4">Experiences that matter</h2>
          <p className="max-w-xl mx-auto">
            See how our products have enhanced the lives of our customers 
            through thoughtful design and exceptional quality.
          </p>
        </div>

        <div className="relative">
          <div className="max-w-3xl mx-auto">
            <div 
              className="relative h-[320px] md:h-[250px] overflow-hidden bg-white rounded-2xl shadow-sm p-8 md:p-12"
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`absolute inset-0 p-8 md:p-12 transition-all duration-700 ease-in-out flex flex-col ${
                    index === activeIndex 
                      ? 'opacity-100 translate-x-0'
                      : index < activeIndex
                        ? 'opacity-0 -translate-x-full'
                        : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className="mb-6">
                    <svg width="42" height="30" viewBox="0 0 42 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.7984 29.5C8.73187 29.5 6.17988 28.3803 4.14242 26.1408C2.10496 23.9013 1.08623 21.0213 1.08623 17.5C1.08623 14.2299 2.0726 11.2997 4.04534 8.70936C6.05198 6.0761 8.53168 3.93856 11.4844 2.29675C14.4371 0.654933 17.5435 0 20.8037 0L20.8037 5.67904C18.5715 5.67904 16.3393 6.18884 14.1072 7.20846C11.9178 8.19517 10.1644 9.48805 8.84701 11.0871C7.56355 12.6861 6.92182 14.3707 6.92182 16.1408H9.76981C10.9238 16.1408 11.9178 16.5649 12.7516 17.4133C13.5855 18.2617 14.0024 19.2813 14.0024 20.4721C14.0024 21.7056 13.5855 22.7252 12.7516 23.5308C11.9178 24.3364 10.9238 24.7392 9.76981 24.7392H6.92182V29.5H11.7984ZM31.4731 29.5C28.4066 29.5 25.8546 28.3803 23.8171 26.1408C21.7797 23.9013 20.7609 21.0213 20.7609 17.5C20.7609 14.2299 21.7473 11.2997 23.72 8.70936C25.7267 6.0761 28.2064 3.93856 31.1591 2.29675C34.1118 0.654933 37.2182 0 40.4784 0V5.67904C38.2462 5.67904 36.014 6.18884 33.7819 7.20846C31.5925 8.19517 29.8391 9.48805 28.5217 11.0871C27.2382 12.6861 26.5965 14.3707 26.5965 16.1408H29.4445C30.5985 16.1408 31.5925 16.5649 32.4263 17.4133C33.2602 18.2617 33.6771 19.2813 33.6771 20.4721C33.6771 21.7056 33.2602 22.7252 32.4263 23.5308C31.5925 24.3364 30.5985 24.7392 29.4445 24.7392H26.5965V29.5H31.4731Z" fill="#e0e0e0"/>
                    </svg>
                  </div>

                  <p className="text-xl italic mb-8">{testimonial.quote}</p>
                  
                  <div className="mt-auto flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover mr-4"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="text-base font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-medium-gray">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button 
              onClick={goToPrevious}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-light-gray transition-colors duration-300 hover:bg-dark-gray hover:border-dark-gray hover:text-white"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex ? 'bg-dark-gray w-8' : 'bg-light-gray'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={goToNext}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-light-gray transition-colors duration-300 hover:bg-dark-gray hover:border-dark-gray hover:text-white"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
