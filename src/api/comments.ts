
import axios from 'axios';
import { Comment } from '@/types/chapters';

const API_BASE_URL = 'https://plateform.draminesaid.com/app';

export const fetchComments = async (seasonId?: string): Promise<{success: boolean, comments: Comment[]}> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_comments.php`, {
      params: seasonId ? { id_saison: seasonId } : {}
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const addComment = async (videoId: string, userId: string, comment: string): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('id_video', videoId);
    formData.append('id_user', userId);
    formData.append('comment', comment);
    
    const response = await axios.post(`${API_BASE_URL}/add_comment.php`, formData);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const deleteComment = async (commentId: string): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('id_comment', commentId);
    
    const response = await axios.post(`${API_BASE_URL}/delete_comment.php`, formData);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};
