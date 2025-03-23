
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher = ({ className = '' }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLanguage);
    // Optionally store the language preference
    localStorage.setItem('i18nextLng', newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`relative transition-all duration-300 hover:scale-110 ${className}`}
      aria-label={`Switch to ${currentLanguage === 'en' ? 'French' : 'English'}`}
    >
      <img 
        src={currentLanguage.startsWith('fr') ? '../languages/fr.jpg' : '../languages/en.jpg'} 
        alt={currentLanguage.startsWith('fr') ? 'Drapeau français' : 'English flag'} 
        width={28} // Reduced by 5% from 30
        height={21} // Reduced by 5% from 22
        className="rounded-sm shadow-sm"
      />
    </button>
  );
};

export default LanguageSwitcher;
