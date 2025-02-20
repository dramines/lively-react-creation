
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Box, Check, Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
import { toast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchRegistrationRequests, fetchSaisons } from '../api/users';
import { RequestSkeletonRow } from './components/RequestSkeletonRow';
import { SaisonData } from '@/types/users';

const RegistrationRequests = () => {
  const queryClient = useQueryClient();
  const [requestSearchTerm, setRequestSearchTerm] = useState('');
  const [requestFilterSeason, setRequestFilterSeason] = useState<string>('all');
  const [currentRequestPage, setCurrentRequestPage] = useState(1);
  const requestsPerPage = 15;

  const { data: registrationRequests = [], isLoading: loadingRequests, refetch: refetchRequests } = useQuery({
    queryKey: ['registrationRequests'],
    queryFn: fetchRegistrationRequests,
  });

  const { data: saisonsData = [], isLoading: loadingSaisons } = useQuery({
    queryKey: ['saisons'],
    queryFn: fetchSaisons,
  });

  const handleAcceptRequest = async (userId: string, saisonId: string, requestId: string) => {
    try {
      const allocResponse = await fetch('https://plateform.draminesaid.com/app/allocation.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          seasons: [saisonId]
        })
      });

      const allocData = await allocResponse.json();

      if (!allocData.success) {
        throw new Error('Failed to allocate season');
      }

      toast({
        title: "Succès !",
        description: "La demande a été acceptée avec succès",
        className: "bg-green-500 text-white font-medium border-none",
      });
      
      // Refresh the data
      await refetchRequests();
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error) {
      console.error('Error handling request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors du traitement de la demande",
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const response = await fetch('https://plateform.draminesaid.com/app/request_users.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: requestId })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error('Failed to reject request');
      }

      toast({
        title: "Succès !",
        description: "La demande a été rejetée avec succès",
        className: "bg-green-500 text-white font-medium border-none",
      });

      // Refresh the data
      await refetchRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors du rejet de la demande",
      });
    }
  };

  const getSeasonName = (saisonId: string): string => {
    const saison = saisonsData.find((s: SaisonData) => s.id_saison.toString() === saisonId);
    return saison ? saison.name_saison : "Formation inconnue";
  };

  const filteredRequests = registrationRequests.filter(request => {
    const searchTerm = requestSearchTerm.toLowerCase();
    const seasonName = getSeasonName(request.id_saison).toLowerCase();
    
    const matchesSearchTerm =
      request.nom_client.toLowerCase().includes(searchTerm) ||
      request.prenom_client.toLowerCase().includes(searchTerm) ||
      request.email_client.toLowerCase().includes(searchTerm) ||
      request.telephone_client.toLowerCase().includes(searchTerm) ||
      request.id_client.toLowerCase().includes(searchTerm) ||
      seasonName.includes(searchTerm) ||
      request.created_at.toLowerCase().includes(searchTerm);
  
    const matchesSeason =
      requestFilterSeason === 'all' || request.id_saison === requestFilterSeason;
  
    return matchesSearchTerm && matchesSeason;
  });
  
  const totalRequestPages = Math.ceil(filteredRequests.length / requestsPerPage);
  const requestStartIndex = (currentRequestPage - 1) * requestsPerPage;
  const currentRequests = filteredRequests.slice(requestStartIndex, requestStartIndex + requestsPerPage);

  return (
    <div className="p-6 mt-16">
      <Card className="mb-8 border-[#d175a1]/20">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-[#000000]">Demandes d'inscription en attente</h3>
          <div className="space-y-4 mb-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Rechercher une demande..."
                    value={requestSearchTerm}
                    onChange={(e) => setRequestSearchTerm(e.target.value)}
                    className="pl-8 text-black"
                  />
                </div>
              </div>
              <Select
                value={requestFilterSeason}
                onValueChange={setRequestFilterSeason}
              >
                <SelectTrigger className="w-[250px] text-black">
                  <SelectValue placeholder="Filtrer par formation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-black">Toutes les formations</SelectItem>
                  {saisonsData.map((season: SaisonData) => (
                    <SelectItem key={season.id_saison} value={season.id_saison.toString()} className="text-black">
                      {season.name_saison}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {registrationRequests.length === 0 && !loadingRequests ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Box className="h-12 w-12 mx-auto text-[#d175a1] mb-3" />
                <p className="text-gray-500 font-medium">
                  {requestFilterSeason !== 'all' 
                    ? "Aucune demande pour cette formation"
                    : "Aucune demande en attente"}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-[#2a98cb]/5">
                    <th className="text-left py-3 px-4 font-medium text-[#000000]">Utilisateur (#ID)</th>
                    <th className="text-left py-3 px-4 font-medium text-[#000000]">Télephone</th>
                    <th className="text-left py-3 px-4 font-medium text-[#000000]">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-[#000000]">Formation</th>
                    <th className="text-left py-3 px-4 font-medium text-[#000000]">Date de demande</th>
                    <th className="text-left py-3 px-4 font-medium text-[#000000]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingRequests ? (
                    Array(5).fill(null).map((_, index) => (
                      <RequestSkeletonRow key={index} />
                    ))
                  ) : (
                    currentRequests.map((request) => (
                      <tr key={request.id} className="border-b hover:bg-[#2a98cb]/5 transition-colors">
                        <td className="py-4 px-4 text-black">
                          {`${request.prenom_client} ${request.nom_client} (#${request.id_client})`}
                        </td>
                        <td className="py-4 px-4 text-black">{request.telephone_client}</td>
                        <td className="py-4 px-4 text-black">{request.email_client}</td>
                        <td className="py-4 px-4 text-black">
                          {getSeasonName(request.id_saison)}
                        </td>
                        <td className="py-4 px-4 text-black">{request.created_at}</td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAcceptRequest(request.id_user, request.id_saison, request.id)}
                              className="bg-green-500 hover:bg-green-600 transition-colors"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Accepter
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectRequest(request.id)}
                              className="bg-red-500 hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Refuser
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
          
          {totalRequestPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentRequestPage(prev => Math.max(1, prev - 1))}
                      className={currentRequestPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalRequestPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentRequestPage(page)}
                        className={`${
                          currentRequestPage === page 
                            ? 'bg-primary text-white hover:bg-primary/90'
                            : 'hover:bg-primary/10'
                        } text-black`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentRequestPage(prev => Math.min(totalRequestPages, prev + 1))}
                      className={currentRequestPage === totalRequestPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RegistrationRequests;
