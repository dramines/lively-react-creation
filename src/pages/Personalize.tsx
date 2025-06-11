
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChildForm from '@/components/ChildForm';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';

const Personalize = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const childCount = location.state?.childCount || 1;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [children, setChildren] = useState(
    Array.from({ length: childCount }, () => ({
      name: '',
      age: '',
      message: '',
      photoUrl: '',
      photo: undefined,
      objective: ''
    }))
  );

  const updateChild = (index: number, field: string, value: string | File) => {
    const newChildren = [...children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    setChildren(newChildren);
  };

  const handlePhotoUpload = (index: number, file: File | null) => {
    if (file) {
      const newChildren = [...children];
      newChildren[index] = { 
        ...newChildren[index], 
        photo: file,
        photoUrl: URL.createObjectURL(file)
      };
      setChildren(newChildren);
    }
  };

  const isCurrentChildValid = () => {
    const child = children[currentStep];
    return child.name.trim() !== '' && 
           child.age.trim() !== '' &&
           child.message.trim() !== '' &&
           child.objective &&
           child.photo;
  };

  const handleNext = () => {
    if (currentStep < childCount - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // All children completed, navigate to plan selection
      navigate('/plan-selection', { state: { children } });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/children');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 relative overflow-hidden font-baloo">
      <Header />
      
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-20 h-20 bg-gradient-to-br from-green-200 to-teal-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-30 animate-bounce"></div>
      </div>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 relative z-10 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            <span className="text-slate-800">
              Personnalisez votre histoire✨
            </span>
          </h1>
        </div>

        {/* Progress steps for the main flow */}
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-sweet-mint rounded-full flex items-center justify-center shadow-md">
              <Check className="w-3 h-3 md:w-4 md:h-4 text-slate-700" />
            </div>
            <div className="w-4 md:w-8 h-1 bg-sweet-mint"></div>
            <div className="w-6 h-6 md:w-8 md:h-8 bg-light-coral rounded-full flex items-center justify-center shadow-md">
              <span className="text-slate-700 text-xs md:text-sm font-bold">2</span>
            </div>
            <div className="w-4 md:w-8 h-1 bg-gray-300"></div>
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xs md:text-sm font-bold">3</span>
            </div>
            <div className="w-4 md:w-8 h-1 bg-gray-300"></div>
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xs md:text-sm font-bold">4</span>
            </div>
          </div>
        </div>

        {/* Child count text moved here */}
        <div className="text-center mb-6 md:mb-8">
          <p className="text-sm md:text-lg text-slate-600">
            {childCount > 1 
              ? `Enfant ${currentStep + 1} sur ${childCount} - Chaque détail compte`
              : 'Chaque détail compte pour créer l\'aventure parfaite'
            }
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-slate-700 mb-4 md:mb-6 text-center">
              {childCount > 1 ? `Enfant ${currentStep + 1}` : 'Votre enfant'}
            </h2>
            <ChildForm
              child={children[currentStep]}
              childNumber={currentStep + 1}
              totalChildren={childCount}
              onUpdate={(field, value) => updateChild(currentStep, field, value)}
              onPhotoUpload={(file) => handlePhotoUpload(currentStep, file)}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center max-w-3xl mx-auto gap-4">
          <Button
            onClick={handleBack}
            variant="outline"
            className="w-full md:w-auto flex items-center gap-2 px-4 md:px-6 py-3 rounded-full border-2 border-slate-300 hover:border-orange-300 transition-colors text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentStep > 0 ? 'Enfant précédent' : 'Retour'}
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isCurrentChildValid()}
            className={`
              w-full md:w-auto flex items-center gap-2 px-6 md:px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base
              ${isCurrentChildValid() 
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {currentStep < childCount - 1 ? 'Enfant suivant' : 'Continuer vers la sélection'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <TestimonialsCarousel />
    </div>
  );
};

export default Personalize;
