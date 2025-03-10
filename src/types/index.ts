
// User type
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

// Task type
export interface Tache {
  id: string;
  titre: string;
  description: string;
  priorite: 'basse' | 'moyenne' | 'haute';
  statut: 'à_faire' | 'en_cours' | 'terminé';
  assignéÀ: string;
  dateEchéance: string;
  user_id: string;
}

// Event type
export interface Evenement {
  id: string;
  titre: string;
  description: string;
  date: string;
  lieu: string;
  statut: string;
  artistes: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
  budget?: number;
  photo?: string;
  placesDisponibles?: number;
  pays?: string;
  ville?: string;
  latitude?: number;
  longitude?: number;
  contactNom?: string;
  contactEmail?: string;
  contactTelephone?: string;
}

// Artist type
export interface Artiste {
  id: string;
  nom: string;
  genre: string;
  photo: string;
  bio: string;
  social: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
  evenementsPassés: number;
  email?: string;
  telephone?: string;
  adresse?: string;
  user_id: string;
}

// File type
export interface File {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  created_at: string;
  user_id: string;
}

// Password entry type
export interface PasswordEntry {
  id: string;
  user_id: string;
  site_name: string;
  site_url: string;
  username: string;
  password: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

// Invoice type
export interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  issue_date: string;
  due_date: string;
  items: string; // JSON string of line items
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  notes: string;
  created_at: string;
  user_id: string;
}

// Transaction type
export interface Transaction {
  id: string;
  date: string;
  artist_supplier: string;
  description: string;
  amount: number;
  category: string;
  status: 'payé' | 'en_attente' | 'annulé';
  type: 'dépense' | 'revenu';
  user_id?: string;
}

// Message type
export interface Message {
  id: string;
  category: 'inbox' | 'sent' | 'archived' | 'draft';
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  subject: string;
  preview: string;
  content: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  priority: 'haute' | 'normale' | 'basse';
}

// Project type
export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  budget: number;
  user_id: string;
}
