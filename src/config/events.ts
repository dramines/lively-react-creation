
export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  capacity?: number;
  reservationNumbers?: number[];
  image?: string;
}

export const EVENTS: Event[] = [
  {
    id: 'event-1',
    title: 'Dégustation de Dattes Deglet Nour',
    date: '2023-12-15T14:00:00',
    location: 'Siège Tazart, Tunis',
    description: 'Venez découvrir notre gamme de dattes Deglet Nour premium lors d\'une dégustation exclusive avec nos experts.',
    capacity: 30,
    reservationNumbers: [2, 3, 1],
    image: '/events/degustation.jpg'
  },
  {
    id: 'event-2',
    title: 'Atelier Culinaire: Pâtisseries aux Dattes',
    date: '2024-01-20T10:00:00',
    location: 'Boutique Tazart, La Marsa',
    description: 'Apprenez à créer de délicieuses pâtisseries en utilisant nos produits dérivés de dattes avec notre chef pâtissier.',
    capacity: 15,
    reservationNumbers: [4, 2],
    image: '/events/atelier.jpg'
  },
  {
    id: 'event-3',
    title: 'Visite de la Palmeraie',
    date: '2024-02-10T09:00:00',
    location: 'Tozeur, Tunisie',
    description: 'Participez à une excursion guidée dans notre palmeraie partenaire à Tozeur et découvrez l\'origine de nos produits.',
    capacity: 20,
    reservationNumbers: [6, 3, 2, 1],
    image: '/events/palmeraie.jpg'
  }
];
