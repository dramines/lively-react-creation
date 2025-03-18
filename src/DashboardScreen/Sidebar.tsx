import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Book, BookOpen, ChevronRight, Home, LogOut, Settings, Upload, Users, MessageSquare, Shield, FileVideo, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

// Define the user type
interface User {
  id: string;
  isAdmin?: boolean;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  active?: number;
}

interface SidebarProps {
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const isAdmin = user.isAdmin === true;
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Only show the sidebar if it's open on mobile, always show on desktop
  const sidebarVisible = isMobile ? isOpen : true;

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col border-r border-r-border/50 bg-dashboard-sidebar duration-300 transition-all",
        isOpen ? "translate-x-0" : "-translate-x-full",
        !sidebarVisible ? 'hidden' : '',
        isMobile ? 'fixed' : ''
      )}
    >
      {/* Sidebar Toggle Button (Mobile Only) */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="p-4 text-white hover:bg-primary/10 absolute top-4 right-4 z-50"
        >
          <ChevronRight className={cn("h-6 w-6 transition-transform duration-300", isOpen ? "rotate-180" : "")} />
        </button>
      )}

      {/* Sidebar Header */}
      <div className="flex items-center gap-2 px-6 py-3">
        <BookOpen className="h-6 w-6 text-primary" />
        <span className="font-bold">Draminesaid</span>
      </div>

      {/* Navigation Links */}
      <nav className="mt-8 flex flex-col space-y-1 px-3">
        <NavLink
          to="/"
          className={({ isActive }) => cn(
            "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
            isActive
              ? "bg-primary/20 text-primary"
              : "text-white/70 hover:text-white hover:bg-primary/10"
          )}
        >
          <Home className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </NavLink>
        {isAdmin && (
          <>
            <NavLink
              to="/app/clients"
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-primary/20 text-primary"
                  : "text-white/70 hover:text-white hover:bg-primary/10"
              )}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Clients</span>
            </NavLink>
            <NavLink
              to="/app/requests"
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-primary/20 text-primary"
                  : "text-white/70 hover:text-white hover:bg-primary/10"
              )}
            >
              <Shield className="mr-2 h-4 w-4" />
              <span>Requests</span>
            </NavLink>
            <NavLink
              to="/app/comments"
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-white/70 hover:text-white hover:bg-primary/10"
                )
              }
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Comments</span>
            </NavLink>
            <NavLink
              to="/app/upload"
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-primary/20 text-primary"
                  : "text-white/70 hover:text-white hover:bg-primary/10"
              )}
            >
              <Upload className="mr-2 h-4 w-4" />
              <span>Upload</span>
            </NavLink>
            <NavLink
              to="/app/seasons"
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-primary/20 text-primary"
                  : "text-white/70 hover:text-white hover:bg-primary/10"
              )}
            >
              <Book className="mr-2 h-4 w-4" />
              <span>Seasons</span>
            </NavLink>
             <NavLink
              to="/app/history"
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-primary/20 text-primary"
                  : "text-white/70 hover:text-white hover:bg-primary/10"
              )}
            >
              <History className="mr-2 h-4 w-4" />
              <span>History</span>
            </NavLink>
          </>
        )}
        
        {/* Season 6 Videos Link - New Link */}
        <NavLink
          to="/app/season6-videos"
          className={({ isActive }) => cn(
            "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
            isActive 
              ? "bg-primary/20 text-primary" 
              : "text-white/70 hover:text-white hover:bg-primary/10"
          )}
        >
          <FileVideo className="mr-2 h-4 w-4" />
          <span>Season 6 Videos</span>
        </NavLink>
        
        <NavLink
          to="/app/settings"
          className={({ isActive }) => cn(
            "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
            isActive
              ? "bg-primary/20 text-primary"
              : "text-white/70 hover:text-white hover:bg-primary/10"
          )}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center px-3 py-2 rounded-md text-sm text-white/70 hover:text-white hover:bg-primary/10 transition-colors"
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
