
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [acceptMarketing, setAcceptMarketing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptMarketing) {
      toast.error("Veuillez accepter de recevoir nos offres marketing");
      return;
    }
    toast.success("Merci pour votre inscription!");
    setEmail("");
    setAcceptMarketing(false);
  };

  return (
    <section className="relative bg-white">
      {/* Decorative background */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          background: "url('/lovable-uploads/86ea111c-e46e-44dd-acc8-3c13642c3c5c.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1
        }}
      />

      <div className="container relative mx-auto px-4 py-8 flex justify-between gap-6">
        {/* Newsletter Form Section */}
        <div className="max-w-2xl">
          <span className="text-sm text-gray-500 uppercase mb-1.5 block">
            Newsletter
          </span>
          
          <h2 className="text-2xl font-bold mb-1.5 flex items-center gap-2">
            Bénéficiez de <span className="text-[#ea384c]">10TND</span> de réduction
          </h2>
          
          <p className="text-gray-600 mb-1">
            Valable sur la première commande
          </p>
          <p className="text-gray-500 mb-4">
            Vous serez informé de nos nouveautés et de nos offres
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-semibold">
                EMAIL :
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Saisissez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="marketing"
                checked={acceptMarketing}
                onCheckedChange={(checked) => setAcceptMarketing(checked as boolean)}
                className="mt-1"
              />
              <label
                htmlFor="marketing"
                className="text-sm text-gray-600 leading-tight"
              >
                J'accepte de recevoir des emails sur nos offres marketing
              </label>
            </div>

            <Button
              type="submit"
              className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white px-6 py-1.5"
            >
              Inscription
            </Button>
          </form>
        </div>

        {/* Social Media Section */}
        <div className="bg-[#1A1F2C] p-6 rounded-lg flex-shrink-0 w-64 min-h-[255px] flex flex-col justify-center items-center">
          <h3 className="text-white text-sm font-medium mb-6">
            Suivez nous sur les réseaux
          </h3>
          <div className="flex gap-5">
            <a href="#" className="text-white hover:text-gray-200 transition-colors">
              <Facebook className="w-7 h-7" />
            </a>
            <a href="#" className="text-white hover:text-gray-200 transition-colors">
              <Twitter className="w-7 h-7" />
            </a>
            <a href="#" className="text-white hover:text-gray-200 transition-colors">
              <Linkedin className="w-7 h-7" />
            </a>
            <a href="#" className="text-white hover:text-gray-200 transition-colors">
              <Instagram className="w-7 h-7" />
            </a>
            <a href="#" className="text-white hover:text-gray-200 transition-colors">
              <Youtube className="w-7 h-7" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
