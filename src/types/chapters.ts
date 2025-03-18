export interface Season {
  id_saison: string;
  name_saison: string;
  photo_saison: string;
  havechapters_saisons: string;
  issub_saison?: string;
  about_link?: string;
}

export interface Chapter {
  id_chapter: string;
  id_saison: string;
  name_chapter: string;
  photo_chapter: string;
}

export interface SousChapter {
  id_souschapter: string;
  id_chapter: string;
  id_saison: string;
  image_url: string;
  tovideopage: string;
  name_souschapter?: string;
}

export interface SeasonsResponse {
  success: boolean;
  saisons: Season[];
}

export interface ChaptersResponse {
  success: boolean;
  chapters: Chapter[];
}

export interface SousChaptersResponse {
  [index: number]: SousChapter;
}

export interface Video {
  id_video: string;
  saison: string;
  cat_video: string;
  name_video: string;
  descri_video: string;
  url_video: string;
  url_thumbnail: string;
  created_at: string;
  seasonName?: string;
  id_chapter?: string;
  id_souschapter?: string;
}

export interface VideosResponse {
  success: boolean;
  videos: Video[];
}

export interface AddSeasonFormData {
  name_saison: string;
  photo_saison?: File;
  havechapters_saisons: string;
  about_link?: string;
}

export interface EditSeasonFormData {
  id_saison: string;
  name_saison: string;
  photo_saison?: File;
  havechapters_saisons?: string;
  about_link?: string;
}

export interface EditChapterFormData {
  id_chapter: string;
  name_chapter: string;
  photo_chapter?: File;
}

export interface Comment {
  id_comment: string;
  id_user?: string;
  id_client?: string;
  user_name: string;
  comment_text: string;
  date_comment?: string;
  created_at: string;
  id_saison?: string;
  id_video?: string;
  rating?: number;
  name_saison?: string;
  photo_saison?: string;
}

export interface CommentsResponse {
  success: boolean;
  comments: Comment[];
  saison_info?: {
    title: string;
    photo: string;
  };
  rating_info?: {
    average: number;
    total: number;
  };
}
