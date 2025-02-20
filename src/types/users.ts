
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

