
import { getData, postData, putData } from './api';

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: 'to_do' | 'in_progress' | 'completed';
  assigned_to?: string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export class ProjectTasksService {
  static async getTasksByProjectId(projectId: string): Promise<ProjectTask[]> {
    const response = await getData(`project_tasks/read.php?project_id=${projectId}`);
    return response.records || [];
  }

  static async createTask(task: Partial<ProjectTask>): Promise<ProjectTask> {
    const response = await postData('project_tasks/create.php', task);
    return response;
  }

  static async updateTask(task: Partial<ProjectTask>): Promise<ProjectTask> {
    const response = await putData('project_tasks/update.php', task);
    return response;
  }

  static async deleteTask(id: string): Promise<any> {
    // Use standard fetch for delete to have better control over the request
    const response = await fetch(`${import.meta.env.VITE_API_URL}/project_tasks/delete.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}
