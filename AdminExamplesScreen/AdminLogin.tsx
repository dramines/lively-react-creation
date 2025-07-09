
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement actual authentication logic
    console.log('Login attempt:', { email, password });
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, accept any credentials
      if (email && password) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre back-office !",
        });
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Veuillez remplir tous les champs.",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header with Logo */}
      <header className="w-full py-8">
        <div className="container mx-auto px-4 flex justify-center">
          <img 
            src="/lovable-uploads/04272c72-7979-4c68-9c37-efc9954ca58f.png" 
            alt="LUCCI BY E.Y" 
            className="h-16 md:h-20 object-contain"
          />
        </div>
      </header>

      {/* Login Form */}
      <div className="container mx-auto px-4 flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-playfair text-gray-900">
              Administration
            </CardTitle>
            <CardDescription className="text-gray-600">
              Connectez-vous pour accéder au back-office
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-blue-900 focus:ring-blue-900"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-900 focus:ring-blue-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-medium transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connexion...</span>
                  </div>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Accès réservé aux administrateurs autorisés
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-gray-500 text-sm">
        <p>&copy; 2024 LUCCI BY E.Y. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default AdminLogin;
