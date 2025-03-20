
import { fetchData, createData, updateData, deleteData } from '../utils/api';
import { Tache } from '../types';

const ENDPOINT = '/tasks';

// Helper function to convert frontend task fields to database fields
const mapToDbFields = (task: Partial<Tache>) => {
  return {
    id: task.id,
    title: task.titre,
    description: task.description,
    status: mapStatusToDb(task.statut),
    due_date: task.dateEchéance,
    priority: mapPriorityToDb(task.priorite),
    user_id: task.user_id
  };
};

// Helper function to convert database task fields to frontend fields
const mapToFrontendFields = (dbTask: any): Tache => {
  return {
    id: dbTask.id,
    titre: dbTask.title,
    description: dbTask.description || '',
    statut: mapStatusToFrontend(dbTask.status),
    dateEchéance: dbTask.due_date,
    priorite: mapPriorityToFrontend(dbTask.priority),
    assignéÀ: dbTask.assigned_to || '',
    user_id: dbTask.user_id
  };
};

// Map frontend status to database status
const mapStatusToDb = (status?: string) => {
  if (!status) return 'pending';
  
  const statusMap: Record<string, string> = {
    'à_faire': 'pending',
    'en_cours': 'in-progress',
    'terminé': 'completed'
  };
  
  return statusMap[status] || 'pending';
};

// Map database status to frontend status
const mapStatusToFrontend = (status?: string) => {
  if (!status) return 'à_faire';
  
  const statusMap: Record<string, string> = {
    'pending': 'à_faire',
    'in-progress': 'en_cours',
    'completed': 'terminé'
  };
  
  return statusMap[status] as 'à_faire' | 'en_cours' | 'terminé';
};

// Map frontend priority to database priority
const mapPriorityToDb = (priority?: string) => {
  if (!priority) return 'medium';
  
  const priorityMap: Record<string, string> = {
    'basse': 'low',
    'moyenne': 'medium',
    'haute': 'high'
  };
  
  return priorityMap[priority] || 'medium';
};

// Map database priority to frontend priority
const mapPriorityToFrontend = (priority?: string) => {
  if (!priority) return 'moyenne';
  
  const priorityMap: Record<string, string> = {
    'low': 'basse',
    'medium': 'moyenne',
    'high': 'haute'
  };
  
  return priorityMap[priority] as 'basse' | 'moyenne' | 'haute';
};

export const TasksService = {
  getAllTasks: async (userId?: string) => {
    const params = userId ? { user_id: userId } : {};
    try {
      const response = await fetchData(`${ENDPOINT}/read.php`, params);
      
      // Check if response is an array of tasks
      if (Array.isArray(response)) {
        return response.map(task => mapToFrontendFields(task));
      }
      
      // If server returns an object with records property
      if (response && Array.isArray(response.records)) {
        return response.records.map((task: any) => mapToFrontendFields(task));
      }
      
      // Return empty array if no tasks are found
      return [];
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  },

  getTask: async (id: string) => {
    try {
      const response = await fetchData(`${ENDPOINT}/read_one.php`, { id });
      return mapToFrontendFields(response);
    } catch (error) {
      console.error('Error getting task:', error);
      throw error;
    }
  },

  createTask: async (taskData: Partial<Tache>) => {
    try {
      const dbTaskData = mapToDbFields(taskData);
      console.log('Creating task with data:', dbTaskData);
      return await createData(`${ENDPOINT}/create.php`, dbTaskData);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  updateTask: async (taskData: Partial<Tache>) => {
    try {
      const dbTaskData = mapToDbFields(taskData);
      console.log('Updating task with data:', dbTaskData);
      return await updateData(`${ENDPOINT}/update.php`, dbTaskData);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    try {
      return await deleteData(`${ENDPOINT}/delete.php`, id);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};
