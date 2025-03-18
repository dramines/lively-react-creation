
import axios from 'axios';
import { Video, VideosResponse } from '@/types/chapters';

const API_BASE_URL = 'https://plateform.draminesaid.com/app';
const API_KEY = '38457-video-access';

export const fetchVideosByCategory = async (category: string, seasonId: string): Promise<Video[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_videos_by_category.php`, {
      params: {
        key: API_KEY,
        category,
        saison: seasonId
      }
    });
    
    if (response.data.success) {
      return response.data.videos || [];
    } else {
      console.error('Error fetching videos:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching videos by category:', error);
    return [];
  }
};

export const deleteVideo = async (videoId: string): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('id_video', videoId);
    
    const response = await axios.post(`${API_BASE_URL}/delete_video.php`, formData);
    return response.data;
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

export const fetchAllVideos = async (): Promise<Video[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_videos.php`, {
      params: {
        key: API_KEY
      }
    });
    
    if (response.data.success) {
      return response.data.data || [];
    } else {
      console.error('Error fetching all videos:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching all videos:', error);
    return [];
  }
};
