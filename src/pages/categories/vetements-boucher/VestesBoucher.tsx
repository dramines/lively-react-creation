
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const VestesBoucher = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8 text-sm text-gray-600">
        <Link to="/vetements-boucher" className="hover:text-primary">
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Retour aux vêtements boucher
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden mb-12">
        <img 
          src="/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png"
          alt="Vestes de Boucher"
          className="w-full h-[300px] md:h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Vestes de Boucher Pro</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">Confort et hygiène pour les professionnels de la boucherie</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg mb-2">Tissu Respirant</h3>
          <p className="text-gray-600">Matériaux de haute qualité pour un confort optimal toute la journée.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg mb-2">Résistance Supérieure</h3>
          <p className="text-gray-600">Conçu pour résister aux conditions exigeantes du métier.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg mb-2">Design Professionnel</h3>
          <p className="text-gray-600">Style élégant et fonctionnel adapté au milieu professionnel.</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="group relative bg-white rounded-lg shadow-sm overflow-hidden border">
            <div className="aspect-square bg-gray-100">
              <img
                src="/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png"
                alt={`Veste ${item}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Veste Pro Boucher</h3>
              <p className="text-gray-600 text-sm mb-3">Veste professionnelle avec finitions premium</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">69.99 €</span>
                <Button>Personnaliser</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VestesBoucher;
