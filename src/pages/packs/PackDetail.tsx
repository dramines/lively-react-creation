
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { menuItems } from "@/config/menuConfig";
import { useEffect, useState } from "react";

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
      {/* Hero Section */}
      <div className="relative mb-12 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img 
          src={packInfo.image} 
          alt={packInfo.title} 
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{packInfo.title}</h1>
          <p className="text-xl max-w-2xl text-center">{packInfo.description}</p>
        </div>
      </div>

      {/* Pack Description */}
      <div className="bg-gray-50 rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-bold mb-4">Notre solution pour vous</h2>
        <p className="text-gray-600 mb-6">
          {packInfo.title} est conçu pour répondre à tous vos besoins professionnels. 
          Ce pack comprend une sélection d'articles essentiels pour votre activité, 
          garantissant qualité, confort et style professionnel.
        </p>
        <p className="text-gray-600 mb-6">
          Tous nos articles sont personnalisables avec votre logo et peuvent être adaptés 
          à vos besoins spécifiques. Contactez-nous pour plus d'informations ou pour 
          demander un devis personnalisé.
        </p>
        <Button className="bg-primary text-white px-6 py-3">
          Demander un devis
        </Button>
      </div>

      {/* Pack Items */}
      <h2 className="text-2xl font-bold mb-6">Ce pack comprend</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-secondary/20 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Prêt à équiper votre établissement?</h2>
        <p className="text-gray-600 mb-6">
          Contactez-nous dès aujourd'hui pour obtenir un devis personnalisé.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary text-white px-6 py-3">
            Demander un devis
          </Button>
          <Button className="bg-white border border-gray-200 px-6 py-3 hover:bg-gray-50">
            <Link to="/nos-packs">Voir tous les packs</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PackDetail;
