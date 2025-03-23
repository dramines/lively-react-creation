import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from './locales/en.json';
import frTranslation from './locales/fr.json';

// Add or update translations for product descriptions and ingredients
// This would normally be done directly in the JSON files, but we can enhance them here

// Add missing product descriptions translations to both languages
const enhancedEnTranslation = {
  ...enTranslation,
  navbar: {
    ...enTranslation.navbar,
    partners: "Our Partners"
  },
  partners: {
    title: "Our Trusted Partners",
    subtitle: "Companies that have placed their trust in us for the quality of our products and services",
    visit_website: "Visit Website",
    no_partners: "No partners found",
    trusted_by: "Trusted by leading companies",
    partner_descriptions: {
      carrefour: "International hypermarket present throughout Tunisia",
      geant: "Large retail store offering a wide range of food products",
      monoprix: "Premium supermarket with quality products",
      badira: "Chain of stores offering traditional Tunisian food products",
      sigale: "Distributor specialized in fine grocery products and local products"
    }
  },
  product_descriptions: {
    date_powder_sugar_300g: "Our date powder is a natural sweetener obtained by simply dehydrating and grinding premium Deglet Nour dates. This substitute for refined sugar retains all the nutrients and minerals of dates, with a lower glycemic index than white sugar. Its subtly caramelized taste brings a unique flavor dimension to your sweet preparations, hot drinks, yogurts, or pastries.",
    date_syrup_340ml: "Our date syrup is a 100% natural concentrate obtained by slowly simmering premium dates. With its thick consistency and rich caramel notes, this traditional syrup is an excellent alternative to refined sugar, honey, or maple syrup. Rich in minerals and antioxidants, it's perfect for sweetening drinks, desserts, breakfast cereals, or as a topping for pancakes and waffles.",
    date_kernel_coffee_200g: "Our unique date kernel coffee is made from carefully roasted and ground Deglet Nour date pits. This caffeine-free alternative offers nutty, toasted notes with subtle hints of caramel. Traditional in North Africa, this beverage provides antioxidants and minerals while being gentle on the digestive system. Perfect for those looking to reduce their caffeine intake while enjoying a rich, comforting hot drink.",
    dried_figs_200g: "Our 200g dried figs are a Mediterranean flavor treasure, delicately sun-dried using traditional Tunisian methods. Naturally sweet and plump, these figs retain all their nutrients and authentic taste. Rich in fiber and minerals, they make a healthy snack or a perfect ingredient for your salads, desserts, and slow-cooked dishes.",
    bulk_dried_figs: "Our bulk dried figs offer the authentic taste of Mediterranean tradition in a larger format, perfect for frequent consumption or cooking. These plump, sweet figs are carefully selected and sun-dried to preserve their exceptional nutritional qualities and distinctive flavor. Use them to enhance your breakfast cereals, create sophisticated appetizers, or enrich your baking creations.",
    toujane_figs_200g: "Our Toujane figs, originating from the mountainous region of southern Tunisia, are renowned for their unique sweetness and distinctive texture. These carefully selected and traditionally dried figs offer an authentic taste experience with their honey notes and delicate seeds. Perfect for gourmet snacking or elevating your culinary creations.",
    djebaa_figs_200g: "Our Djebaa figs, sourced from the fertile northern regions of Tunisia, are prized for their generous size and exceptional sweetness. These premium figs are sun-dried according to ancestral methods to preserve their unique aromatic profile with subtle flowery notes. Enjoy them as a nutritious snack or incorporate them into both sweet and savory recipes."
  },
  product_ingredients: {
    date_powder_natural: "100% natural date powder",
    date_powder_no_additives: "No additives or preservatives",
    date_powder_dried: "Made from dehydrated Deglet Nour dates",
    date_powder_ground: "Finely ground for optimal use",
    
    date_syrup_pure: "Pure date extract",
    date_syrup_no_additives: "No additives, colorings, or preservatives",
    date_syrup_concentrated: "Naturally concentrated through slow simmering",
    date_syrup_natural: "100% natural sweetener",
    
    date_coffee_kernels: "100% date pit kernels",
    date_coffee_roasted: "Carefully roasted for optimal flavor",
    date_coffee_ground: "Finely ground for brewing",
    date_coffee_natural: "Natural caffeine-free alternative",
    
    dried_figs_zidi_type: "Premium Zidi variety figs",
    dried_figs_toujane_type: "Selected figs from the Toujane region",
    dried_figs_djebaa_type: "Premium Djebaa variety from Northern Tunisia",
    dried_figs_bulk_quality: "Selected for consistent quality and size"
  }
};

const enhancedFrTranslation = {
  ...frTranslation,
  navbar: {
    ...frTranslation.navbar,
    partners: "Nos Partenaires"
  },
  partners: {
    title: "Nos Partenaires de Confiance",
    subtitle: "Les entreprises qui nous ont fait confiance pour la qualité de nos produits et services",
    visit_website: "Visiter le site",
    no_partners: "Aucun partenaire trouvé",
    trusted_by: "Fait confiance par des entreprises leaders",
    partner_descriptions: {
      carrefour: "Hypermarché international présent dans toute la Tunisie",
      geant: "Grande surface offrant une large gamme de produits alimentaires",
      monoprix: "Supermarché premium avec des produits de qualité",
      badira: "Chaîne de magasins proposant des produits alimentaires traditionnels tunisiens",
      sigale: "Distributeur spécialisé en produits d'épicerie fine et produits locaux"
    }
  },
  product_descriptions: {
    date_powder_sugar_300g: "Notre poudre de dattes est un édulcorant naturel obtenu par simple déshydratation et broyage de dattes Deglet Nour premium. Ce substitut au sucre raffiné conserve tous les nutriments et minéraux des dattes, avec un index glycémique plus bas que le sucre blanc. Son goût subtilement caramélisé apporte une dimension gustative unique à vos préparations sucrées, boissons chaudes, yaourts ou pâtisseries.",
    date_syrup_340ml: "Notre sirop de dattes est un concentré 100% naturel obtenu par mijotage lent de dattes de premier choix. Avec sa consistance épaisse et ses notes riches de caramel, ce sirop traditionnel est une excellente alternative au sucre raffiné, au miel ou au sirop d'érable. Riche en minéraux et antioxydants, il est parfait pour sucrer boissons, desserts, céréales de petit-déjeuner, ou comme nappage pour crêpes et gaufres.",
    date_kernel_coffee_200g: "Notre café unique de noyaux de dattes est fabriqué à partir de noyaux de dattes Deglet Nour soigneusement torréfiés et moulus. Cette alternative sans caféine offre des notes de noisette, grillées avec de subtiles touches de caramel. Traditionnel en Afrique du Nord, cette boisson apporte antioxydants et minéraux tout en étant douce pour le système digestif. Parfait pour ceux qui cherchent à réduire leur consommation de caféine tout en profitant d'une boisson chaude riche et réconfortante.",
    dried_figs_200g: "Nos figues séchées de 200g sont un trésor de saveurs méditerranéennes, délicatement séchées au soleil selon des méthodes traditionnelles tunisiennes. Naturellement sucrées et charnues, ces figues conservent tous leurs nutriments et leur goût authentique. Riches en fibres et minéraux, elles constituent un en-cas sain ou un ingrédient parfait pour vos salades, desserts et plats mijotés.",
    bulk_dried_figs: "Nos figues séchées en vrac offrent le goût authentique de la tradition méditerranéenne dans un format plus large, parfait pour une consommation fréquente ou la cuisine. Ces figues charnues et sucrées sont soigneusement sélectionnées et séchées au soleil pour préserver leurs qualités nutritionnelles exceptionnelles et leur saveur distinctive. Utilisez-les pour enrichir vos céréales de petit-déjeuner, créer des apéritifs sophistiqués ou enrichir vos créations de pâtisserie.",
    toujane_figs_200g: "Nos figues Toujane, originaires de la région montagneuse du sud tunisien, sont réputées pour leur douceur unique et leur texture distinctive. Ces figues soigneusement sélectionnées et séchées traditionnellement offrent une expérience gustative authentique avec leurs notes de miel et leurs délicates graines. Parfaites pour une collation gourmande ou pour élever vos créations culinaires.",
    djebaa_figs_200g: "Nos figues Djebaa, issues des régions fertiles du nord de la Tunisie, sont prisées pour leur taille généreuse et leur douceur exceptionnelle. Ces figues premium sont séchées au soleil selon des méthodes ancestrales pour préserver leur profil aromatique unique aux notes florales subtiles. Dégustez-les comme collation nutritive ou incorporez-les dans des recettes aussi bien sucrées que salées."
  },
  product_ingredients: {
    date_powder_natural: "Poudre de dattes 100% naturelle",
    date_powder_no_additives: "Sans additifs ni conservateurs",
    date_powder_dried: "Fabriquée à partir de dattes Deglet Nour déshydratées",
    date_powder_ground: "Finement moulue pour une utilisation optimale",
    
    date_syrup_pure: "Extrait pur de dattes",
    date_syrup_no_additives: "Sans additifs, colorants ni conservateurs",
    date_syrup_concentrated: "Naturellement concentré par mijotage lent",
    date_syrup_natural: "Édulcorant 100% naturel",
    
    date_coffee_kernels: "100% noyaux de dattes",
    date_coffee_roasted: "Soigneusement torréfiés pour une saveur optimale",
    date_coffee_ground: "Finement moulus pour l'infusion",
    date_coffee_natural: "Alternative naturelle sans caféine",
    
    dried_figs_zidi_type: "Figues premium de variété Zidi",
    dried_figs_toujane_type: "Figues sélectionnées de la région de Toujane",
    dried_figs_djebaa_type: "Figues premium de variété Djebaa du Nord tunisien",
    dried_figs_bulk_quality: "Sélectionnées pour une qualité et taille constantes"
  }
};

const resources = {
  en: {
    translation: enhancedEnTranslation
  },
  fr: {
    translation: enhancedFrTranslation
  }
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'fr',
    lng: 'fr', // Set French as the default language
    debug: false,
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    detection: {
      order: ['cookie', 'localStorage', 'navigator'],
      caches: ['cookie', 'localStorage'],
    }
  });

export default i18n;
