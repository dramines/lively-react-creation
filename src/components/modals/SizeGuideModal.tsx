import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ruler, User, Heart, Calculator } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: 'suits' | 'shirts' | 'pants' | 'women' | 'general';
}

const SizeGuideModal = ({ isOpen, onClose, category = 'general' }: SizeGuideModalProps) => {
  const { t } = useTranslation(['products']);
  const [activeTab, setActiveTab] = useState('men');

  const menSuitSizes = [
    { fr: '44', uk: '34', chest: '88', waist: '76' },
    { fr: '46', uk: '36', chest: '92', waist: '80' },
    { fr: '48', uk: '38', chest: '96', waist: '84' },
    { fr: '50', uk: '40', chest: '100', waist: '88' },
    { fr: '52', uk: '42', chest: '104', waist: '92' },
    { fr: '54', uk: '44', chest: '108', waist: '96' },
    { fr: '56', uk: '46', chest: '112', waist: '100' },
    { fr: '58', uk: '48', chest: '116', waist: '104' },
    { fr: '60', uk: '50', chest: '120', waist: '108' },
  ];

  const menShirtSizes = [
    { size: 'S', fr: '44', chest: '96', waist: '86' },
    { size: 'M', fr: '48', chest: '106', waist: '94' },
    { size: 'L', fr: '52', chest: '114', waist: '102' },
    { size: 'XL', fr: '56', chest: '122', waist: '110' },
    { size: 'XXL', fr: '60', chest: '130', waist: '118' },
  ];

  const womenSizes = [
    { size: 'XS', fr: '34', uk: '6', chest: '80', waist: '60', hips: '86' },
    { size: 'S', fr: '36', uk: '8', chest: '84', waist: '64', hips: '90' },
    { size: 'M', fr: '38', uk: '10', chest: '88', waist: '68', hips: '94' },
    { size: 'L', fr: '40', uk: '12', chest: '92', waist: '72', hips: '98' },
    { size: 'XL', fr: '42', uk: '14', chest: '96', waist: '76', hips: '102' },
    { size: 'XXL', fr: '44', uk: '16', chest: '100', waist: '80', hips: '106' },
  ];

  const measurementTips = [
    {
      icon: User,
      title: 'Tour de poitrine',
      description: 'Mesurez autour de la partie la plus large de votre poitrine, en gardant le mètre bien horizontal.'
    },
    {
      icon: Heart,
      title: 'Tour de taille',
      description: 'Mesurez autour de votre taille naturelle, généralement la partie la plus fine de votre torse.'
    },
    {
      icon: Calculator,
      title: 'Tour de hanches',
      description: 'Mesurez autour de la partie la plus large de vos hanches, environ 20 cm sous votre taille.'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Ruler className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-serif">Guide des Tailles</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Trouvez votre taille parfaite grâce à nos mesures détaillées
              </p>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="men" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Homme
            </TabsTrigger>
            <TabsTrigger value="women" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Femme
            </TabsTrigger>
          </TabsList>

          <TabsContent value="men" className="space-y-6">
            {/* Men's Suits */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Costumes & Vestes</h3>
                <Badge variant="secondary">Recommandé</Badge>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border border-border rounded-lg">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left font-semibold">Taille FR</th>
                      <th className="px-4 py-3 text-left font-semibold">Correspondance UK/US</th>
                      <th className="px-4 py-3 text-left font-semibold">Tour de poitrine (cm)</th>
                      <th className="px-4 py-3 text-left font-semibold">Tour de taille (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menSuitSizes.map((size, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                        <td className="px-4 py-3 font-medium">{size.fr}</td>
                        <td className="px-4 py-3">{size.uk}</td>
                        <td className="px-4 py-3">{size.chest} cm</td>
                        <td className="px-4 py-3">{size.waist} cm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Men's Shirts */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Chemises & T-shirts</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border border-border rounded-lg">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left font-semibold">Taille</th>
                      <th className="px-4 py-3 text-left font-semibold">Taille FR</th>
                      <th className="px-4 py-3 text-left font-semibold">Tour de poitrine (cm)</th>
                      <th className="px-4 py-3 text-left font-semibold">Tour de taille (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menShirtSizes.map((size, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                        <td className="px-4 py-3 font-medium">{size.size}</td>
                        <td className="px-4 py-3">{size.fr}</td>
                        <td className="px-4 py-3">{size.chest} cm</td>
                        <td className="px-4 py-3">{size.waist} cm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="women" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vêtements Femme</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border border-border rounded-lg">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left font-semibold">Taille</th>
                      <th className="px-4 py-3 text-left font-semibold">Taille FR</th>
                      <th className="px-4 py-3 text-left font-semibold">UK</th>
                      <th className="px-4 py-3 text-left font-semibold">Poitrine (cm)</th>
                      <th className="px-4 py-3 text-left font-semibold">Taille (cm)</th>
                      <th className="px-4 py-3 text-left font-semibold">Hanches (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {womenSizes.map((size, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                        <td className="px-4 py-3 font-medium">{size.size}</td>
                        <td className="px-4 py-3">{size.fr}</td>
                        <td className="px-4 py-3">{size.uk}</td>
                        <td className="px-4 py-3">{size.chest} cm</td>
                        <td className="px-4 py-3">{size.waist} cm</td>
                        <td className="px-4 py-3">{size.hips} cm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Measurement Tips */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Comment bien prendre ses mesures</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {measurementTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <tip.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">{tip.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Notes importantes :</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Les mesures indiquées dans le tableau sont prises sur le corps et non sur le vêtement</li>
            <li>• Suivez les indications ci-dessus pour prendre vos mesures correctement</li>
            <li>• En cas de doute entre deux tailles, nous recommandons de choisir la taille supérieure</li>
            <li>• Nos costumes sont ajustables, un retoucheur peut parfaire l'ajustement</li>
          </ul>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} className="px-8">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuideModal;