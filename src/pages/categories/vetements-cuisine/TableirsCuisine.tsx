
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Star } from "lucide-react";

const TableirsCuisine = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8 text-sm text-gray-600">
        <Link to="/vetements-cuisine" className="hover:text-primary">
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Retour aux vêtements cuisine
          </Button>
        </Link>
      </div>

      {/* Hero Section with Description and Image */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-sm border mb-16">
        <div className="flex flex-col md:flex-row">
          {/* Description Part */}
          <div className="flex-1 p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
              Tabliers de Cuisine Professionnels
            </h1>
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed">
                Nos tabliers de cuisine professionnels allient style, durabilité et praticité. 
                Conçus pour répondre aux exigences des chefs les plus exigeants, ils offrent 
                une protection optimale tout en garantissant un confort maximal pendant les 
                longues heures de service.
              </p>
              
              {/* Features List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-primary">Caractéristiques principales:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Star className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Tissu haute résistance aux taches et à la chaleur</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Poches multiples pour un rangement pratique</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Attaches réglables pour un ajustement parfait</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Lavable en machine à 60°C</span>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <div className="pt-4">
                <Button size="lg" className="w-full md:w-auto">
                  Découvrir notre collection
                </Button>
              </div>
            </div>
          </div>

          {/* Image Part */}
          <div className="md:w-[40%] relative">
            <img 
              src="/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png"
              alt="Tablier de cuisine professionnel"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="space-y-16">
        {/* Featured Products */}
        <section>
          <h2 className="text-2xl font-bold mb-8 text-primary">Tabliers Premium</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group">
                <div className="relative rounded-xl overflow-hidden bg-white shadow-sm border">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src="/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png"
                      alt={`Tablier Premium ${item}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Nouveau
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">Tablier Chef Premium</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Tablier professionnel en coton robuste avec finitions haute qualité
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary">79.99 €</span>
                        <span className="text-sm text-gray-500 ml-2 line-through">99.99 €</span>
                      </div>
                      <Button>Personnaliser</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Standard Products */}
        <section>
          <h2 className="text-2xl font-bold mb-8 text-primary">Collection Standard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="group">
                <div className="relative rounded-xl overflow-hidden bg-white shadow-sm border">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src="/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png"
                      alt={`Tablier Standard ${item}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">Tablier Professionnel</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Tablier classique pour un usage quotidien
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">49.99 €</span>
                      <Button>Personnaliser</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TableirsCuisine;
