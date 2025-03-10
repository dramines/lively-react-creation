
import { fetchData, createData, updateData } from '../utils/api';
import { AuthService } from './auth.service';
import { toast } from 'react-hot-toast';

const ENDPOINT = '/project_tasks';

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  status: 'à_faire' | 'en_cours' | 'terminé';
  assigned_to?: string;
  deadline?: string;
  project_id: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const ProjectTasksService = {
  createTask: async (taskData: Partial<ProjectTask>) => {
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?.id;
    
    if (!userId) {
      toast.error('You must be logged in to create tasks');
      throw new Error('Authentication required');
    }
    
    try {
      const data = { ...taskData, user_id: userId };
      const response = await createData(`${ENDPOINT}/create.php`, data);
      return response;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  updateTask: async (taskData: Partial<ProjectTask>) => {
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?.id;
    
    if (!userId) {
      toast.error('You must be logged in to update tasks');
      throw new Error('Authentication required');
    }
    
    try {
      const data = { ...taskData, user_id: userId };
      const response = await updateData(`${ENDPOINT}/update.php`, data);
      return response;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?.id;
    
    if (!userId) {
      toast.error('You must be logged in to delete tasks');
      throw new Error('Authentication required');
    }
    
    try {
      const data = { id, user_id: userId };
      const response = await createData(`${ENDPOINT}/delete.php`, data);
      return response;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};
