
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Circle
} from 'lucide-react';
import { format, isSameDay, isAfter, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Reservation {
  id_reservation: number;
  nom_client: string;
  email_client: string;
  telephone_client: string;
  date_reservation: string;
  heure_reservation: string;
  statut_reservation: string;
  notes_reservation?: string;
  date_creation: string;
}

interface ReservationCalendarProps {
  reservations: Reservation[];
  onConfirmReservation: (id: number) => void;
  onDeleteReservation: (id: number) => void;
}

const ReservationCalendar = ({ 
  reservations, 
  onConfirmReservation, 
  onDeleteReservation 
}: ReservationCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'En attente', variant: 'secondary' as const, icon: AlertCircle },
      confirmed: { label: 'Confirmé', variant: 'default' as const, icon: CheckCircle },
      cancelled: { label: 'Annulé', variant: 'destructive' as const, icon: XCircle },
      completed: { label: 'Terminé', variant: 'outline' as const, icon: Circle }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { 
      label: status, 
      variant: 'secondary' as const, 
      icon: Circle 
    };
    const Icon = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  // Get reservations for selected date
  const selectedDateReservations = reservations.filter(reservation =>
    isSameDay(new Date(reservation.date_reservation), selectedDate)
  );

  // Get upcoming reservations (next 7 days)
  const today = startOfDay(new Date());
  const upcomingReservations = reservations
    .filter(reservation => {
      const reservationDate = new Date(reservation.date_reservation);
      const daysDiff = Math.ceil((reservationDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      return daysDiff >= 0 && daysDiff <= 7;
    })
    .sort((a, b) => new Date(a.date_reservation).getTime() - new Date(b.date_reservation).getTime());

  // Get dates that have reservations for calendar highlighting
  const reservationDates = reservations.map(r => new Date(r.date_reservation));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendrier des Réservations
          </CardTitle>
          <CardDescription>
            Cliquez sur une date pour voir les réservations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={fr}
              modifiers={{
                hasReservation: reservationDates
              }}
              modifiersStyles={{
                hasReservation: {
                  backgroundColor: '#f3f4f6',
                  color: '#1f2937',
                  fontWeight: 'bold'
                }
              }}
              className="rounded-md border"
            />
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Reservations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Prochaines Réservations
          </CardTitle>
          <CardDescription>
            Les 7 prochains jours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingReservations.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Aucune réservation à venir
              </p>
            ) : (
              upcomingReservations.map((reservation) => (
                <div key={reservation.id_reservation} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{reservation.nom_client}</div>
                    {getStatusBadge(reservation.statut_reservation)}
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {format(new Date(reservation.date_reservation), 'dd MMM yyyy', { locale: fr })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {reservation.heure_reservation.slice(0, 5)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Reservations */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>
            Réservations du {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
          </CardTitle>
          <CardDescription>
            {selectedDateReservations.length} réservation(s) pour cette date
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDateReservations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune réservation pour cette date</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedDateReservations.map((reservation) => (
                <Card key={reservation.id_reservation} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{reservation.nom_client}</CardTitle>
                      {getStatusBadge(reservation.statut_reservation)}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {reservation.heure_reservation.slice(0, 5)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="truncate">{reservation.email_client}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span>{reservation.telephone_client}</span>
                      </div>
                      {reservation.notes_reservation && (
                        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          <strong>Notes:</strong> {reservation.notes_reservation}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      {reservation.statut_reservation === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onConfirmReservation(reservation.id_reservation)}
                          className="text-green-600 hover:text-green-800 flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Confirmer
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onDeleteReservation(reservation.id_reservation)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationCalendar;
