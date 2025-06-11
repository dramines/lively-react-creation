
import { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Star } from 'lucide-react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    const duration = 4000; // 4 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    const progressStep = 100 / steps;

    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += progressStep;
      setProgress(Math.min(currentProgress, 100));

      if (currentProgress >= 50) {
        setShowSparkles(true);
      }

      if (currentProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          onLoadingComplete();
        }, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-pastel-blue via-powder-pink to-pastel-lavender flex items-center justify-center p-4">
      {/* Background magical elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white/30" />
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center w-full max-w-md">
        {/* Central magical book animation */}
        <div className="relative mb-6 sm:mb-8 flex justify-center">
          <div className="relative transform animate-float">
            <BookOpen 
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-pastel-lavender animate-pulse"
              style={{ animationDuration: '2s' }}
            />
            
            {/* Sparkles around the book */}
            {showSparkles && (
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <Sparkles
                    key={i}
                    className="absolute w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-sweet-mint animate-ping"
                    style={{
                      left: `${20 + (i % 4) * 20}%`,
                      top: `${20 + Math.floor(i / 4) * 40}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '1.5s'
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Loading text */}
        <div className="mb-6 px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-700 font-baloo mb-2">
            Préparation de votre aventure magique...
          </h2>
          <p className="text-slate-600 font-baloo text-sm sm:text-base md:text-lg">
            Les pages se tournent et l'histoire commence
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto px-4">
          <div className="bg-white/50 rounded-full h-2 sm:h-3 shadow-inner overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sweet-mint to-pastel-lavender rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
          <p className="text-slate-600 font-baloo text-xs sm:text-sm mt-2">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Floating book pages animation - hidden on very small screens */}
        <div className="absolute inset-0 pointer-events-none hidden sm:block">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-6 h-8 sm:w-8 sm:h-10 bg-white/20 rounded-sm animate-float-delayed transform rotate-12"
              style={{
                left: `${10 + i * 20}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + i}s`
              }}
            >
              <div className="w-full h-full border-l-2 border-slate-300/30"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
