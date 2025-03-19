
import { fetchData, createData, deleteData } from '../utils/api';
import { AuthService } from './auth.service';

const ENDPOINT = '/files';

export interface FileResponse {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  created_at?: string;
  user_id?: string;
}

export const FilesService = {
  getAllFiles: async () => {
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?.id;
    const params = userId ? { user_id: userId } : {};
    
    try {
      const response = await fetchData(`${ENDPOINT}/read.php`, params);
      return response.map((file: any) => ({
        id: file.id,
        name: file.name,
        type: file.type.includes('image') ? 'image' : 
              file.type.includes('pdf') ? 'pdf' : 'document',
        size: typeof file.size === 'number' 
              ? `${(file.size / 1024 / 1024).toFixed(2)} MB` 
              : file.size,
        url: file.url,
        date: file.created_at || new Date().toISOString(),
        user_id: file.user_id
      }));
    } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
    }
  },

  uploadFile: async (file: File) => {
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?.id;
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);
    
    if (userId) {
      formData.append('user_id', userId);
    }
    
    try {
      // Use specific FormData content-type handling
      const response = await createData(`${ENDPOINT}/create.php`, formData, true);
      
      if (response && response.url) {
        return {
          id: response.id,
          name: file.name,
          type: file.type.includes('image') ? 'image' : 
                file.type.includes('pdf') ? 'pdf' : 'document',
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          url: response.url,
          date: new Date().toISOString()
        };
      } else {
        throw new Error(response.message || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  deleteFile: async (id: string) => {
    try {
      // Delete the file using the id
      return await deleteData(`${ENDPOINT}/delete.php`, id);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};
