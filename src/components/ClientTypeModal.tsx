
import { User, Briefcase } from 'lucide-react'; // Import icons
import type { ClientType } from '../types';
import { useTranslation } from 'react-i18next';

interface ClientTypeModalProps {
  onSelect: (type: ClientType) => void;
}

const ClientTypeModal = ({ onSelect }: ClientTypeModalProps) => {
  // Using i18n without t since it's not being used yet
  useTranslation();
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease-in]"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-4 max-w-2xl md:max-w-md sm:max-w-sm w-full shadow-2xl animate-[slideIn_0.5s_ease-out]">
        {/* Header Section */}
        <div className="flex justify-between mb-8 sm:mb-6">
          <div className="text-left">
            <h2 className="text-3xl sm:text-2xl font-playfair text-[#64381b] font-semibold">
              Hello
            </h2>
          </div>
          <div className="text-right">
            <h2 className="text-3xl sm:text-2xl font-playfair text-[#64381b] font-semibold">
            عسلامة
            </h2>
          </div>
        </div>

        {/* Button Options */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-4">
          {/* B2C Button */}
          <button
            onClick={() => onSelect('B2C')}
            className="group relative overflow-hidden rounded-xl bg-white p-6 sm:p-4 border-2 border-[#64381b]/20 hover:border-[#64381b] transition-all duration-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-[#64381b]/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
            <div className="relative flex flex-col items-center text-center">
              <User className="w-10 h-10 text-[#64381b] mb-3 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl sm:text-lg font-playfair mt-1 mb-1 text-gray-900">
                 Particulier
              </h3>
            </div>
          </button>

          {/* B2B Button */}
          <button
            onClick={() => onSelect('B2B')}
            className="group relative overflow-hidden rounded-xl bg-white p-6 sm:p-4 border-2 border-[#96cc39]/20 hover:border-[#96cc39] transition-all duration-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-[#96cc39]/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
            <div className="relative flex flex-col items-center text-center">
              <Briefcase className="w-10 h-10 text-[#96cc39] mb-3 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl sm:text-lg font-playfair mt-1 mb-1 text-gray-900">
                 Professionnel
              </h3>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export { ClientTypeModal };
