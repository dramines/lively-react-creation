
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { menuItems } from "@/config/menuConfig";
import { useEffect, useState } from "react";
import Image from "@/components/ui/image";

interface PackItem {
  id: string;
  name: string;
  description: string;
  image: string;
}

// Sample pack content for each pack type
const packItems: Record<string, PackItem[]> = {
  restaurant: [
    { id: "1", name: "Veste de Chef", description: "Veste professionnelle pour cuisine", image: "/VetementDeCuisine/VesteDeChef.jpg" },
    { id: "2", name: "Tablier", description: "Protection pour la cuisine", image: "/VetementDeCuisine/TablierDeChef.jpg" },
    { id: "3", name: "Pantalon de Cuisine", description: "Confort et durabilité", image: "/VetementDeCuisine/PontalonDeChef.jpg" },
    { id: "4", name: "Chaussures de Sécurité", description: "Sécurité en cuisine", image: "/ChausureDeTravail/ChaussureDeCuisine.jpg" },
  ],
  cafe: [
    { id: "1", name: "Tablier Barista", description: "Protection élégante", image: "/VetementDeCuisine/TablierDeChef.jpg" },
    { id: "2", name: "Uniforme de Service", description: "Tenue professionnelle", image: "/VetementServiceHotellerie/UniformeDeService.jpg" },
    { id: "3", name: "Chaussures Confort", description: "Pour le service", image: "/ChausureDeTravail/ChaussureDeCuisine.jpg" },
  ],
  hotel: [
    { id: "1", name: "Tenue d'Accueil", description: "Première impression impeccable", image: "/VetementServiceHotellerie/TenueDacceuilHotelBanner.jpg" },
    { id: "2", name: "Uniforme Chambre", description: "Pour le personnel d'entretien", image: "/VetementServiceHotellerie/UniformeDeService.jpg" },
    { id: "3", name: "Vêtements Restaurant", description: "Pour le restaurant d'hôtel", image: "/VetementDeCuisine/VesteDeChef.jpg" },
  ],
  medecin: [
    { id: "1", name: "Blouse Médicale", description: "Pour les médecins", image: "/VetementDeTravail/BlouseMedical.jpg" },
    { id: "2", name: "Tunique Médicale", description: "Pour les infirmiers", image: "/VetementDeTravail/TuniqueMedical.png" },
    { id: "3", name: "Pantalon Médical", description: "Confort toute la journée", image: "/VetementDeTravail/CombinaionDeTravail.jpg" },
  ]
};

const PackDetail = () => {
  const { packId } = useParams<{ packId: string }>();
  const [packInfo, setPackInfo] = useState<{title: string, description: string, image: string} | null>(null);
  const items = packId ? packItems[packId] : [];

  useEffect(() => {
    const packsMenuItem = menuItems.find(item => item.title === "Nos packs");
    const packSubItem = packsMenuItem?.subItems.find(subItem => {
      const pathSegments = subItem.path.split('/');
      return pathSegments[pathSegments.length - 1] === packId;
    });
    
    if (packSubItem) {
      setPackInfo({
        title: packSubItem.title,
        description: packSubItem.description,
        image: packSubItem.image
      });
    }
  }, [packId]);

  if (!packInfo) {
    return <div className="text-center py-12">Pack non trouvé</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section - Enhanced with gradient overlay and animation */}
      <div className="relative mb-12 rounded-xl overflow-hidden shadow-xl animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10"></div>
        <img 
          src={packInfo.image} 
          alt={packInfo.title} 
          className="w-full h-80 object-cover transition-transform hover:scale-105 duration-700"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-start text-white p-8 md:p-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {packInfo.title}
          </h1>
          <p className="text-xl max-w-2xl">{packInfo.description}</p>
          <Button size="lg" className="mt-6 bg-primary hover:bg-primary/90 text-white shadow-lg">
            Demander un devis
          </Button>
        </div>
      </div>

      {/* Pack Description - Enhanced with border and better spacing */}
      <div className="bg-white rounded-xl p-8 mb-12 border border-gray-100 shadow-sm">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
          <span className="w-2 h-8 bg-primary rounded-full inline-block"></span>
          Notre solution pour vous
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-gray-700 text-lg leading-relaxed">
              Notre <span className="font-semibold">{packInfo.title}</span> est conçu pour répondre à tous vos besoins professionnels. 
              Ce pack comprend une sélection d'articles essentiels pour votre activité, 
              garantissant qualité, confort et style professionnel.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Tous nos articles sont personnalisables avec votre logo et peuvent être adaptés 
              à vos besoins spécifiques. Contactez-nous pour plus d'informations ou pour 
              demander un devis personnalisé.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Avantages clés</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary text-lg mr-2">✓</span>
                  <span>Produits de qualité professionnelle</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary text-lg mr-2">✓</span>
                  <span>Personnalisation avec votre logo</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary text-lg mr-2">✓</span>
                  <span>Solution complète et économique</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary text-lg mr-2">✓</span>
                  <span>Conseils d'experts pour votre sélection</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Pack Items - Enhanced card design and hover effects */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          <span className="relative">
            Ce pack comprend
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/30 rounded-full"></span>
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white"
            >
              <div className="h-48 overflow-hidden">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-110 duration-500" 
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                <p className="text-gray-600 mt-1">{item.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Button variant="outline" size="sm" className="w-full">
                    Voir détails
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section - Enhanced with gradient background and better spacing */}
      <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl p-10 text-center shadow-sm">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Prêt à équiper votre établissement?</h2>
        <p className="text-gray-700 mb-8 max-w-2xl mx-auto text-lg">
          Contactez-nous dès aujourd'hui pour obtenir un devis personnalisé adapté à vos besoins spécifiques.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
            Demander un devis
          </Button>
          <Button variant="outline" size="lg" className="border-gray-300 hover:bg-gray-50">
            <Link to="/nos-packs">Voir tous les packs</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PackDetail;
