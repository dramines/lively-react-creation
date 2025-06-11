import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Header from '@/components/Header';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';

const ChildCount = () => {
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const navigate = useNavigate();

  const childOptions = [
    { count: 1, title: '1 héros', subtitle: '1 livre unique pour lui', image: '/1.png' },
    { count: 2, title: '2 héros', subtitle: '1 livre unique pour chacun', image: '/2.png' },
    { count: 3, title: '3 héros', subtitle: '1 livre unique pour chacun', image: '/3.png' },
    { count: 4, title: '4 héros', subtitle: '1 livre unique pour chacun', image: '/4.png' }
  ];

  const handleCardClick = (count: number) => {
    setSelectedCount(count);
    // Automatically navigate to next page after a brief delay
    setTimeout(() => {
      navigate('/personalize', { state: { childCount: count } });
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 md:py-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-60 animate-float"></div>
          <div className="absolute top-32 right-1/4 w-12 h-12 bg-pink-200 rounded-full opacity-50 animate-float-delayed"></div>
          <div className="absolute bottom-40 left-1/3 w-20 h-20 bg-purple-200 rounded-full opacity-40 animate-float"></div>
          <div className="absolute top-40 left-1/6 w-8 h-8 bg-blue-200 rounded-full opacity-70 animate-float-delayed"></div>
          <div className="absolute bottom-60 right-1/5 w-14 h-14 bg-green-200 rounded-full opacity-50 animate-float"></div>
        </div>

        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-slate-800">Combien d'enfants dans cette aventure?</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-600 to-orange-500 animate-gradient">
                
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Choisissez le nombre d'enfants qui vivront cette histoire extraordinaire
            </p>
          </div>

          {/* Progress steps moved here, after the question */}
          <div className="flex justify-center mb-8 md:mb-12">
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="w-8 h-8 bg-sweet-mint rounded-full flex items-center justify-center shadow-md">
                <Check className="w-4 h-4 text-slate-700" />
              </div>
              <div className="w-6 md:w-8 h-1 bg-sweet-mint"></div>
              <div className="w-8 h-8 bg-light-coral rounded-full flex items-center justify-center shadow-md">
                <span className="text-slate-700 text-sm font-bold">2</span>
              </div>
              <div className="w-6 md:w-8 h-1 bg-gray-300"></div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-bold">3</span>
              </div>
              <div className="w-6 md:w-8 h-1 bg-gray-300"></div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-bold">4</span>
              </div>
            </div>
          </div>

          
          <div className="max-w-3xl mx-auto space-y-4 md:space-y-6 mb-8 md:mb-12 px-4">
            {childOptions.map((option) => (
              <div
                key={option.count}
                onClick={() => handleCardClick(option.count)}
                className={`relative bg-cream-beige/90 backdrop-blur-sm rounded-2xl md:rounded-3xl p-0 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] flex items-center shadow-xl border-2 overflow-hidden
                  ${selectedCount === option.count 
                    ? 'ring-4 ring-pastel-lavender shadow-2xl scale-[1.02] border-pastel-lavender bg-gradient-to-r from-pastel-lavender/20 to-powder-pink/20' 
                    : 'hover:shadow-2xl border-gray-100 hover:border-pastel-lavender hover:bg-gradient-to-r hover:from-pastel-lavender/10 hover:to-powder-pink/10'
                  }
                `}
              >
                {selectedCount === option.count && (
                  <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-10 h-10 md:w-12 md:h-12 bg-pastel-lavender rounded-full flex items-center justify-center shadow-xl z-10">
                    <Check className="text-slate-700 w-5 h-5 md:w-6 md:h-6 font-bold" />
                  </div>
                )}

                <div className="flex items-center justify-center w-full gap-6 md:gap-8 p-6 md:p-8">
                  <div className="flex-shrink-0">
                    <img
                      src={option.image}
                      alt="Héros de l'histoire"
                      className="w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 object-cover rounded-xl"
                    />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 leading-tight text-slate-700">{option.title}</h3>
                    <p className="text-slate-600 text-base md:text-lg lg:text-xl font-medium">{option.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TestimonialsCarousel />
    </div>
  );
};

export default ChildCount;
