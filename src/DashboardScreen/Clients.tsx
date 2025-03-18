
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Check, Pause, Box, Trash2, Search, ChevronDown, RotateCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { RequestSkeletonRow } from "./components/RequestSkeletonRow";
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
import { useQueryClient } from '@tanstack/react-query';
import { usePaginatedUsers } from '../hooks/usePaginatedUsers';
import { fetchPaginatedUsers } from '../api/users';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ClientsProps,
  UserData,
  APISeasonResponse,
  APIUserSeasonsResponse,
} from '../types/users';

const Clients: React.FC<ClientsProps> = ({ user }) => {
  const queryClient = useQueryClient();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [alertMessage, setAlertMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAllowerModalOpen, setIsAllowerModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'reject' | 'activate' | 'deactivate' | 'delete'>('delete');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userFilterStatus, setUserFilterStatus] = useState<string>('all');
  const [userFilterSeason, setUserFilterSeason] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [allSeasons, setAllSeasons] = useState<APISeasonResponse['saisons']>([]);
  const [userSeasons, setUserSeasons] = useState<APIUserSeasonsResponse['seasons']>([]);
  const [key] = useState("38457");
  const [seasonsLoading, setSeasonsLoading] = useState(false);
  const [userSeasonsLoading, setUserSeasonsLoading] = useState(false);
  const [selectedFormations, setSelectedFormations] = useState<string[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(userSearchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [userSearchTerm]);

  // Use paginated query
  const { 
    data: paginatedUsersData, 
    isLoading: usersLoading, 
    refetch: refetchUsers 
  } = usePaginatedUsers(currentPage, itemsPerPage, debouncedSearchTerm);

  const users = paginatedUsersData?.data || [];
  const pagination = paginatedUsersData?.pagination;
  const totalPages = pagination?.total_pages || 1;

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, itemsPerPage]);

  const showTemporarySuccess = (message: string) => {
    setAlertMessage(message);
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);
  };

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
    const matchesStatus = userFilterStatus === 'all' 
      ? true 
      : userData.user.status_client === (userFilterStatus === 'active' ? '1' : '0');

    const userSeasonsList = getUserSeasons(userData.user.id_client);
    
    const matchesSeason = selectedFormations.length === 0
      ? true
      : selectedFormations.every(selectedSeason => 
          userSeasonsList.some(userSeason => userSeason.id_saison === selectedSeason)
      );

    return matchesStatus && matchesSeason;
  });

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
        showTemporarySuccess("L'utilisateur a été supprimé avec succès");
        await queryClient.invalidateQueries({ queryKey: ['paginatedUsers'] });
        await refetchUsers();
        
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
        showTemporarySuccess("L'utilisateur a été activé avec succès");
        await queryClient.invalidateQueries({ queryKey: ['paginatedUsers'] });
        await refetchUsers();
        
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
        showTemporarySuccess("L'utilisateur a été désactivé avec succès");
        await queryClient.invalidateQueries({ queryKey: ['paginatedUsers'] });
        await refetchUsers();
        
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

  const confirmAction = (id_client: string, email_client: string, action: 'activate' | 'deactivate' | 'delete') => {
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

  const handleRefresh = async () => {
    try {
      await refetchUsers();
      toast({
        title: "Actualisation",
        description: "La liste des utilisateurs a été actualisée avec succès",
        className: "bg-[#2a98cb] text-white font-medium border-none",
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'actualisation",
      });
    }
  };

  const handleRowsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="p-6 mt-16">
      {showSuccessAlert && (
        <Alert className="mb-4 bg-green-500 text-white">
          <AlertTitle>Succès</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Informations Utilisateurs</h2>
          <p className="text-gray-500">Liste des utilisateurs enregistrés</p>
        </div>
        <div className="flex gap-4 items-center">
          <Button 
            variant="outline"
            onClick={handleRefresh}
            className="gap-2 bg-white text-black hover:bg-gray-100"
            disabled={usersLoading}
          >
            <RotateCw className={`h-4 w-4 ${usersLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          
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

      <Card className="overflow-hidden">
        <div className="flex justify-between p-4 bg-gray-50 border-b">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Afficher</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleRowsPerPageChange}
            >
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500 ml-2">entrées</span>
          </div>
          <div className="text-sm text-gray-500">
            {pagination && (
              <>
                Affichage de {((pagination.current_page - 1) * pagination.limit) + 1} à {Math.min(pagination.current_page * pagination.limit, pagination.total)} sur {pagination.total} utilisateurs
              </>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersLoading ? (
                Array(itemsPerPage).fill(null).map((_, index) => (
                  <RequestSkeletonRow key={index} />
                ))
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((userData) => (
                  <TableRow key={userData.user.id_client} className="border-b hover:bg-gray-50">
                    <TableCell>{userData.user.id_client}</TableCell>
                    <TableCell>{userData.user.nom_client}</TableCell>
                    <TableCell>{userData.user.prenom_client}</TableCell>
                    <TableCell>{userData.user.email_client}</TableCell>
                    <TableCell>{userData.user.telephone_client}</TableCell>
                    <TableCell>{new Date(userData.user.createdat_client).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        userData.user.status_client === '1' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {userData.user.status_client === '1' ? "Actif" : "Inactif"}
                      </span>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {pagination && totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Page {pagination.current_page} sur {pagination.total_pages}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show 5 pages max centered around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else {
                  const leftOffset = Math.min(2, currentPage - 1);
                  const rightOffset = Math.min(2, totalPages - currentPage);
                  let start = currentPage - leftOffset;
                  
                  if (currentPage + rightOffset < totalPages - 1) {
                    start = Math.max(1, start);
                  } else {
                    start = Math.max(1, totalPages - 4);
                  }
                  
                  pageNum = start + i;
                  if (pageNum > totalPages) return null;
                }
                
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      className={`${
                        currentPage === pageNum 
                          ? 'bg-primary text-white hover:bg-primary/90'
                          : 'hover:bg-primary/10'
                      }`}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              }).filter(Boolean)}
              
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
          onClose={() => {
            setIsAllowerModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['paginatedUsers'] });
            refetchUsers();
          }}
          isOpen={isAllowerModalOpen}
        />
      )}
    </div>
  );
};

export default Clients;
