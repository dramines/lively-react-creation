
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "@/components/ui/image";
import { Link } from "react-router-dom";

interface PackCardProps {
  title: string;
  description: string;
  imageSrc: string;
  path: string;
}

const PackCard = ({ title, description, imageSrc, path }: PackCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-shadow hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600">
          Notre {title} offre une solution intégrée pour répondre à tous vos besoins professionnels.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild variant="outline">
          <Link to={path}>Voir les détails</Link>
        </Button>
        <Button>Demander devis</Button>
      </CardFooter>
    </Card>
  );
};

export default PackCard;
