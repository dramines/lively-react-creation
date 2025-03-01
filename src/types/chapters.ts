export interface Season {
  id: string;
  name: string;
  description?: string;
}

export interface Chapter {
  id: string;
  name: string;
  season_id: string;
  description?: string;
}

export interface SeasonsResponse {
  success: boolean;
  message: string;
  data: Season[];
}

export interface ChaptersResponse {
  success: boolean;
  message: string;
  data: Chapter[];
}