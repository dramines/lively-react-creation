
import { Link } from "react-router-dom";
import ProcessSection from "@/components/personalization/ProcessSection";
import PackCard from "@/components/packs/PackCard";
import { menuItems } from "@/config/menuConfig";

const NosPacks = () => {
  // Find the "Nos packs" menu item to access its subitems
  const packsMenuItem = menuItems.find(item => item.title === "Nos packs");
  const packItems = packsMenuItem?.subItems || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-primary">Nos</span>{" "}
          <span className="text-secondary">Packs</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Des solutions complètes adaptées à tous les métiers. Découvrez nos packs professionnels pour équiper votre établissement.
        </p>
      </div>

      {/* Process Section */}
      <ProcessSection />

      {/* Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 my-12">
        {packItems.map((pack) => (
          <PackCard
            key={pack.path}
            title={pack.title}
            description={pack.description}
            imageSrc={pack.image}
            path={pack.path}
          />
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 rounded-xl p-8 my-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Besoin d'un pack sur mesure?</h2>
        <p className="text-gray-600 mb-6">
          Nous pouvons créer un pack personnalisé adapté à vos besoins spécifiques.
        </p>
        <Button className="bg-primary text-white px-6 py-3">
          Contactez-nous
        </Button>
      </div>
    </div>
  );
};

const Button = ({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`rounded-md font-medium transition-colors hover:bg-primary/90 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default NosPacks;
