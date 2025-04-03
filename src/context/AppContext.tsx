
import { createContext, useContext, ReactNode } from 'react';
import type { ClientType } from '../types';

interface AppContextType {
  clientType: ClientType;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
  clientType: ClientType;
}

export const AppProvider = ({ children, clientType }: AppProviderProps) => {
  const value = {
    clientType,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
