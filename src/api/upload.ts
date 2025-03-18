
import axios from 'axios';

interface UploadVideoParams {
  videoFile: File;
  thumbnailFile: File;
  title: string;
  description: string;
  saison: string;
  chapter: string;
  souschapter?: string;
  onProgress?: (progress: number, loaded: number, total: number) => void;
}

export const uploadVideo = async ({
  videoFile,
  thumbnailFile,
  title,
  description,
  saison,
  chapter,
  souschapter,
  onProgress
}: UploadVideoParams) => {
  console.log('Starting video upload...');
  
  const formData = new FormData();
  formData.append('video', videoFile);
  formData.append('thumbnail', thumbnailFile);
  formData.append('title', title);
  formData.append('description', description);
  formData.append('id_saison', saison);
  formData.append('id_chapter', chapter);
  
  if (souschapter) {
    formData.append('id_souschapter', souschapter);
  }
  
  try {
    const response = await axios.post(
      'https://plateform.draminesaid.com/app/upload.php',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = (progressEvent.loaded * 100) / progressEvent.total;
            onProgress(progress, progressEvent.loaded, progressEvent.total);
          }
        }
      }
    );
    
    console.log('Video upload response:', response.data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to upload video');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};
