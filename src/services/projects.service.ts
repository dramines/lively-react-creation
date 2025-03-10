
import { fetchData, createData, updateData } from '../utils/api';
import { AuthService } from './auth.service';
import { toast } from 'react-hot-toast';

const ENDPOINT = '/projects';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date?: string;
  budget: number;
  artist_id: string;
  artist_name?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  tasks?: any[];
}

export const ProjectsService = {
  getAllProjects: async (artistId?: string) => {
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?.id;
    const params: any = userId ? { user_id: userId } : {};
    
    if (artistId) {
      params.artist_id = artistId;
    }
    
    try {
      const response = await fetchData(`${ENDPOINT}/read.php`, params);
      if (!response || !Array.isArray(response)) {
        console.error('Invalid response format from projects API:', response);
        return [];
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
      return [];
    }
  },

  getProject: async (id: string) => {
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?.id;
    const params = { id, ...(userId ? { user_id: userId } : {}) };
    
    try {
      return await fetchData(`${ENDPOINT}/read_one.php`, params);
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      toast.error('Failed to load project details');
      throw error;
    }
  },

  createProject: async (projectData: Partial<Project>) => {
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?.id;
    
    if (!userId) {
      toast.error('You must be logged in to create projects');
      throw new Error('Authentication required');
    }
    
    try {
      const data = { ...projectData, user_id: userId };
      const response = await createData(`${ENDPOINT}/create.php`, data);
      toast.success('Project created successfully');
      return response;
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
      throw error;
    }
  },

  updateProject: async (projectData: Partial<Project>) => {
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?.id;
    
    if (!userId) {
      toast.error('You must be logged in to update projects');
      throw new Error('Authentication required');
    }
    
    try {
      const data = { ...projectData, user_id: userId };
      const response = await updateData(`${ENDPOINT}/update.php`, data);
      toast.success('Project updated successfully');
      return response;
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
      throw error;
    }
  },

  deleteProject: async (id: string) => {
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?.id;
    
    if (!userId) {
      toast.error('You must be logged in to delete projects');
      throw new Error('Authentication required');
    }
    
    try {
      const data = { id, user_id: userId };
      const response = await createData(`${ENDPOINT}/delete.php`, data);
      toast.success('Project deleted successfully');
      return response;
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
      throw error;
    }
  }
};
