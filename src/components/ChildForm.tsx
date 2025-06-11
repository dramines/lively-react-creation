
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Heart, User, Calendar, MessageSquare, Camera, Target } from 'lucide-react';

interface Child {
  name: string;
  age: string;
  message: string;
  photo?: File;
  photoUrl?: string;
  objective?: string;
}

interface ChildFormProps {
  child: Child;
  childNumber: number;
  totalChildren: number;
  onUpdate: (field: keyof Child, value: string | File) => void;
  onPhotoUpload: (file: File | null) => void;
}

const ChildForm = ({ child, childNumber, totalChildren, onUpdate, onPhotoUpload }: ChildFormProps) => {
  const ageOptions = Array.from({ length: 15 }, (_, i) => i + 3); // Ages 3-17
  
  const objectiveOptions = [
    { value: 'courage', label: 'Développer le courage' },
    { value: 'confiance', label: 'Renforcer la confiance en soi' },
    { value: 'creativite', label: 'Stimuler la créativité' }
  ];

  const handlePhotoUpload = (file: File | null) => {
    if (file) {
      // Create a smaller version of the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const MAX_SIZE = 300;
        let { width, height } = img;
        
        if (width > height) {
          if (width > MAX_SIZE) {
            height = (height * MAX_SIZE) / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = (width * MAX_SIZE) / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            onPhotoUpload(compressedFile);
          }
        }, 'image/jpeg', 0.8);
      };
      
      img.src = URL.createObjectURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="group bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50">
        {/* Card Header with Photo */}
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg overflow-hidden">
            {child.photoUrl ? (
              <img 
                src={child.photoUrl} 
                alt={child.name || `Enfant ${childNumber}`}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span>{childNumber}</span>
            )}
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-800">
              {child.name || `Enfant ${childNumber}`}
            </h3>
            {totalChildren > 1 && (
              <p className="text-sm text-slate-500">Enfant {childNumber} sur {totalChildren}</p>
            )}
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="flex items-center text-slate-700 font-semibold text-sm md:text-base gap-2">
              <User className="w-4 h-4 text-orange-500" />
              Prénom <span className="text-red-500">*</span>
            </label>
            <Input
              value={child.name}
              onChange={(e) => onUpdate('name', e.target.value)}
              placeholder="Ex: Emma, Lucas..."
              className="w-full px-4 py-3 md:py-4 rounded-xl border-2 border-slate-200 focus:border-orange-400 focus:ring-orange-200 transition-all duration-200 text-base bg-white/80 backdrop-blur-sm"
            />
          </div>

          {/* Age Field */}
          <div className="space-y-2">
            <label className="flex items-center text-slate-700 font-semibold text-sm md:text-base gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              Âge <span className="text-red-500">*</span>
            </label>
            <Select value={child.age} onValueChange={(value) => onUpdate('age', value)}>
              <SelectTrigger className="w-full px-4 py-3 md:py-4 rounded-xl border-2 border-slate-200 focus:border-orange-400 transition-all duration-200 text-base bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="Sélectionnez l'âge" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {ageOptions.map((age) => (
                  <SelectItem key={age} value={age.toString()} className="px-4 py-2 hover:bg-orange-50 cursor-pointer">
                    {age} ans
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Objective Field */}
          <div className="space-y-2">
            <label className="flex items-center text-slate-700 font-semibold text-sm md:text-base gap-2">
              <Target className="w-4 h-4 text-orange-500" />
              Objectif <span className="text-red-500">*</span>
            </label>
            <Select value={child.objective} onValueChange={(value) => onUpdate('objective', value)}>
              <SelectTrigger className="w-full px-4 py-3 md:py-4 rounded-xl border-2 border-slate-200 focus:border-orange-400 transition-all duration-200 text-base bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="Choisissez un objectif" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-slate-200 rounded-xl shadow-lg">
                {objectiveOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="px-4 py-2 hover:bg-orange-50 cursor-pointer">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <label className="flex items-center text-slate-700 font-semibold text-sm md:text-base gap-2">
              <Camera className="w-4 h-4 text-orange-500" />
              Photo à déposer <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 md:p-6 text-center hover:border-orange-400 hover:bg-orange-50/50 transition-all duration-300 cursor-pointer group/upload active:scale-95">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e.target.files?.[0] || null)}
                className="hidden"
                id={`photo-${childNumber}`}
              />
              <label htmlFor={`photo-${childNumber}`} className="cursor-pointer block">
                {child.photoUrl ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full overflow-hidden border-4 border-green-200">
                      <img 
                        src={child.photoUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-green-600 font-semibold text-sm md:text-base">Photo téléchargée ✓</p>
                    <p className="text-xs text-slate-500">Cliquez pour changer</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="w-6 h-6 md:w-8 md:h-8 mx-auto text-slate-400 group-hover/upload:text-orange-500 transition-colors" />
                    <div>
                      <p className="text-slate-700 font-medium text-sm md:text-base">Ajoutez une photo</p>
                      <p className="text-xs md:text-sm text-slate-500 mt-1">Photo requise pour personnaliser l'histoire</p>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="flex items-center text-slate-700 font-semibold text-sm md:text-base gap-2">
              <MessageSquare className="w-4 h-4 text-pink-500" />
              Message personnalisé <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={child.message}
              onChange={(e) => onUpdate('message', e.target.value)}
              placeholder="Un message spécial qui apparaîtra dans l'histoire personnalisée... ❤️"
              className="w-full px-4 py-3 md:py-4 rounded-xl border-2 border-slate-200 focus:border-orange-400 focus:ring-orange-200 transition-all duration-200 resize-none text-base bg-white/80 backdrop-blur-sm min-h-[100px]"
              rows={3}
            />
            <p className="text-xs text-slate-500 ml-1">Ce message apparaîtra dans l'histoire personnalisée</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildForm;
