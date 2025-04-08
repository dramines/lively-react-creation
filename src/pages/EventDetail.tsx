import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { EVENTS } from '../config/events'; // Assuming you have an events config
import type { Event } from '../types';

interface EventDetailProps {
  eventId?: string;
}

const EventDetail = ({ eventId }: EventDetailProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [attendees, setAttendees] = useState('1');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const { eventId: paramEventId } = useParams<{ eventId: string }>();
  const currentEventId = eventId || paramEventId;
  const [foundEvent, setFoundEvent] = useState<Event | undefined>(undefined);

  useEffect(() => {
    if (currentEventId) {
      const event = EVENTS.find((event) => event.id === currentEventId);
      setFoundEvent(event);
    }
  }, [currentEventId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'PPP', { locale: fr });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'HH:mm', { locale: fr });
  };

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !phone || !attendees) {
      toast.error(t('events.fill_all_fields'));
      return;
    }
    
    if (foundEvent && foundEvent.capacity && parseInt(attendees) > foundEvent.capacity) {
      toast.error(t('events.too_many_attendees'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if event has reached capacity
      const currentReservations = foundEvent?.reservationNumbers ? foundEvent.reservationNumbers.reduce((sum, num) => sum + num, 0) : 0;
      const remainingCapacity = (foundEvent?.capacity || 0) - currentReservations;
      
      if (parseInt(attendees) > remainingCapacity) {
        toast.error(t('events.not_enough_capacity'));
        setIsSubmitting(false);
        return;
      }
      
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      toast.success(t('events.reservation_success'));
      setName('');
      setEmail('');
      setPhone('');
      setAttendees('1');
      setMessage('');
    } catch (error) {
      toast.error(t('events.reservation_error'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!foundEvent) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">{t('events.event_not_found')}</h2>
        <p className="text-gray-500">{t('events.check_url')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Event Details */}
        <div>
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">{foundEvent.title}</h2>
          <div className="flex items-center text-gray-600 mb-2">
            <Calendar className="mr-2 h-5 w-5" />
            <span>{formatDate(foundEvent.date)}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <Clock className="mr-2 h-5 w-5" />
            <span>{formatTime(foundEvent.date)}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="mr-2 h-5 w-5" />
            <span>{foundEvent.location}</span>
          </div>
          {foundEvent.capacity && (
            <div className="flex items-center text-gray-600 mb-2">
              <Users className="mr-2 h-5 w-5" />
              <span>{t('events.capacity')}: {foundEvent.capacity}</span>
            </div>
          )}
          <p className="text-gray-700">{foundEvent.description}</p>
        </div>

        {/* Reservation Form */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">{t('events.reserve_spot')}</h3>
          <form onSubmit={handleReservation} className="space-y-4">
            <div>
              <Label htmlFor="name">{t('events.name')}</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('events.your_name')}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">{t('events.email')}</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('events.your_email')}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">{t('events.phone')}</Label>
              <Input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('events.your_phone')}
                required
              />
            </div>
            <div>
              <Label htmlFor="attendees">{t('events.attendees')}</Label>
              <Input
                type="number"
                id="attendees"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                min="1"
                placeholder="1"
                required
              />
            </div>
            <div>
              <Label htmlFor="message">{t('events.message')}</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('events.optional_message')}
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-[#700100] hover:bg-[#96cc39] text-white transition-colors">
              {isSubmitting ? t('events.reserving') : t('events.reserve')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
