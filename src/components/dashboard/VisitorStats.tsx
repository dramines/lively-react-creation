
import { useMemo, useState } from 'react';
import type { Visitor } from '../../types/visitors';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area,
  Legend, Sector, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  Globe, Users, Map, FileText, Clock, ArrowUpRight,
  BarChart2, PieChartIcon, TrendingUp, MapPin, Activity
} from 'lucide-react';

interface VisitorStatsProps {
  visitors: Visitor[];
}

interface StatCard {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend?: number;
}

export function VisitorStats({ visitors }: VisitorStatsProps) {
  // Generate stats cards data
  const statsCards: StatCard[] = useMemo(() => {
    if (!visitors.length) return [];
    
    // Total visitors
    const totalVisitors = visitors.length;
    
    // Unique countries
    const uniqueCountries = new Set(visitors.map(v => v.country_visitors)).size;
    
    // Unique cities
    const uniqueCities = new Set(visitors.map(v => v.city_visitors)).size;
    
    // Most visited page
    const pageVisits: Record<string, number> = {};
    visitors.forEach(visitor => {
      const page = visitor.page_visitors;
      pageVisits[page] = (pageVisits[page] || 0) + 1;
    });
    
    const mostVisitedPage = Object.entries(pageVisits)
      .sort((a, b) => b[1] - a[1])[0];
    
    return [
      {
        title: 'Total Visiteurs',
        value: totalVisitors,
        icon: <Users className="h-6 w-6 text-white" />,
        color: 'text-white',
        bgColor: 'bg-[#96cc39]',
        trend: 12
      },
      {
        title: 'Pays',
        value: uniqueCountries,
        icon: <Globe className="h-6 w-6 text-white" />,
        color: 'text-white',
        bgColor: 'bg-[#C1A7F5]',
        trend: 5
      },
      {
        title: 'Villes',
        value: uniqueCities,
        icon: <Map className="h-6 w-6 text-white" />,
        color: 'text-white',
        bgColor: 'bg-[#9b87f5]',
        trend: 8
      },
      {
        title: 'Page Plus Visitée',
        value: mostVisitedPage ? `${mostVisitedPage[0].substring(0, 15)}${mostVisitedPage[0].length > 15 ? '...' : ''}` : 'N/A',
        icon: <FileText className="h-6 w-6 text-white" />,
        color: 'text-white',
        bgColor: 'bg-[#A7C6ED]',
        trend: 3
      }
    ];
  }, [visitors]);

  // Country data for pie chart
  const countryData = useMemo(() => {
    const countryCount: Record<string, number> = {};
    visitors.forEach(visitor => {
      const country = visitor.country_visitors;
      countryCount[country] = (countryCount[country] || 0) + 1;
    });
    
    return Object.entries(countryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({
        name,
        value
      }));
  }, [visitors]);

  // Page visits by date
  const pageVisitsByDate = useMemo(() => {
    const dateMap: Record<string, number> = {};
    visitors.forEach(visitor => {
      const date = new Date(visitor.date_visitors).toLocaleDateString('fr-FR');
      dateMap[date] = (dateMap[date] || 0) + 1;
    });

    return Object.entries(dateMap)
      .slice(-7) // Last 7 days
      .map(([date, visits]) => ({
        date,
        visits
      }));
  }, [visitors]);

  // Page popularity data
  const pagePopularity = useMemo(() => {
    const pageVisits: Record<string, number> = {};
    visitors.forEach(visitor => {
      const page = visitor.page_visitors;
      // Simplify page name if too long
      const simplifiedPage = page.length > 20 
        ? page.substring(0, 20) + '...' 
        : page;
      pageVisits[simplifiedPage] = (pageVisits[simplifiedPage] || 0) + 1;
    });
    
    return Object.entries(pageVisits)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({
        name,
        value
      }));
  }, [visitors]);

  const COLORS = ['#96cc39', '#C1A7F5', '#9b87f5', '#A7C6ED', '#7E69AB', '#6E59A5'];

  if (!visitors.length) {
    return <div className="text-center py-8 text-gray-500">Chargement des statistiques...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <div 
            key={index} 
            className={`${card.bgColor} rounded-lg shadow-md p-4 text-white relative overflow-hidden transition-transform hover:scale-[1.02] duration-300`}
          >
            <div className="absolute top-0 right-0 h-24 w-24 -mr-8 -mt-8 rounded-full bg-white/10 z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="text-2xl font-bold mt-2">{card.value}</p>
                  
                  {card.trend && (
                    <div className="flex items-center mt-2 text-sm text-white/90">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      <span>+{card.trend}% vs. mois dernier</span>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  {card.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traffic Trends Chart */}
        <div className="bg-white rounded-lg shadow-md p-4 col-span-1">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 mr-2 text-[#96cc39]" />
            <h3 className="text-lg font-semibold font-playfair text-gray-800">Tendance de Trafic</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={pageVisitsByDate}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#96cc39" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#96cc39" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white'
                  }}
                  labelStyle={{ fontWeight: 'bold', color: '#333' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#96cc39" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorVisits)" 
                  name="Visites"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Page Popularity Chart */}
        <div className="bg-white rounded-lg shadow-md p-4 col-span-1">
          <div className="flex items-center mb-4">
            <BarChart2 className="h-5 w-5 mr-2 text-[#9b87f5]" />
            <h3 className="text-lg font-semibold font-playfair text-gray-800">Pages Populaires</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pagePopularity}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 12 }} 
                  width={100}
                  tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                />
                <Tooltip
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white'
                  }}
                  labelStyle={{ fontWeight: 'bold', color: '#333' }}
                />
                <Bar 
                  dataKey="value" 
                  name="Visites" 
                  radius={[0, 4, 4, 0]}
                >
                  {
                    pagePopularity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Countries Distribution */}
        <div className="bg-white rounded-lg shadow-md p-4 col-span-1">
          <div className="flex items-center mb-4">
            <PieChartIcon className="h-5 w-5 mr-2 text-[#C1A7F5]" />
            <h3 className="text-lg font-semibold font-playfair text-gray-800">Distribution Géographique</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={countryData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={1}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {countryData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="white"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} visites`, name]}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Hourly visitor distribution */}
        <div className="bg-white rounded-lg shadow-md p-4 col-span-1">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 mr-2 text-[#A7C6ED]" />
            <h3 className="text-lg font-semibold font-playfair text-gray-800">Activité par Pays</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={countryData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white'
                  }}
                  formatter={(value) => [`${value} visites`, 'Nombre de visites']}
                />
                <Bar 
                  dataKey="value" 
                  name="Visites" 
                  radius={[4, 4, 0, 0]}
                >
                  {
                    countryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
