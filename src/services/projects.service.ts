
import { fetchData, createData, updateData, deleteData } from '../utils/api';
import { Projet, ProjetTache } from '../types';

const ENDPOINT = '/projects';
const TASKS_ENDPOINT = '/project_tasks';

// Helper function to convert frontend project fields to database fields
const mapToDbFields = (project: Partial<Projet>) => {
  return {
    id: project.id,
    name: project.nom,
    description: project.description || '',
    artist_id: project.artiste_id,
    status: mapStatusToDb(project.statut),
    start_date: project.date_debut,
    end_date: project.date_fin,
    budget: project.budget || 0,
    user_id: project.user_id
  };
};

// Helper function to convert database project fields to frontend fields
const mapToFrontendFields = (dbProject: any): Projet => {
  return {
    id: dbProject.id,
    nom: dbProject.name,
    description: dbProject.description || '',
    artiste_id: dbProject.artist_id,
    artiste_nom: dbProject.artist_name || '',
    statut: mapStatusToFrontend(dbProject.status),
    date_debut: dbProject.start_date,
    date_fin: dbProject.end_date,
    budget: parseFloat(dbProject.budget) || 0,
    taches: [],
    user_id: dbProject.user_id
  };
};

// Map frontend status to database status
const mapStatusToDb = (status?: string) => {
  if (!status) return 'planifié';
  
  const statusMap: Record<string, string> = {
    'planifié': 'planned',
    'en_cours': 'in_progress',
    'terminé': 'completed',
    'annulé': 'cancelled'
  };
  
  return statusMap[status] || 'planned';
};

// Map database status to frontend status
const mapStatusToFrontend = (status?: string) => {
  if (!status) return 'planifié';
  
  const statusMap: Record<string, string> = {
    'planned': 'planifié',
    'in_progress': 'en_cours',
    'completed': 'terminé',
    'cancelled': 'annulé'
  };
  
  return statusMap[status] as 'planifié' | 'en_cours' | 'terminé' | 'annulé';
};

// Helper function to convert frontend task fields to database fields
const mapTaskToDbFields = (task: Partial<ProjetTache>) => {
  return {
    id: task.id,
    title: task.titre,
    description: task.description || '',
    status: mapTaskStatusToDb(task.statut),
    assigned_to: task.assignéÀ || '',
    deadline: task.dateEchéance,
    project_id: task.projet_id,
    user_id: task.user_id
  };
};

// Helper function to convert database task fields to frontend fields
const mapTaskToFrontendFields = (dbTask: any): ProjetTache => {
  return {
    id: dbTask.id,
    titre: dbTask.title,
    description: dbTask.description || '',
    statut: mapTaskStatusToFrontend(dbTask.status),
    assignéÀ: dbTask.assigned_to || '',
    dateEchéance: dbTask.deadline,
    projet_id: dbTask.project_id,
    user_id: dbTask.user_id
  };
};

// Map frontend task status to database status
const mapTaskStatusToDb = (status?: string) => {
  if (!status) return 'à_faire';
  
  const statusMap: Record<string, string> = {
    'à_faire': 'to_do',
    'en_cours': 'in_progress',
    'terminé': 'completed'
  };
  
  return statusMap[status] || 'to_do';
};

// Map database task status to frontend status
const mapTaskStatusToFrontend = (status?: string) => {
  if (!status) return 'à_faire';
  
  const statusMap: Record<string, string> = {
    'to_do': 'à_faire',
    'in_progress': 'en_cours',
    'completed': 'terminé'
  };
  
  return statusMap[status] as 'à_faire' | 'en_cours' | 'terminé';
};

export const ProjectsService = {
  getAllProjects: async (userId?: string) => {
    const params = userId ? { user_id: userId } : {};
    try {
      const response = await fetchData(`${ENDPOINT}/read.php`, params);
      
      // Check if response is an array of projects
      if (Array.isArray(response)) {
        return response.map(project => mapToFrontendFields(project));
      }
      
      // If server returns an object with records property
      if (response && Array.isArray(response.records)) {
        return response.records.map((project: any) => mapToFrontendFields(project));
      }
      
      // Return empty array if no projects are found
      return [];
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  },

  getProjectsByArtist: async (artistId: string, userId?: string) => {
    const params = { 
      artist_id: artistId,
      ...(userId ? { user_id: userId } : {})
    };
    try {
      const response = await fetchData(`${ENDPOINT}/read.php`, params);
      
      let projects = [];
      
      // Check if response is an array of projects
      if (Array.isArray(response)) {
        projects = response.map(project => mapToFrontendFields(project));
      }
      
      // If server returns an object with records property
      else if (response && Array.isArray(response.records)) {
        projects = response.records.map((project: any) => mapToFrontendFields(project));
      }
      
      // Now load tasks for each project
      for (const project of projects) {
        const tasks = await ProjectsService.getProjectTasks(project.id, userId);
        project.taches = tasks;
      }
      
      return projects;
    } catch (error) {
      console.error('Error getting projects by artist:', error);
      throw error;
    }
  },

  getProject: async (id: string, userId?: string) => {
    try {
      const params = { id, ...(userId ? { user_id: userId } : {}) };
      const response = await fetchData(`${ENDPOINT}/read_one.php`, params);
      
      if (!response) {
        throw new Error('Project not found');
      }
      
      const project = mapToFrontendFields(response);
      
      // Load tasks for this project
      const tasks = await ProjectsService.getProjectTasks(id, userId);
      project.taches = tasks;
      
      return project;
    } catch (error) {
      console.error('Error getting project:', error);
      throw error;
    }
  },

  createProject: async (projectData: Partial<Projet>) => {
    try {
      const dbProjectData = mapToDbFields(projectData);
      console.log('Creating project with data:', dbProjectData);
      const result = await createData(`${ENDPOINT}/create.php`, dbProjectData);
      return result;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  updateProject: async (projectData: Partial<Projet>) => {
    try {
      const dbProjectData = mapToDbFields(projectData);
      console.log('Updating project with data:', dbProjectData);
      return await updateData(`${ENDPOINT}/update.php`, dbProjectData);
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  deleteProject: async (id: string) => {
    try {
      return await deleteData(`${ENDPOINT}/delete.php?id=${id}`);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  // Project Tasks related methods
  getProjectTasks: async (projectId: string, userId?: string) => {
    const params = { 
      project_id: projectId,
      ...(userId ? { user_id: userId } : {})
    };
    try {
      const response = await fetchData(`${TASKS_ENDPOINT}/read.php`, params);
      
      // Check if response is an array of tasks
      if (Array.isArray(response)) {
        return response.map(task => mapTaskToFrontendFields(task));
      }
      
      // If server returns an object with records property
      if (response && Array.isArray(response.records)) {
        return response.records.map((task: any) => mapTaskToFrontendFields(task));
      }
      
      // Return empty array if no tasks are found
      return [];
    } catch (error) {
      console.error('Error getting project tasks:', error);
      return [];
    }
  },

  createProjectTask: async (taskData: Partial<ProjetTache>) => {
    try {
      const dbTaskData = mapTaskToDbFields(taskData);
      console.log('Creating project task with data:', dbTaskData);
      return await createData(`${TASKS_ENDPOINT}/create.php`, dbTaskData);
    } catch (error) {
      console.error('Error creating project task:', error);
      throw error;
    }
  },

  updateProjectTask: async (taskData: Partial<ProjetTache>) => {
    try {
      const dbTaskData = mapTaskToDbFields(taskData);
      console.log('Updating project task with data:', dbTaskData);
      return await updateData(`${TASKS_ENDPOINT}/update.php`, dbTaskData);
    } catch (error) {
      console.error('Error updating project task:', error);
      throw error;
    }
  },

  deleteProjectTask: async (id: string) => {
    try {
      return await deleteData(`${TASKS_ENDPOINT}/delete.php?id=${id}`);
    } catch (error) {
      console.error('Error deleting project task:', error);
      throw error;
    }
  }
};
