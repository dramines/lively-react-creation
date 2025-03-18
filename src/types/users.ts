
export interface User {
  id_client: string;
  nom_client: string;
  prenom_client: string;
  email_client: string;
  telephone_client: string;
  createdat_client: string;
  status_client: string;
}

export interface SaisonPermission {
  id_client: number;
  id_saison: number;
}

export interface Saison {
  id_saison: number;
  nom_saison: string;
}

export interface UserData {
  user: User;
  user_saison_permissions: SaisonPermission[];
  saison_objects: Saison[];
}

export interface ClientsProps {
  user: {
    email: string;
  };
}

export interface APISeasonResponse {
  success: boolean;
  saisons: Array<{
    id_saison: string;
    name_saison: string;
  }>;
}

export interface APIUserSeasonsResponse {
  success: boolean;
  seasons: Array<{
    id_client: string;
    id_saison: string;
  }>;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  seasonId?: string;
}

export interface RegistrationRequest {
  id: string;
  id_user: string;
  id_saison: string;
  created_at: string;
  id_client: string;
  nom_client: string;
  prenom_client: string;
  email_client: string;
  telephone_client: string;
}

export interface SaisonData {
  id_saison: number;
  name_saison: string;
  havechapters_saisons: number;
  issub_saison: number;
  about_link: string;
  photo_saison: string;
}

export interface Pagination {
  total: number;
  total_pages: number;
  current_page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}
