import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DollarSign, ShoppingCart, TrendingUp, Users, Eye, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

const DashboardOverview = () => {
  const [liveData, setLiveData] = useState({
    activeUsers: 127,
    ordersToday: 15,
    revenueToday: 1250
  });

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        activeUsers: Math.floor(Math.random() * 50) + 100,
        ordersToday: Math.floor(Math.random() * 10) + 10,
        revenueToday: Math.floor(Math.random() * 500) + 1000
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Mock data for demonstration
  const revenueData = [
    { month: 'Jan', revenue: 4500, orders: 45 },
    { month: 'Fév', revenue: 5200, orders: 52 },
    { month: 'Mar', revenue: 4800, orders: 48 },
    { month: 'Avr', revenue: 6100, orders: 61 },
    { month: 'Mai', revenue: 7200, orders: 72 },
    { month: 'Jun', revenue: 8500, orders: 85 },
  ];

  const deviceData = [
    { name: 'Ordinateur', value: 45, color: '#FF6B6B' },
    { name: 'Mobile', value: 35, color: '#4ECDC4' },
    { name: 'Tablette', value: 20, color: '#45B7D1' },
  ];

  const orderStatusData = [
    { status: 'En attente', count: 12, color: '#FFA726' },
    { status: 'Traitement', count: 8, color: '#42A5F5' },
    { status: 'Expédié', count: 25, color: '#66BB6A' },
    { status: 'Livré', count: 45, color: '#26C6DA' },
  ];

  const weeklyTrends = [
    { day: 'Lun', visitors: 1200, sales: 850 },
    { day: 'Mar', visitors: 1890, sales: 1200 },
    { day: 'Mer', visitors: 2380, sales: 980 },
    { day: 'Jeu', visitors: 3490, sales: 1580 },
    { day: 'Ven', visitors: 4200, sales: 2100 },
    { day: 'Sam', visitors: 3800, sales: 1900 },
    { day: 'Dim', visitors: 2900, sales: 1200 },
  ];

  const stats = [
    {
      title: 'Chiffre d\'affaires Total',
      value: '€34,250',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600',
      trend: 'up'
    },
    {
      title: 'Commandes Totales',
      value: '863',
      change: '+8.2%',
      icon: ShoppingCart,
      color: 'text-blue-600',
      trend: 'up'
    },
    {
      title: 'Clients Actifs',
      value: '2,543',
      change: '+15.3%',
      icon: Users,
      color: 'text-purple-600',
      trend: 'up'
    },
    {
      title: 'Marge Bénéficiaire',
      value: '24.8%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-orange-600',
      trend: 'up'
    },
  ];

  const chartConfig = {
    revenue: {
      label: "Chiffre d'affaires",
      color: "#FF6B6B",
    },
    orders: {
      label: "Commandes",
      color: "#4ECDC4",
    },
    visitors: {
      label: "Visiteurs",
      color: "#45B7D1",
    },
    sales: {
      label: "Ventes",
      color: "#FF6B6B",
    },
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Tableau de Bord</h1>
        <p className="text-sm lg:text-base text-gray-600">Bienvenue ! Voici un aperçu de votre activité commerciale.</p>
      </div>

      {/* Live Stats Banner */}
      <Card className="bg-gradient-to-r from-orange-500 to-pink-500 text-white animate-scale-in">
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Activity className="h-5 w-5 lg:h-6 lg:w-6 animate-pulse" />
              <div className="text-center lg:text-left">
                <p className="text-sm opacity-90">Données en Temps Réel</p>
                <p className="text-base lg:text-lg font-bold">Activité Actuelle</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 text-center">
              <div>
                <p className="text-xl lg:text-2xl font-bold">{liveData.activeUsers}</p>
                <p className="text-xs opacity-75">Utilisateurs en ligne</p>
              </div>
              <div>
                <p className="text-xl lg:text-2xl font-bold">{liveData.ordersToday}</p>
                <p className="text-xs opacity-75">Commandes aujourd'hui</p>
              </div>
              <div>
                <p className="text-xl lg:text-2xl font-bold">€{liveData.revenueToday}</p>
                <p className="text-xs opacity-75">Revenus aujourd'hui</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <Card key={stat.title} className="hover-scale transition-all duration-300 hover:shadow-lg animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium truncate">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full bg-opacity-10 ${stat.color.replace('text-', 'bg-')}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                <span className="text-xs text-muted-foreground ml-1 hidden sm:block">par rapport au mois dernier</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid - Stack on mobile, side by side on larger screens */}
      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
        {/* Revenue Chart */}
        <Card className="animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center text-base lg:text-lg">
              <TrendingUp className="mr-2 h-4 w-4 lg:h-5 lg:w-5 text-orange-500" />
              Chiffre d'affaires & Commandes
            </CardTitle>
            <CardDescription className="text-sm">Tendances mensuelles des revenus et commandes</CardDescription>
          </CardHeader>
          <CardContent className="p-3 lg:p-6">
            <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] lg:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card className="animate-slide-in-right" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center text-base lg:text-lg">
              <Eye className="mr-2 h-4 w-4 lg:h-5 lg:w-5 text-orange-500" />
              Répartition des Appareils
            </CardTitle>
            <CardDescription className="text-sm">Préférences d'appareils des utilisateurs</CardDescription>
          </CardHeader>
          <CardContent className="p-3 lg:p-6">
            <div className="h-[200px] sm:h-[250px] lg:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius="70%"
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trends - Full width */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center text-base lg:text-lg">
            <Activity className="mr-2 h-4 w-4 lg:h-5 lg:w-5 text-orange-500" />
            Tendances Hebdomadaires
          </CardTitle>
          <CardDescription className="text-sm">Visiteurs et ventes de la semaine</CardDescription>
        </CardHeader>
        <CardContent className="p-3 lg:p-6">
          <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] lg:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrends} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="var(--color-visitors)" 
                  strokeWidth={2}
                  dot={{ fill: "var(--color-visitors)", strokeWidth: 1, r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="var(--color-sales)" 
                  strokeWidth={2}
                  dot={{ fill: "var(--color-sales)", strokeWidth: 1, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Order Status Overview */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center text-base lg:text-lg">
            <ShoppingCart className="mr-2 h-4 w-4 lg:h-5 lg:w-5 text-orange-500" />
            Aperçu des Statuts de Commandes
          </CardTitle>
          <CardDescription className="text-sm">Répartition actuelle des statuts de toutes les commandes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {orderStatusData.map((status, index) => (
              <div key={status.status} className="text-center p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-md transition-all duration-300 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-2xl lg:text-3xl font-bold mb-2" style={{ color: status.color }}>
                  {status.count}
                </div>
                <Badge variant="secondary" className="text-xs mb-2">
                  {status.status}
                </Badge>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000 ease-out" 
                    style={{ 
                      backgroundColor: status.color, 
                      width: `${(status.count / Math.max(...orderStatusData.map(s => s.count))) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
