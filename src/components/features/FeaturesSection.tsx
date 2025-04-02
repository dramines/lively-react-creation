
import { Check, Clock, Headset } from "lucide-react";

const FeaturesSection = () => {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Qualité Premium</h3>
            <p className="text-gray-600">Des matériaux durables sélectionnés avec soin</p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Livraison Rapide</h3>
            <p className="text-gray-600">Expédition sous 24/48h en France</p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headset className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Service Client</h3>
            <p className="text-gray-600">Une équipe à votre écoute 6j/7</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
