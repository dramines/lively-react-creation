
import React from 'react';
import { Percent } from "lucide-react";

const PromoBar: React.FC = () => {
  return (
    <div className="w-full bg-[#FFD700] py-2">
      <div className="container mx-auto text-center text-sm font-medium flex items-center justify-center gap-2">
        <Percent className="h-4 w-4" />
        <span>Livraison offerte dès 69TND d'achats !</span>
      </div>
    </div>
  );
};

export default PromoBar;
