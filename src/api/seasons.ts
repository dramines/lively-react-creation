import axios from 'axios';
import { EditSeasonFormData } from '@/types/chapters';

export const addSeason = async (formData: FormData) => {
  console.log('Adding season with form data');
  
  try {
    const response = await axios.post(
      'https://plateform.draminesaid.com/app/add_saison.php',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log('Season added:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding season:', error);
    throw error;
  }
};

export const addChapter = async (seasonId: string, name: string, photo: File) => {
  console.log('Adding chapter:', { seasonId, name });
  
  try {
    const formData = new FormData();
    formData.append('id_saison', seasonId);
    formData.append('name_chapter', name);
    formData.append('photo_chapter', photo);
    
    const response = await axios.post(
      'https://plateform.draminesaid.com/app/add_chapter.php',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log('Chapter added:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding chapter:', error);
    throw error;
  }
};

export const modifySeason = async (formData: FormData) => {
  console.log('Modifying season with form data');
  
  try {
    const response = await axios.post(
      'https://plateform.draminesaid.com/app/modify_saison.php',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    console.log('Season modified:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error modifying season:', error);
    throw error;
  }
};

export const deleteSeason = async (seasonId: string) => {
  console.log('Deleting season:', seasonId);
  
  try {
    const response = await axios.delete(
      'https://plateform.draminesaid.com/app/delete_saison.php',
      { data: { id_saison: seasonId } }
    );
    
    console.log('Season deleted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting season:', error);
    throw error;
  }
};

export const deleteChapter = async (chapterId: string) => {
  console.log('Deleting chapter:', chapterId);
  
  try {
    const response = await axios.delete(
      'https://plateform.draminesaid.com/app/delete_chapter.php',
      { data: { id_chapter: chapterId } }
    );
    
    console.log('Chapter deleted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting chapter:', error);
    throw error;
  }
};
