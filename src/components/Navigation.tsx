
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'fr'>('fr');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(lang => lang === 'en' ? 'fr' : 'en');
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-4' : 'bg-transparent py-6'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <a href="/" className="text-soft-black font-medium text-xl">Brand</a>
            
            <div className="flex items-center gap-8">
              <div className="hidden md:flex items-center space-x-8">
                {['Products', 'Features', 'About'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-soft-black/80 hover:text-soft-black transition-colors duration-200"
                  >
                    {item}
                  </a>
                ))}
              </div>

              {/* Language Switcher */}
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img
                  src={`/languages/${language}.png`}
                  alt={language}
                  className="w-6 h-4 object-cover rounded"
                />
                <span className="text-soft-black font-medium">
                  {language.toUpperCase()}
                </span>
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-soft-black"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Always white background */}
      <div
        className={`fixed inset-0 bg-white transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <a href="/" className="text-soft-black font-medium text-xl">
                Brand
              </a>
              <button
                className="p-2 text-soft-black"
                onClick={() => setIsOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col space-y-6">
              {['Products', 'Features', 'About'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-soft-black/80 hover:text-soft-black transition-colors duration-200 text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t">
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-3 text-soft-black"
              >
                <img
                  src={`/languages/${language}.png`}
                  alt={language}
                  className="w-6 h-4 object-cover rounded"
                />
                <span className="font-medium">
                  {language === 'en' ? 'English' : 'Français'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
