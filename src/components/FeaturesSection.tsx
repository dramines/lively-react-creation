
import { Truck, Paintbrush, FileText, Clock, Shield, BadgeCheck } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Truck className="h-12 w-12 text-primary transition-transform group-hover:scale-110" />,
      secondaryIcon: <Clock className="h-6 w-6 text-secondary absolute -right-2 -top-2" />,
      title: "Livraison Express",
      description: "Service de livraison premium sous 24-48h avec suivi en temps réel de vos commandes professionnelles"
    },
    {
      icon: <Paintbrush className="h-12 w-12 text-primary transition-transform group-hover:scale-110" />,
      secondaryIcon: <Shield className="h-6 w-6 text-secondary absolute -right-2 -top-2" />,
      title: "Personnalisation Expert",
      description: "Solutions sur mesure avec conseils d'experts et matériaux premium pour un résultat professionnel garanti"
    },
    {
      icon: <FileText className="h-12 w-12 text-primary transition-transform group-hover:scale-110" />,
      secondaryIcon: <BadgeCheck className="h-6 w-6 text-secondary absolute -right-2 -top-2" />,
      title: "Devis Détaillé",
      description: "Étude personnalisée gratuite avec analyse complète de vos besoins et recommandations d'experts"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Nos Services Premium</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Des solutions professionnelles adaptées à vos besoins spécifiques, avec une qualité de service irréprochable.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative"
            >
              <div className="mb-6 p-4 rounded-full bg-secondary/5 relative">
                {feature.icon}
                {feature.secondaryIcon}
              </div>
              <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-secondary transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
