
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, CreditCard, Calendar, CheckCircle } from 'lucide-react';

interface SubscriptionCardProps {
  subscription: {
    isActive: boolean;
    plan: string;
    endDate?: string;
    price?: string;
  };
  onManageSubscription: () => void;
  onUpgrade: () => void;
}

const SubscriptionCard = ({ subscription, onManageSubscription, onUpgrade }: SubscriptionCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="w-5 h-5 text-purple-500" />
          <span>Mon abonnement</span>
        </CardTitle>
        <CardDescription>Gérez votre abonnement et vos préférences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription.isActive ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">Plan {subscription.plan}</p>
                <p className="text-sm text-slate-600">
                  {subscription.price && `${subscription.price}/mois`}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Actif
              </Badge>
            </div>
            
            {subscription.endDate && (
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                <span>Renouvellement le {subscription.endDate}</span>
              </div>
            )}
            
            <Button 
              onClick={onManageSubscription}
              variant="outline" 
              className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Gérer l'abonnement
            </Button>
          </>
        ) : (
          <>
            <div className="text-center py-4">
              <p className="text-slate-600 mb-4">Vous n'avez pas d'abonnement actif</p>
              <Button 
                onClick={onUpgrade}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
              >
                <Crown className="w-4 h-4 mr-2" />
                S'abonner maintenant
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
