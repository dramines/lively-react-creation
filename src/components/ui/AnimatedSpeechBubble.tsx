
import { useState, useEffect } from 'react';

const AnimatedSpeechBubble = () => {
  const [currentText, setCurrentText] = useState('');
  const [showBubble, setShowBubble] = useState(true);

  useEffect(() => {
    // Progressive typing of "Bonjour" (without period)
    const texts = ['b', 'bo', 'bon', 'bonj', 'bonjo', 'bonjou', 'bonjour'];
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < texts.length) {
        setCurrentText(texts[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // After typing is complete, wait 10 seconds then hide
        setTimeout(() => {
          setShowBubble(false);
        }, 10000);
      }
    }, 400);

    return () => clearInterval(typingInterval);
  }, []);

  if (!showBubble) return null;

  return (
    <div className="absolute -top-16 sm:-top-20 md:-top-24 left-1/2 transform -translate-x-1/2 z-10">
      <div className="relative bg-white rounded-2xl px-6 py-3 sm:px-8 sm:py-4 shadow-lg border-2 border-orange-300 max-w-sm sm:max-w-md">
        <p className="text-orange-600 font-bold text-center text-sm sm:text-base md:text-lg">
          {currentText}
        </p>
        {/* Speech bubble tail */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-orange-300"></div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedSpeechBubble;
