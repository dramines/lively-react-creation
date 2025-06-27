
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Calendar } from "lucide-react";
import ReservationCalendar from '@/components/admin/ReservationCalendar';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Reservation {
  id_reservation: number;
  nom_client: string;
  email_client: string;
  telephone_client: string;
  date_reservation: string;
  heure_reservation: string;
  message_client?: string;
  statut_reservation: string;
  notes_reservation?: string;
  date_creation: string;
}

const AdminReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { toast } = useToast();

  const fetchReservations = async () => {
    try {
      console.log('Fetching reservations...');
      const response = await fetch('https://draminesaid.com/lucci/api/get_all_reservations.php');
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (data.success) {
        // Convert string IDs to numbers for consistency
        const processedReservations = data.data.map((reservation: any) => ({
          ...reservation,
          id_reservation: parseInt(reservation.id_reservation)
        }));
        
        console.log('Processed reservations:', processedReservations);
        setReservations(processedReservations);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error('Error fetching reservations:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la récupération des réservations",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleConfirmReservation = async (id: number) => {
    try {
      const response = await fetch(`https://draminesaid.com/lucci/api/confirmer_reservation.php?id=${id}`, {
        method: 'PUT'
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Succès",
          description: "Réservation confirmée avec succès"
        });
        fetchReservations();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error confirming reservation:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la confirmation de la réservation",
        variant: "destructive"
      });
    }
  };

  const handleDeleteReservation = async (id: number) => {
    try {
      const response = await fetch(`https://draminesaid.com/lucci/api/delete_reservation.php?id=${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Succès",
          description: "Réservation supprimée avec succès"
        });
        fetchReservations();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la réservation",
        variant: "destructive"
      });
    }
  };

  console.log('Current reservations state:', reservations);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold">Réservations</h2>
            <p className="text-muted-foreground">
              Suivez et gérez les réservations. ({reservations.length} réservations)
            </p>
          </div>
        </div>
        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calendar">
              <Calendar className="mr-2 h-4 w-4" />
              Calendrier
            </TabsTrigger>
            <TabsTrigger value="table">Tableau</TabsTrigger>
          </TabsList>
          <TabsContent value="calendar" className="space-y-4">
            <ReservationCalendar 
              reservations={reservations}
              onConfirmReservation={handleConfirmReservation}
              onDeleteReservation={handleDeleteReservation}
            />
          </TabsContent>
          <TabsContent value="table">
            <div className="rounded-md border">
              <Table>
                <TableCaption>Liste de vos réservations.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id_reservation}>
                      <TableCell className="font-medium">{reservation.id_reservation}</TableCell>
                      <TableCell>{reservation.nom_client}</TableCell>
                      <TableCell>{reservation.email_client}</TableCell>
                      <TableCell>{reservation.telephone_client}</TableCell>
                      <TableCell>{reservation.date_reservation}</TableCell>
                      <TableCell>{reservation.heure_reservation}</TableCell>
                      <TableCell>{reservation.notes_reservation || '-'}</TableCell>
                      <TableCell>{reservation.statut_reservation}</TableCell>
                      <TableCell className="text-right">
                        {reservation.statut_reservation === 'pending' ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleConfirmReservation(reservation.id_reservation)}
                            >
                              Confirmer
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteReservation(reservation.id_reservation)}
                            >
                              Supprimer
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteReservation(reservation.id_reservation)}
                          >
                            Supprimer
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminReservations;
