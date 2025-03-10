
import { fetchData, createData, updateData, deleteData } from '../utils/api';
import { AuthService } from './auth.service';
import { toast } from 'react-hot-toast';
import { Project } from '../types';

const ENDPOINT = '/projects';

export const ProjectsService = {
  getAllProjects: async () => {
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?.id;
    const params = userId ? { user_id: userId } : {};
    
    try {
      const response = await fetchData(`${ENDPOINT}/read.php`, params);
      console.log('API response for projects:', response);
      
      if (!response) {
        console.error('Empty response from projects API');
        return [];
      }
      
      if (!Array.isArray(response)) {
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
      const response = await fetchData(`${ENDPOINT}/read_one.php`, params);
      
      if (!response || response.message === "Project not found.") {
        console.error(`Project with ID ${id} not found`);
        toast.error('Project not found');
        return null;
      }
      
      return response;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      toast.error('Failed to load project details');
      return null;
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
      console.log('Creating project with data:', { ...projectData, user_id: userId });
      const data = { ...projectData, user_id: userId };
      const response = await createData(`${ENDPOINT}/create.php`, data);
      
      if (!response || !response.id) {
        console.error('Invalid response from project creation:', response);
        toast.error('Failed to create project');
        throw new Error('Invalid server response');
      }
      
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
      console.log('Updating project with data:', { ...projectData, user_id: userId });
      const data = { ...projectData, user_id: userId };
      const response = await updateData(`${ENDPOINT}/update.php`, data);
      
      if (!response) {
        console.error('Invalid response from project update:', response);
        toast.error('Failed to update project');
        throw new Error('Invalid server response');
      }
      
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
      console.log('Deleting project:', { id, user_id: userId });
      const response = await deleteData(`${ENDPOINT}/delete.php`, id);
      
      if (!response) {
        console.error('Invalid response from project deletion:', response);
        toast.error('Failed to delete project');
        throw new Error('Invalid server response');
      }
      
      toast.success('Project deleted successfully');
      return response;
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
      throw error;
    }
  }
};
