import React, { useState, useEffect } from 'react'; // Added useEffect import
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Pause, Box, Trash2, Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "@/components/ui/use-toast";
import Modal from './Modal';
import AllowerModal from './AllowerModal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUsers } from '../api/users';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface User {
  id_client: string;
  nom_client: string;
  prenom_client: string;
  email_client: string;
  telephone_client: string;
  createdat_client: string;
  status_client: string;
}

interface SaisonPermission {
  id_client: number;
  id_saison: number;
}

interface Saison {
  id_saison: number;
  nom_saison: string;
}

interface UserData {
  user: User;
  user_saison_permissions: SaisonPermission[];
  saison_objects: Saison[];
}

interface ClientsProps {
  user: any;
}

interface APISeasonResponse {
  success: boolean;
  saisons: {
    id_saison: number;
    name_saison: string;
    havechapters_saisons: number;
    photo_saison: string;
  }[];
}

interface APIUserSeasonsResponse {
  success: boolean;
  seasons: {
    id: string;
    id_client: string;
    id_saison: string;
    name_saison: string;
  }[];
}

const SkeletonRow = () => (
  <tr>
    <td className="px-6 py-4"><Skeleton className="h-4 w-[100px]" /></td>
    <td className="px-6 py-4"><Skeleton className="h-4 w-[100px]" /></td>
    <td className="px-6 py-4"><Skeleton className="h-4 w-[100px]" /></td>
    <td className="px-6 py-4"><Skeleton className="h-4 w-[150px]" /></td>
    <td className="px-6 py-4"><Skeleton className="h-4 w-[100px]" /></td>
    <td className="px-6 py-4"><Skeleton className="h-4 w-[100px]" /></td>
    <td className="px-6 py-4"><Skeleton className="h-4 w-[100px]" /></td>
    <td className="px-6 py-4">
      <div className="flex gap-2">
        <Skeleton className="h-9 w-[100px]" />
        <Skeleton className="h-9 w-[100px]" />
      </div>
    </td>
  </tr>
);

const Clients: React.FC<ClientsProps> = ({ user }) => {
  const queryClient = useQueryClient();
  const itemsPerPage = 10;
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAllowerModalOpen, setIsAllowerModalOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userFilterStatus, setUserFilterStatus] = useState<string>('all');
  const [userFilterSeason, setUserFilterSeason] = useState<string>('all');
  const [userFilterAllocation, setUserFilterAllocation] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [allSeasons, setAllSeasons] = useState<APISeasonResponse['saisons']>([]);
  const [userSeasons, setUserSeasons] = useState<APIUserSeasonsResponse['seasons']>([]);
  const [key] = useState("38457");
  const [seasonsLoading, setSeasonsLoading] = useState(false);
  const [userSeasonsLoading, setUserSeasonsLoading] = useState(false);
  const [selectedFormations, setSelectedFormations] = useState<string[]>([]);

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  useEffect(() => {
    const loadSecondaryData = async () => {
      setSeasonsLoading(true);
      setUserSeasonsLoading(true);
      
      try {
        const seasonsResponse = await axios.get<APISeasonResponse>(
          'https://plateform.draminesaid.com/app/get_saisons.php'
        );
        if (seasonsResponse.data.success) {
          setAllSeasons(seasonsResponse.data.saisons);
        }

        const userSeasonsResponse = await axios.get<APIUserSeasonsResponse>(
          'https://plateform.draminesaid.com/app/get_allusers_seasons.php'
        );
        if (userSeasonsResponse.data.success) {
          setUserSeasons(userSeasonsResponse.data.seasons);
        }
      } catch (error) {
        console.error("Error loading secondary data:", error);
      } finally {
        setSeasonsLoading(false);
        setUserSeasonsLoading(false);
      }
    };

    loadSecondaryData();
  }, []);

  const getUserSeasons = (userId: string) => {
    return userSeasons.filter(season => season.id_client === userId);
  };

  const filteredUsers = users.filter((userData: UserData) => {
    const matchesSearch = Object.values(userData.user).some(value =>
      String(value).toLowerCase().includes(userSearchTerm.toLowerCase())
    );
    
    const matchesStatus = userFilterStatus === 'all' 
      ? true 
      : userData.user.status_client === (userFilterStatus === 'active' ? '1' : '0');

    const userSeasonsList = getUserSeasons(userData.user.id_client);
    
    const matchesSeason = selectedFormations.length === 0
      ? true
      : selectedFormations.some(selectedSeason => 
          userSeasonsList.some(userSeason => userSeason.id_saison === selectedSeason)
        );

    const matchesAllocation = userFilterAllocation === 'all'
      ? true
      : userFilterAllocation === 'with-seasons'
      ? userSeasonsList.length > 0
      : userSeasonsList.length === 0;

    return matchesSearch && matchesStatus && matchesSeason && matchesAllocation;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id_client: string) => {
    setIsModalOpen(false);
    try {
      const response = await fetch('https://plateform.draminesaid.com/app/delete_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_client, key }),
      });
      const data = await response.json();
      if (data.success) {
        await queryClient.invalidateQueries({ queryKey: ['users'] });
        toast({
          title: "Utilisateur supprimé",
          description: "L'utilisateur a été supprimé avec succès",
          className: "bg-[#2a98cb] text-white font-medium border-none",
        });
        await logUploadEvent("L'utilisateur a été supprimé avec succès");
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: data.message || "Échec de la suppression de l'utilisateur",
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Échec de la suppression de l'utilisateur",
      });
    }
  };

  const handleActivate = async (id_client: string, email_client: string) => {
    setIsModalOpen(false);
    try {
      const response = await fetch('https://plateform.draminesaid.com/app/useractivation.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: id_client, key, email_client }),
      });
      const data = await response.json();
      if (data.success) {
        await queryClient.invalidateQueries({ queryKey: ['users'] });
        toast({
          title: "Utilisateur activé",
          description: "L'utilisateur a été activé avec succès",
          className: "bg-[#2a98cb] text-white font-medium border-none",
        });
        await logUploadEvent("L'utilisateur a été activé avec succès");
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: data.message || "Échec de l'activation de l'utilisateur",
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Échec de l'activation de l'utilisateur",
      });
    }
  };

  const handleDeActivate = async (id_client: string) => {
    setIsModalOpen(false);
    try {
      const response = await fetch('https://plateform.draminesaid.com/app/deuseractivation.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: id_client, key }),
      });
      const data = await response.json();
      if (data.success) {
        await queryClient.invalidateQueries({ queryKey: ['users'] });
        toast({
          title: "Utilisateur désactivé",
          description: "L'utilisateur a été désactivé avec succès",
          className: "bg-[#2a98cb] text-white font-medium border-none",
        });
        await logUploadEvent("L'utilisateur a été désactivé avec succès");
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: data.message || "Échec de la désactivation de l'utilisateur",
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Échec de la désactivation de l'utilisateur",
      });
    }
  };

  const logUploadEvent = async (title: string) => {
    try {
      await axios.post('https://plateform.draminesaid.com/app/data_logs.php', {
        id_log: 'uniqueLogId',
        text_log: title,
        date_log: new Date().toISOString(),
        user_log: user.email,
        type_log: 'compte',
      });
    } catch (err) {
      console.error('Failed to log the event:', err);
    }
  };

  const confirmAction = (id_client: string, email_client: string, action: string) => {
    setSelectedUserId(id_client);
    setSelectedUserEmail(email_client); 
    setActionType(action);
    setIsModalOpen(true);
  };

  const openAllowerModal = (id_client: string) => {
    setSelectedUserId(id_client);
    setIsAllowerModalOpen(true);
  };

  const handleFormationToggle = (formationId: string) => {
    setSelectedFormations(prev => {
      if (prev.includes(formationId)) {
        return prev.filter(id => id !== formationId);
      } else {
        return [...prev, formationId];
      }
    });
  };

  const selectAllFormations = () => {
    const allFormationIds = allSeasons.map(season => season.id_saison.toString());
    setSelectedFormations(allFormationIds);
  };

  const clearFormationSelection = () => {
    setSelectedFormations([]);
  };

  return (
    <div className="p-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Informations Utilisateurs</h2>
          <p className="text-gray-500">Liste des utilisateurs enregistrés</p>
        </div>
        <div className="flex gap-4 items-center">
          <Select
            value={userFilterAllocation}
            onValueChange={setUserFilterAllocation}
          >
            <SelectTrigger className="w-[180px] text-black">
              <SelectValue placeholder="Statut des formations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les utilisateurs</SelectItem>
              <SelectItem value="with-seasons">Avec formations</SelectItem>
              <SelectItem value="without-seasons">Sans formations</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={userFilterStatus}
            onValueChange={setUserFilterStatus}
          >
            <SelectTrigger className="w-[180px] text-black">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[200px] justify-between"
              >
                <span>Filtrer par Formations ({selectedFormations.length})</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <div className="p-2 space-y-2">
                <div className="flex gap-2 border-b pb-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={selectAllFormations}
                  >
                    Tout sélectionner
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={clearFormationSelection}
                  >
                    Effacer
                  </Button>
                </div>
                {allSeasons.map((season) => (
                  <div key={season.id_saison} className="flex items-center space-x-2">
                    <Checkbox
                      id={`formation-${season.id_saison}`}
                      checked={selectedFormations.includes(season.id_saison.toString())}
                      onCheckedChange={() => handleFormationToggle(season.id_saison.toString())}
                    />
                    <label
                      htmlFor={`formation-${season.id_saison}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {season.name_saison}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="w-72">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="pl-8 text-black"
              />
            </div>
          </div>
        </div>
      </div>

      {showAlert && (
        <Alert className="mb-6">
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-4 text-left font-medium text-gray-500">ID</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500">Nom</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500">Prénom</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500">Email</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500">Téléphone</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500">Date de création</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500">Statut</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersLoading ? (
                Array(5).fill(null).map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : (
                paginatedUsers.map((userData) => (
                  <tr key={userData.user.id_client} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{userData.user.id_client}</td>
                    <td className="px-6 py-4">{userData.user.nom_client}</td>
                    <td className="px-6 py-4">{userData.user.prenom_client}</td>
                    <td className="px-6 py-4">{userData.user.email_client}</td>
                    <td className="px-6 py-4">{userData.user.telephone_client}</td>
                    <td className="px-6 py-4">{new Date(userData.user.createdat_client).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        userData.user.status_client === '1' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {userData.user.status_client === '1' ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {userData.user.status_client === '0' && (
                          <Button
                            size="sm"
                            onClick={() => confirmAction(userData.user.id_client, userData.user.email_client, 'activate')}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Activer
                          </Button>
                        )}
                        {userData.user.status_client === '1' && (
                          <>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => confirmAction(userData.user.id_client, userData.user.email_client, 'deactivate')}
                            >
                              <Pause className="h-4 w-4 mr-1" />
                              Désactiver
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => openAllowerModal(userData.user.id_client)}
                            >
                              <Box className="h-4 w-4 mr-1" />
                              Allouer
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => confirmAction(userData.user.id_client, userData.user.email_client, 'delete')}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    className={`${
                      currentPage === page 
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'hover:bg-primary/10'
                    }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {isModalOpen && (
        <Modal
          action={actionType}
          message={`Êtes-vous sûr de vouloir ${
            actionType === 'delete' 
              ? 'supprimer' 
              : actionType === 'activate' 
              ? 'activer' 
              : 'désactiver'
          } cet utilisateur ?`}
          onConfirm={() => {
            if (actionType === 'delete') {
              handleDelete(selectedUserId!);
            } else if (actionType === 'activate') {
              handleActivate(selectedUserId!, selectedUserEmail);
            } else if (actionType === 'deactivate') {
              handleDeActivate(selectedUserId!);
            }
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      )}

      {isAllowerModalOpen && selectedUserId && (
        <AllowerModal
          userId={selectedUserId}
          onClose={() => setIsAllowerModalOpen(false)}
          isOpen={isAllowerModalOpen}
        />
      )}
    </div>
  );
};

export default Clients;
