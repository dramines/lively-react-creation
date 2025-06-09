import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  ShoppingBag, 
  Baby, 
  Crown, 
  Plus,
  Book,
  Heart,
  Star,
  Settings,
  Edit
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccountSettingsModal from '@/components/AccountSettingsModal';
import ChildEditModal from '@/components/ChildEditModal';
import SubscriptionCard from '@/components/SubscriptionCard';
import SubscriptionManagementModal from '@/components/SubscriptionManagementModal';

interface Child {
  id: number;
  name: string;
  age: number;
  booksCount: number;
}

const Account = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '06 12 34 56 78'
  });

  const [subscription] = useState({
    isActive: true,
    plan: 'Premium',
    endDate: '15 janvier 2025',
    price: '9.99€'
  });

  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showChildEdit, setShowChildEdit] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [showSubscriptionManagement, setShowSubscriptionManagement] = useState(false);

  const recentBooks = [
    {
      id: 1,
      title: 'L\'Aventure Magique d\'Emma',
      child: 'Emma, 6 ans',
      status: 'Livré',
      image: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'Lucas et le Dragon Gentil',
      child: 'Lucas, 4 ans',
      status: 'En cours',
      image: '/placeholder.svg'
    }
  ];

  const [children, setChildren] = useState<Child[]>([
    { id: 1, name: 'Emma', age: 6, booksCount: 3 },
    { id: 2, name: 'Lucas', age: 4, booksCount: 2 }
  ]);

  const handleCreateNewBook = () => {
    navigate('/children');
  };

  const handleAccountSettings = () => {
    setShowAccountSettings(true);
  };

  const handleSaveUserInfo = (newUserInfo: typeof userInfo) => {
    setUserInfo(newUserInfo);
    console.log('User info updated:', newUserInfo);
  };

  const handleEditChild = (child: Child) => {
    setSelectedChild(child);
    setShowChildEdit(true);
  };

  const handleSaveChild = (updatedChild: Child) => {
    setChildren(children.map(child => 
      child.id === updatedChild.id ? updatedChild : child
    ));
    console.log('Child updated:', updatedChild);
  };

  const handleDeleteChild = (childId: number) => {
    setChildren(children.filter(child => child.id !== childId));
    console.log('Child deleted:', childId);
  };

  const handleManageSubscription = () => {
    setShowSubscriptionManagement(true);
  };

  const handleUpgrade = () => {
    console.log('Upgrade subscription clicked');
    // Here you would typically start checkout process
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 pt-24 md:pt-28">
        {/* Welcome Header - Mobile Optimized */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-800 mb-2">
            Bonjour, {userInfo.name.split(' ')[0]} ! 👋
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-4 px-2">
            Prêt(e) à créer de nouvelles aventures pour vos enfants ?
          </p>
          {subscription.isActive && (
            <div className="flex justify-start sm:justify-center">
              <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base">
                <Crown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Abonnement {subscription.plan} actif
              </Badge>
            </div>
          )}
        </div>

        {/* Quick Actions - Mobile Optimized */}
        <div className="grid gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-br from-orange-100 to-pink-100 border-2 border-orange-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                  <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Créer un nouveau livre</h3>
                <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4 px-2">Commencez une nouvelle aventure personnalisée pour votre enfant</p>
                <Button 
                  onClick={handleCreateNewBook}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                >
                  Commencer maintenant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Cards - Mobile Optimized */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Recent Books - Full width on mobile, 2/3 on desktop */}
          <Card className="lg:col-span-2 bg-white shadow-sm border-slate-200">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Book className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                <span>Mes livres récents</span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">Vos dernières créations</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 sm:space-y-4">
                {recentBooks.map((book) => (
                  <div key={book.id} className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center shrink-0">
                        <Book className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-slate-800 text-sm sm:text-base truncate">{book.title}</h4>
                        <p className="text-xs sm:text-sm text-slate-600">Pour {book.child}</p>
                      </div>
                    </div>
                    <Badge variant={book.status === 'Livré' ? 'default' : 'secondary'} className="text-xs shrink-0 ml-2">
                      {book.status}
                    </Badge>
                  </div>
                ))}
                {recentBooks.length === 0 && (
                  <div className="text-center py-6 sm:py-8">
                    <Book className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3 sm:mb-4" />
                    <p className="text-slate-500 text-sm sm:text-base mb-3 sm:mb-4">Aucun livre créé pour le moment</p>
                    <Button 
                      onClick={handleCreateNewBook}
                      className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-sm sm:text-base"
                    >
                      Créer votre premier livre
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sidebar - Mobile Optimized */}
          <div className="space-y-4 sm:space-y-6">
            {/* My Children - Mobile Optimized */}
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Baby className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                  <span>Mes enfants</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 sm:space-y-3">
                  {children.map((child) => (
                    <div key={child.id} className="flex items-center justify-between p-2 sm:p-3 bg-pink-50 rounded-lg border border-pink-200">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">{child.name}</p>
                        <p className="text-xs sm:text-sm text-slate-600">{child.age} ans</p>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
                        <Badge variant="secondary" className="bg-pink-100 text-pink-800 text-xs">
                          {child.booksCount}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditChild(child)}
                          className="p-1 h-6 w-6 sm:h-8 sm:w-8 hover:bg-pink-100"
                        >
                          <Edit className="w-3 h-3 text-pink-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full border-pink-200 text-pink-600 hover:bg-pink-50 text-sm sm:text-base py-2 sm:py-3"
                    onClick={() => navigate('/children')}
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Ajouter un enfant
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Management - Mobile Optimized */}
            <SubscriptionCard 
              subscription={subscription}
              onManageSubscription={handleManageSubscription}
              onUpgrade={handleUpgrade}
            />

            {/* Quick Stats - Mobile Optimized */}
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-3 sm:p-4">
                <div className="text-center">
                  <Star className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
                  <p className="text-green-100 text-xs sm:text-sm">Total des livres créés</p>
                  <p className="text-xl sm:text-2xl font-bold">5</p>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings - Mobile Optimized */}
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  <span>Mon compte</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium text-slate-700">Email</p>
                    <p className="text-slate-600 truncate">{userInfo.email}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 text-sm sm:text-base py-2 sm:py-3"
                    onClick={handleAccountSettings}
                  >
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Paramètres du compte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modals */}
      <AccountSettingsModal
        isOpen={showAccountSettings}
        onClose={() => setShowAccountSettings(false)}
        userInfo={userInfo}
        onSave={handleSaveUserInfo}
      />

      <ChildEditModal
        isOpen={showChildEdit}
        onClose={() => setShowChildEdit(false)}
        child={selectedChild}
        onSave={handleSaveChild}
        onDelete={handleDeleteChild}
      />

      <SubscriptionManagementModal
        isOpen={showSubscriptionManagement}
        onClose={() => setShowSubscriptionManagement(false)}
        subscription={subscription}
      />
    </div>
  );
};

export default Account;
