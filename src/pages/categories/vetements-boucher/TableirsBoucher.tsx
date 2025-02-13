
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const TableirsBoucher = () => {
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
          alt="Tabliers de Boucher"
          className="w-full h-[300px] md:h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tabliers de Boucher</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">Protection renforcée pour les professionnels de la boucherie</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg mb-2">Matériaux Premium</h3>
          <p className="text-gray-600">Tissus résistants aux taches et à l'usure, spécialement conçus pour la boucherie.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg mb-2">Protection Optimale</h3>
          <p className="text-gray-600">Design ergonomique offrant une protection maximale contre les coupures et les éclaboussures.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg mb-2">Confort Durable</h3>
          <p className="text-gray-600">Ajustable et léger pour un confort optimal pendant de longues heures de travail.</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="group relative bg-white rounded-lg shadow-sm overflow-hidden border">
            <div className="aspect-square bg-gray-100">
              <img
                src="/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png"
                alt={`Tablier ${item}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Tablier Professionnel Premium</h3>
              <p className="text-gray-600 text-sm mb-3">Tablier de boucher haute résistance avec protection renforcée</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">49.99 €</span>
                <Button>Personnaliser</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableirsBoucher;
