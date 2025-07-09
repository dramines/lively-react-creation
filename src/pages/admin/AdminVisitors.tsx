
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Eye, Clock, Globe, Smartphone, Monitor, Tablet, MapPin, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface VisitorStats {
  visitorsToday: number;
  pageviewsToday: number;
  avgTimeOnSite: string;
  bounceRate: number;
  totalVisitors: number;
  dailyVisitors: Array<{
    date: string;
    visitors: number;
    pageviews: number;
  }>;
  topPages: Array<{
    page: string;
    visitors: number;
    percentage: number;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    color: string;
  }>;
  countries: Array<{
    country: string;
    visitors: number;
    flag: string;
  }>;
  deviceData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  rawVisitors: Array<{
    ip_address: string;
    page_visited: string;
    referrer: string;
    country: string;
    city: string;
    visit_date: string;
    device_type: string;
    browser: string;
  }>;
}

const AdminVisitors = () => {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchVisitorStats();
  }, []);

  const fetchVisitorStats = async () => {
    try {
      const response = await fetch('https://draminesaid.com/lucci/api/get_visitor_stats.php');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch visitor stats');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      
      // Fallback to mock data
      const mockStats: VisitorStats = {
        visitorsToday: 45,
        pageviewsToday: 123,
        avgTimeOnSite: '3m 24s',
        bounceRate: 68,
        totalVisitors: 2340,
        dailyVisitors: [
          { date: '2024-01-09', visitors: 32, pageviews: 85 },
          { date: '2024-01-10', visitors: 28, pageviews: 72 },
          { date: '2024-01-11', visitors: 41, pageviews: 98 },
          { date: '2024-01-12', visitors: 35, pageviews: 89 },
          { date: '2024-01-13', visitors: 47, pageviews: 112 },
          { date: '2024-01-14', visitors: 39, pageviews: 95 },
          { date: '2024-01-15', visitors: 45, pageviews: 123 }
        ],
        topPages: [
          { page: '/', visitors: 180, percentage: 40 },
          { page: '/products', visitors: 120, percentage: 27 },
          { page: '/about', visitors: 85, percentage: 19 },
          { page: '/contact', visitors: 65, percentage: 14 }
        ],
        trafficSources: [
          { source: 'Direct', visitors: 180, color: '#8884d8' },
          { source: 'Google', visitors: 120, color: '#82ca9d' },
          { source: 'Facebook', visitors: 85, color: '#ffc658' },
          { source: 'Instagram', visitors: 65, color: '#ff7300' }
        ],
        countries: [
          { country: 'Tunisia', visitors: 180, flag: '🇹🇳' },
          { country: 'France', visitors: 85, flag: '🇫🇷' },
          { country: 'Germany', visitors: 45, flag: '🇩🇪' },
          { country: 'Italy', visitors: 30, flag: '🇮🇹' }
        ],
        deviceData: [
          { name: 'Mobile', value: 55, color: '#8884d8' },
          { name: 'Desktop', value: 35, color: '#82ca9d' },
          { name: 'Tablet', value: 10, color: '#ffc658' }
        ],
        rawVisitors: [
          {
            ip_address: '192.168.1.1',
            page_visited: '/',
            referrer: 'https://google.com',
            country: 'Tunisia',
            city: 'Tunis',
            visit_date: '2024-01-15 14:30:00',
            device_type: 'Mobile',
            browser: 'Chrome'
          },
          {
            ip_address: '192.168.1.2',
            page_visited: '/products',
            referrer: 'Direct',
            country: 'France',
            city: 'Paris',
            visit_date: '2024-01-15 14:25:00',
            device_type: 'Desktop',
            browser: 'Firefox'
          }
        ]
      };
      
      setStats(mockStats);
      
      toast({
        title: "Attention",
        description: "Impossible de charger les données. Utilisation des données de démonstration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Visiteurs
          </h1>
          <p className="text-muted-foreground">Erreur lors du chargement des données</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Visiteurs
        </h1>
        <p className="text-muted-foreground text-lg">
          Analysez le trafic et le comportement de vos visiteurs
        </p>
      </div>

      {/* Métriques principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Visiteurs aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.visitorsToday}</div>
            <div className="flex items-center mt-2">
              <Users className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-sm text-blue-600">Visiteurs uniques</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pages vues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.pageviewsToday}</div>
            <div className="flex items-center mt-2">
              <Eye className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">Vues aujourd'hui</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Temps moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.avgTimeOnSite}</div>
            <div className="flex items-center mt-2">
              <Clock className="h-4 w-4 text-purple-600 mr-1" />
              <span className="text-sm text-purple-600">Durée moyenne</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taux de rebond</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.bounceRate}%</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-orange-600 mr-1" />
              <span className="text-sm text-orange-600">Taux de sortie</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Visiteurs quotidiens (7 derniers jours)</CardTitle>
            <CardDescription>Évolution du trafic sur votre site</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.dailyVisitors}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visitors" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="pageviews" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Répartition par appareil</CardTitle>
            <CardDescription>Types d'appareils utilisés</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pages populaires et pays */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Pages les plus visitées</CardTitle>
            <CardDescription>7 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{page.page}</p>
                      <p className="text-sm text-muted-foreground">{page.visitors} visiteurs</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{page.percentage}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Pays des visiteurs</CardTitle>
            <CardDescription>7 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.countries.map((country, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <p className="font-medium">{country.country}</p>
                      <p className="text-sm text-muted-foreground">{country.visitors} visiteurs</p>
                    </div>
                  </div>
                  <Badge variant="outline">{country.visitors}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visiteurs récents */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Visiteurs récents</CardTitle>
          <CardDescription>Les dernières visites sur votre site</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {stats.rawVisitors.slice(0, 20).map((visitor, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {visitor.device_type === 'Mobile' ? <Smartphone className="h-5 w-5" /> : 
                     visitor.device_type === 'Tablet' ? <Tablet className="h-5 w-5" /> : 
                     <Monitor className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium">{visitor.page_visited}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{visitor.city && visitor.country ? `${visitor.city}, ${visitor.country}` : visitor.country || 'Localisation inconnue'}</span>
                      <span>•</span>
                      <span>{visitor.device_type}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {new Date(visitor.visit_date).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(visitor.visit_date).toLocaleTimeString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVisitors;
