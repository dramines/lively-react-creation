
export interface Artiste {
  id: string;
  nom: string;
  genre: string;
  photo: string;
  bio: string;
  social: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  evenementsPassés: number;
  email?: string;
  telephone?: string;
  adresse?: string;
  rehearsalHours?: number;
  totalRevenue?: number;
  user_id: string;
}

export interface Tache {
  id: string;
  titre: string;
  description: string;
  statut: 'à_faire' | 'en_cours' | 'terminé';
  dateEchéance: string;
  priorite: 'basse' | 'moyenne' | 'haute';
  assignéÀ?: string;
  user_id: string;
}

export interface Projet {
  id: string;
  nom: string;
  description?: string;
  artiste_id: string;
  artiste_nom?: string;
  statut: 'planifié' | 'en_cours' | 'terminé' | 'annulé';
  date_debut?: string;
  date_fin?: string;
  budget: number;
  taches: ProjetTache[];
  user_id: string;
}

export interface ProjetTache {
  id: string;
  titre: string;
  description?: string;
  statut: 'à_faire' | 'en_cours' | 'terminé';
  assignéÀ?: string;
  dateEchéance?: string;
  projet_id: string;
  user_id: string;
}
