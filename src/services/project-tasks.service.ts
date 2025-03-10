
import { createData, updateData, deleteData, fetchData } from '../utils/api';

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: 'à_faire' | 'en_cours' | 'terminé';
  assigned_to: string;
  deadline: string;
  project_id: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

const ENDPOINT = '/project_tasks';

export const ProjectTasksService = {
  getAllProjectTasks: async (projectId: string): Promise<ProjectTask[]> => {
    try {
      const response = await fetchData(`${ENDPOINT}/read.php`, { project_id: projectId });
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching project tasks:', error);
      return [];
    }
  },

  createProjectTask: async (taskData: Partial<ProjectTask>): Promise<ProjectTask> => {
    try {
      return await createData(`${ENDPOINT}/create.php`, taskData);
    } catch (error) {
      console.error('Error creating project task:', error);
      throw error;
    }
  },

  updateProjectTask: async (taskData: Partial<ProjectTask>): Promise<ProjectTask> => {
    try {
      return await updateData(`${ENDPOINT}/update.php`, taskData);
    } catch (error) {
      console.error('Error updating project task:', error);
      throw error;
    }
  },

  deleteProjectTask: async (taskId: string, userId: string): Promise<void> => {
    try {
      await deleteData(`${ENDPOINT}/delete.php`, { id: taskId, user_id: userId });
    } catch (error) {
      console.error('Error deleting project task:', error);
      throw error;
    }
  }
};
