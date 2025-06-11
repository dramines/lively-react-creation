
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Mail, Phone, MoreHorizontal, Users, Star, Crown, UserX, Filter, Download } from 'lucide-react';

const ClientsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock client data
  const clients = [
    {
      id: 1,
      name: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      phone: '+33 1 23 45 67 89',
      orders: 3,
      totalSpent: 156.50,
      lastOrder: '2024-01-15',
      status: 'active',
      joinDate: '2023-08-15',
      favoriteGenre: 'Aventure'
    },
    {
      id: 2,
      name: 'Pierre Martin',
      email: 'pierre.martin@email.com',
      phone: '+33 1 98 76 54 32',
      orders: 1,
      totalSpent: 45.00,
      lastOrder: '2024-01-10',
      status: 'active',
      joinDate: '2024-01-05',
      favoriteGenre: 'Fantaisie'
    },
    {
      id: 3,
      name: 'Sophie Leclerc',
      email: 'sophie.leclerc@email.com',
      phone: '+33 1 56 78 90 12',
      orders: 5,
      totalSpent: 289.75,
      lastOrder: '2024-01-18',
      status: 'premium',
      joinDate: '2023-06-20',
      favoriteGenre: 'Éducatif'
    },
    {
      id: 4,
      name: 'Jean Rousseau',
      email: 'jean.rousseau@email.com',
      phone: '+33 1 34 56 78 90',
      orders: 0,
      totalSpent: 0,
      lastOrder: 'Jamais',
      status: 'inactive',
      joinDate: '2023-12-10',
      favoriteGenre: 'Inconnu'
    },
    {
      id: 5,
      name: 'Emma Bernard',
      email: 'emma.bernard@email.com',
      phone: '+33 1 23 45 67 89',
      orders: 2,
      totalSpent: 98.25,
      lastOrder: '2024-01-12',
      status: 'active',
      joinDate: '2023-11-08',
      favoriteGenre: 'Conte'
    }
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>Actif</span>
          </Badge>
        );
      case 'premium':
        return (
          <Badge variant="default" className="bg-orange-100 text-orange-800 border-orange-200 flex items-center space-x-1">
            <Crown className="h-3 w-3" />
            <span>Premium</span>
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="secondary" className="flex items-center space-x-1">
            <UserX className="h-3 w-3" />
            <span>Inactif</span>
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getClientTier = (totalSpent: number) => {
    if (totalSpent >= 200) return { tier: 'Or', color: 'text-yellow-600', icon: Crown };
    if (totalSpent >= 100) return { tier: 'Argent', color: 'text-gray-500', icon: Star };
    return { tier: 'Bronze', color: 'text-orange-600', icon: Users };
  };

  const exportClients = () => {
    console.log('Exporting clients...');
    // Here you would implement actual export functionality
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-orange-500" />
              Gestion des Clients
            </CardTitle>
            <CardDescription>
              Gérez votre base de clients et consultez les informations des clients
            </CardDescription>
          </div>
          <Button onClick={exportClients} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Clients Actifs</p>
                <p className="text-2xl font-bold text-green-700">{clients.filter(c => c.status === 'active').length}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Clients Premium</p>
                <p className="text-2xl font-bold text-orange-700">{clients.filter(c => c.status === 'premium').length}</p>
              </div>
              <Crown className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Revenus Totaux</p>
                <p className="text-2xl font-bold text-blue-700">€{clients.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}</p>
              </div>
              <Star className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
        </div>

        {/* Clients Table */}
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Client</TableHead>
                <TableHead className="font-semibold">Contact</TableHead>
                <TableHead className="font-semibold">Commandes</TableHead>
                <TableHead className="font-semibold">Dépenses</TableHead>
                <TableHead className="font-semibold">Dernière Commande</TableHead>
                <TableHead className="font-semibold">Statut</TableHead>
                <TableHead className="font-semibold">Niveau</TableHead>
                <TableHead className="w-[100px] font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client, index) => {
                const tierInfo = getClientTier(client.totalSpent);
                return (
                  <TableRow key={client.id} className="hover:bg-gray-50 transition-colors animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">ID: #{client.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-2 h-3 w-3 text-blue-500" />
                          <span className="truncate max-w-[200px]">{client.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="mr-2 h-3 w-3 text-green-500" />
                          {client.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium text-lg">{client.orders}</div>
                        <div className="text-xs text-muted-foreground">commandes</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-green-600">€{client.totalSpent.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{client.lastOrder}</div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(client.status)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${tierInfo.color} border-current flex items-center space-x-1`}>
                        <tierInfo.icon className="h-3 w-3" />
                        <span>{tierInfo.tier}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="hover-scale">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <Users className="mr-2 h-5 w-5 text-orange-500" />
                              Profil Client - {client.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Informations Personnelles</h4>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                  <p><span className="font-medium">Nom:</span> {client.name}</p>
                                  <p><span className="font-medium">Email:</span> {client.email}</p>
                                  <p><span className="font-medium">Téléphone:</span> {client.phone}</p>
                                  <p><span className="font-medium">Membre depuis:</span> {new Date(client.joinDate).toLocaleDateString('fr-FR')}</p>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Statistiques d'Achat</h4>
                                <div className="bg-blue-50 p-4 rounded-lg space-y-2 border border-blue-200">
                                  <p><span className="font-medium">Commandes totales:</span> <span className="font-bold text-blue-700">{client.orders}</span></p>
                                  <p><span className="font-medium">Montant total:</span> <span className="font-bold text-green-600">€{client.totalSpent.toFixed(2)}</span></p>
                                  <p><span className="font-medium">Dernière commande:</span> {client.lastOrder}</p>
                                  <p><span className="font-medium">Genre préféré:</span> {client.favoriteGenre}</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-900">Statut et Niveau</h4>
                              <div className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-600">Statut:</span>
                                  {getStatusBadge(client.status)}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-600">Niveau:</span>
                                  <Badge variant="outline" className={`${tierInfo.color} border-current flex items-center space-x-1`}>
                                    <tierInfo.icon className="h-3 w-3" />
                                    <span>{tierInfo.tier}</span>
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">Aucun client trouvé</p>
            <p className="text-gray-400 text-sm">Essayez de modifier vos critères de recherche</p>
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Total des clients affichés:</span>
            <span className="font-bold text-orange-600">{filteredClients.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientsTable;
