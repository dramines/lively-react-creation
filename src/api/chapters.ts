import axios from 'axios';
import { SeasonsResponse, ChaptersResponse, SousChaptersResponse, EditChapterFormData } from '@/types/chapters';

export const fetchSeasons = async () => {
  console.log('Fetching seasons...');
  const response = await axios.get<SeasonsResponse>('https://plateform.draminesaid.com/app/get_saisons.php');
  console.log('Seasons fetched:', response.data);
  return response.data;
};

export const fetchChapters = async (seasonId?: string) => {
  console.log('Fetching chapters...');
  const url = seasonId 
    ? `https://plateform.draminesaid.com/app/get_chapters.php?id_saison=${seasonId}`
    : 'https://plateform.draminesaid.com/app/get_chapters.php';
  const response = await axios.get<ChaptersResponse>(url);
  console.log('Chapters fetched:', response.data);
  return response.data;
};

export const fetchSousChapters = async (chapterId: string) => {
  console.log('Fetching sous-chapters for chapter:', chapterId);
  const response = await axios.get<SousChaptersResponse>(
    `https://plateform.draminesaid.com/app/get_souschapters.php?id_chapter=${chapterId}`
  );
  console.log('Sous-chapters fetched:', response.data);
  return response.data;
};

export const modifyChapter = async (formData: FormData) => {
  console.log('Modifying chapter with form data');
  
  try {
    const response = await axios.post(
      'https://plateform.draminesaid.com/app/modify_chapter.php',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log('Chapter modified:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error modifying chapter:', error);
    throw error;
  }
};
