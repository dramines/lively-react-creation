import { Truck, Paintbrush, FileText } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Truck className="h-12 w-12 text-secondary" />,
      title: "Livraison Rapide",
      description: "Service de livraison express pour tous vos uniformes professionnels"
    },
    {
      icon: <Paintbrush className="h-12 w-12 text-accent" />,
      title: "Personnalisation Complète",
      description: "Adaptez vos vêtements selon vos besoins spécifiques"
    },
    {
      icon: <FileText className="h-12 w-12 text-muted" />,
      title: "Devis Gratuit",
      description: "Obtenez un devis détaillé sans engagement"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="mb-4 p-3 rounded-full bg-primary/5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
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