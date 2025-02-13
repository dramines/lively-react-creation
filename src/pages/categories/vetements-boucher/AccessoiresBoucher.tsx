
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const AccessoiresBoucher = () => {
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
          alt="Accessoires de Boucher"
          className="w-full h-[300px] md:h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Accessoires de Boucher</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">Équipements spécialisés pour une pratique professionnelle</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg mb-2">Qualité Professionnelle</h3>
          <p className="text-gray-600">Accessoires conçus pour répondre aux exigences du métier.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg mb-2">Sécurité Maximale</h3>
          <p className="text-gray-600">Protection optimale pour chaque tâche spécifique.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg mb-2">Praticité</h3>
          <p className="text-gray-600">Accessoires ergonomiques pour faciliter le travail quotidien.</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="group relative bg-white rounded-lg shadow-sm overflow-hidden border">
            <div className="aspect-square bg-gray-100">
              <img
                src="/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png"
                alt={`Accessoire ${item}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Accessoire Professionnel</h3>
              <p className="text-gray-600 text-sm mb-3">Accessoire spécialisé pour boucher</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">29.99 €</span>
                <Button>Commander</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccessoiresBoucher;
