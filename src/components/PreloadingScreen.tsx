
import { Loader2 } from 'lucide-react';

export const PreloadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <img
          src="logo.png"
          alt="Logo"
          className="w-32 h-32 mx-auto mb-4 animate-pulse"
        />
        <Loader2 className="w-8 h-8 animate-spin text-[#96cc39] mx-auto" />
      </div>
    </div>
  );
};
