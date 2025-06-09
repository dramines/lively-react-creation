import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, Eye, Smartphone, Monitor, TrendingUp, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';

const StatisticsOverview = () => {
  const [realtimeVisitors, setRealtimeVisitors] = useState(156);

  // Simulate realtime visitor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeVisitors(prev => Math.floor(Math.random() * 50) + 120);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Mock data for visitor analytics
  const visitorData = [
    { month: 'Jan', visitors: 1200, newVisitors: 800 },
    { month: 'Fév', visitors: 1890, newVisitors: 1200 },
    { month: 'Mar', visitors: 2380, newVisitors: 1500 },
    { month: 'Avr', visitors: 3490, newVisitors: 2100 },
    { month: 'Mai', visitors: 4200, newVisitors: 2800 },
    { month: 'Jun', visitors: 3800, newVisitors: 2400 },
  ];

  // Mock data for device distribution
  const deviceData = [
    { name: 'Mobile', value: 65, color: '#ff6b6b', users: 2580 },
    { name: 'Ordinateur', value: 25, color: '#4ecdc4', users: 995 },
    { name: 'Tablette', value: 10, color: '#45b7d1', users: 398 },
  ];

  // Mock data for page views
  const pageViewData = [
    { page: 'Accueil', views: 5420, uniqueViews: 4200 },
    { page: 'Produits', views: 3280, uniqueViews: 2800 },
    { page: 'À propos', views: 1840, uniqueViews: 1650 },
    { page: 'Contact', views: 980, uniqueViews: 890 },
    { page: 'Blog', views: 1650, uniqueViews: 1420 },
  ];

  const chartConfig = {
    visitors: {
      label: "Visiteurs",
      color: "#ff6b6b",
    },
    newVisitors: {
      label: "Nouveaux Visiteurs",
      color: "#4ecdc4",
    },
    views: {
      label: "Vues de Page",
      color: "#4ecdc4",
    },
    uniqueViews: {
      label: "Vues Uniques",
      color: "#45b7d1",
    },
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Real-time Banner */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white animate-fade-in">
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <Globe className="h-5 w-5 lg:h-6 lg:w-6" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm opacity-90">Activité en Temps Réel</p>
                <p className="text-base lg:text-lg font-bold">Visiteurs Actuels</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-2xl lg:text-3xl font-bold">{realtimeVisitors}</p>
              <p className="text-xs opacity-75">visiteurs actifs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-scale transition-all duration-300 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visiteurs Totaux</CardTitle>
            <div className="p-2 rounded-full bg-orange-100">
              <Users className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold">23,456</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> par rapport au mois dernier
            </p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-orange-500 rounded-full w-[75%] transition-all duration-1000"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale transition-all duration-300 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vues de Page</CardTitle>
            <div className="p-2 rounded-full bg-blue-100">
              <Eye className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold">89,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> par rapport au mois dernier
            </p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-500 rounded-full w-[65%] transition-all duration-1000"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale transition-all duration-300 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Mobile</CardTitle>
            <div className="p-2 rounded-full bg-green-100">
              <Smartphone className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold">65%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> par rapport au mois dernier
            </p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-green-500 rounded-full w-[65%] transition-all duration-1000"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale transition-all duration-300 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Moyenne</CardTitle>
            <div className="p-2 rounded-full bg-purple-100">
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold">3m 42s</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.5%</span> par rapport au mois dernier
            </p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-purple-500 rounded-full w-[45%] transition-all duration-1000"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - Stack on mobile, side by side on larger screens */}
      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
        {/* Visitor Trends Chart */}
        <Card className="animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center text-base lg:text-lg">
              <TrendingUp className="mr-2 h-4 w-4 lg:h-5 lg:w-5 text-orange-500" />
              Tendances des Visiteurs
            </CardTitle>
            <CardDescription className="text-sm">Analyse des visiteurs mensuels au cours des 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent className="p-3 lg:p-6">
            <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] lg:h-[300px] w-full">
              <AreaChart data={visitorData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-visitors)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-visitors)" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorNewVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-newVisitors)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-newVisitors)" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
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
                <Area 
                  type="monotone" 
                  dataKey="visitors" 
                  stackId="1"
                  stroke="var(--color-visitors)" 
                  fillOpacity={1}
                  fill="url(#colorVisitors)"
                />
                <Area 
                  type="monotone" 
                  dataKey="newVisitors" 
                  stackId="1"
                  stroke="var(--color-newVisitors)" 
                  fillOpacity={1}
                  fill="url(#colorNewVisitors)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Device Distribution Chart */}
        <Card className="animate-slide-in-right" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center text-base lg:text-lg">
              <Monitor className="mr-2 h-4 w-4 lg:h-5 lg:w-5 text-orange-500" />
              Répartition des Appareils
            </CardTitle>
            <CardDescription className="text-sm">Comment les utilisateurs accèdent à votre site</CardDescription>
          </CardHeader>
          <CardContent className="p-3 lg:p-6">
            <div className="h-[200px] sm:h-[250px] lg:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius="40%"
                    outerRadius="70%"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-gray-600">{data.value}% ({data.users} utilisateurs)</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 lg:gap-4 mt-4">
              {deviceData.map((device, index) => (
                <div key={device.name} className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: device.color }}
                    />
                    <span className="text-xs lg:text-sm font-medium truncate">{device.name}</span>
                  </div>
                  <p className="text-xs text-gray-500">{device.users} utilisateurs</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page Views Table - Full width */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center text-base lg:text-lg">
            <Eye className="mr-2 h-4 w-4 lg:h-5 lg:w-5 text-orange-500" />
            Pages les Plus Visitées
          </CardTitle>
          <CardDescription className="text-sm">Pages les plus consultées sur votre site</CardDescription>
        </CardHeader>
        <CardContent className="p-3 lg:p-6">
          <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] lg:h-[300px] w-full">
            <BarChart data={pageViewData} layout="horizontal" margin={{ top: 5, right: 5, left: 60, bottom: 5 }}>
              <XAxis 
                type="number" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                dataKey="page" 
                type="category" 
                width={50} 
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-blue-600">Vues totales: {payload[0].value}</p>
                        <p className="text-sm text-green-600">Vues uniques: {payload[1].value}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="views" fill="var(--color-views)" radius={[0, 2, 2, 0]} />
              <Bar dataKey="uniqueViews" fill="var(--color-uniqueViews)" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsOverview;
