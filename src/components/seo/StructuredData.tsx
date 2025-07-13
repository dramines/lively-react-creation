import { useEffect } from 'react';

interface StructuredDataProps {
  type?: 'website' | 'product' | 'organization';
  data?: any;
}

const StructuredData = ({ type = 'website', data }: StructuredDataProps) => {
  useEffect(() => {
    let structuredData;

    switch (type) {
      case 'website':
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Website",
          "name": "LUCCI BY E.Y",
          "description": "Mode de luxe sur mesure et collections exclusives",
          "url": "https://lucci.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://lucci.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        };
        break;
      
      case 'organization':
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "LUCCI BY E.Y",
          "description": "Maison de mode de luxe spécialisée dans le sur mesure",
          "url": "https://lucci.com",
          "logo": "https://lucci.com/lovable-uploads/04272c72-7979-4c68-9c37-efc9954ca58f.png",
          "sameAs": [
            "https://instagram.com/lucci",
            "https://facebook.com/lucci"
          ]
        };
        break;
      
      case 'product':
        if (data) {
          structuredData = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": data.nom_product,
            "description": data.description_product || data.nom_product,
            "image": data.img_product,
            "offers": {
              "@type": "Offer",
              "price": data.price_product,
              "priceCurrency": "EUR",
              "availability": "https://schema.org/InStock"
            },
            "brand": {
              "@type": "Brand",
              "name": "LUCCI BY E.Y"
            }
          };
        }
        break;
    }

    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [type, data]);

  return null;
};

export default StructuredData;