
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [showSubtext, setShowSubtext] = useState(false);
  const [startFadeOut, setStartFadeOut] = useState(false);

  const mainText = "LUCCY BY E.Y";
  const subText = "SINCE 2012";

  useEffect(() => {
    // Letter by letter animation
    const letterInterval = setInterval(() => {
      setVisibleLetters(prev => {
        if (prev < mainText.length) {
          return prev + 1;
        } else {
          clearInterval(letterInterval);
          // Show subtext after main text is complete
          setTimeout(() => setShowSubtext(true), 300);
          // Start fade out animation
          setTimeout(() => setStartFadeOut(true), 2000);
          // Complete loading after fade out
          setTimeout(() => onComplete(), 3000);
          return prev;
        }
      });
    }, 120);

    return () => clearInterval(letterInterval);
  }, [mainText.length, onComplete]);

  return (
    <div className={cn(
      "fixed inset-0 z-50 bg-blue-800 transition-opacity duration-1000 ease-out",
      startFadeOut ? "opacity-0" : "opacity-100"
    )}>
      {/* Loading Content */}
      <div className={cn(
        "absolute inset-0 flex flex-col items-center justify-center text-white transition-all duration-1000 ease-out",
        startFadeOut ? "opacity-0 transform translate-y-8" : "opacity-100 transform translate-y-0"
      )}>
        {/* Logo */}
        <div className={cn(
          "mb-4 transition-all duration-800 ease-out delay-100",
          startFadeOut ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"
        )}>
          <img 
            src="/lovable-uploads/adbc8513-f159-41c8-a79a-889beb5d367c.png" 
            alt="Logo" 
            className="w-10 h-10 object-contain"
          />
        </div>

        {/* Main Text - Letter by Letter - Smaller */}
        <div className="text-xl md:text-2xl font-playfair font-bold tracking-wider mb-3">
          {mainText.split('').map((letter, index) => (
            <span
              key={index}
              className={cn(
                "inline-block transition-all duration-500 ease-out",
                index < visibleLetters ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
              )}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </div>

        {/* Subtext - Fade In - Smaller */}
        <div className={cn(
          "text-xs md:text-sm font-playfair tracking-widest transition-all duration-1000 ease-out",
          showSubtext ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-2"
        )}>
          {subText}
        </div>
      </div>

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-700/20 via-transparent to-blue-900/30 pointer-events-none" />
    </div>
  );
};

export default LoadingScreen;
