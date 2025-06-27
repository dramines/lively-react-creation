
import { useTranslation } from 'react-i18next';

interface LanguageSelectorProps {
  variant?: 'default' | 'white';
}

const LanguageSelector = ({ variant = 'default' }: LanguageSelectorProps) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLanguage);
  };

  const currentFlag = i18n.language === 'fr' 
    ? "/lovable-uploads/172ea21b-fc4d-4fbc-84b0-f59dc8b5cba5.png"
    : "/lovable-uploads/14d8618b-5a57-43af-861e-45ed098cd56f.png";
  
  const currentAlt = i18n.language === 'fr' ? "Français" : "English";

  return (
    <div className="flex items-center">
      <button
        onClick={toggleLanguage}
        className={`w-8 h-6 overflow-hidden rounded border-2 transition-all hover:scale-110 ${
          variant === 'white' 
            ? 'border-white/50 hover:border-white' 
            : 'border-gray-300 hover:border-gray-500'
        }`}
      >
        <img 
          src={currentFlag}
          alt={currentAlt}
          className="w-full h-full object-cover"
        />
      </button>
    </div>
  );
};

export default LanguageSelector;
