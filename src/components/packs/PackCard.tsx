
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "@/components/ui/image";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tag, ShoppingCart } from "lucide-react";

interface PackCardProps {
  title: string;
  description: string;
  imageSrc: string;
  path: string;
  itemCount?: number;
  price?: string;
  discount?: string;
}

const PackCard = ({ 
  title, 
  description, 
  imageSrc, 
  path, 
  itemCount = 3, 
  price = "0.00", 
  discount 
}: PackCardProps) => {
  // Ensure the path is correctly formatted
  const ensurePath = (p: string) => {
    if (!p.startsWith('/')) return `/${p}`;
    return p;
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">
      <div className="relative h-52 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-60 group-hover:opacity-70 transition-opacity"></div>
        <Image
          src={imageSrc}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-0 right-0 z-20 p-2">
          {discount && (
            <Badge className="bg-green-500 hover:bg-green-600">
              <Tag className="h-3 w-3 mr-1" /> {discount} off
            </Badge>
          )}
        </div>
        <div className="absolute bottom-0 left-0 z-20 p-4 w-full">
          <h3 className="text-white font-bold text-lg drop-shadow-md">{title}</h3>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardDescription className="text-sm line-clamp-2">{description}</CardDescription>
          {price !== "0.00" && (
            <div className="text-primary font-semibold">
              {price} TND
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-0">
        <p className="text-gray-600 text-sm line-clamp-3 mb-2">
          Notre {title} offre une solution intégrée pour répondre à tous vos besoins professionnels.
        </p>
        <Badge variant="outline" className="bg-gray-50">
          {itemCount} articles inclus
        </Badge>
      </CardContent>
      <CardFooter className="flex justify-between pt-4 border-t border-gray-100 mt-auto">
        <Button asChild variant="outline" size="sm" className="text-xs">
          <Link to={ensurePath(path)}>Voir les détails</Link>
        </Button>
        <Button size="sm" className="text-xs">
          <ShoppingCart className="h-3 w-3 mr-1" /> Commander
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PackCard;
