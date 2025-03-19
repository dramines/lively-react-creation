// Utility functions for localStorage management

// Generic function to get data from localStorage
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) {
      return defaultValue;
    }
    return JSON.parse(storedValue) as T;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
}

// Generic function to save data to localStorage
export function saveToLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

// Function to clear all app data from localStorage
export function clearAllAppData(): void {
  try {
    localStorage.removeItem('artists');
    localStorage.removeItem('events');
    localStorage.removeItem('tasks');
    localStorage.removeItem('passwords');
    localStorage.removeItem('projects');
    // Remove authentication state as well
    localStorage.removeItem('isAuthenticated');
  } catch (error) {
    console.error('Error clearing app data from localStorage:', error);
  }
}

// Initialize localStorage with empty data structures
export function initializeLocalStorage(): void {
  // Only initialize if the data doesn't exist yet
  if (!localStorage.getItem('artists')) {
    saveToLocalStorage('artists', []);
  }
  if (!localStorage.getItem('events')) {
    saveToLocalStorage('events', []);
  }
  if (!localStorage.getItem('tasks')) {
    saveToLocalStorage('tasks', []);
  }
  if (!localStorage.getItem('passwords')) {
    saveToLocalStorage('passwords', []);
  }
  if (!localStorage.getItem('projects')) {
    saveToLocalStorage('projects', []);
  }
}