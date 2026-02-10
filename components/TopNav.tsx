
import React from 'react';

interface TopNavProps {
  onArchivesClick: () => void;
  onHomeClick: () => void;
  onLoginClick: () => void;
  currentPage?: 'home' | 'archives';
  isLoggedIn?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ onArchivesClick, onHomeClick, onLoginClick, currentPage = 'home', isLoggedIn = false }) => {
  return (
    <nav className="w-full flex justify-between items-center px-10 py-4 bg-black/40 border-b border-white/10 text-[#d4d4d4] uppercase tracking-widest text-sm z-40 relative">
      <div className="font-bold flex items-center gap-2">
        <span className="text-red-800">●</span>
        Epstein Secret Archive
      </div>
      <div className="flex gap-10 items-center">
        <button 
          onClick={onHomeClick} 
          className={`transition-colors ${currentPage === 'home' ? 'text-white' : 'hover:text-white'}`}
        >
          Home
        </button>
        <button 
          onClick={onArchivesClick} 
          className={`transition-colors ${currentPage === 'archives' ? 'text-white' : 'hover:text-white'}`}
        >
          Archives
        </button>
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <span className="text-white/50 text-xs">Welcome, Investigator</span>
            <button 
              onClick={onLoginClick}
              className="text-red-600 text-xs uppercase tracking-wider hover:text-red-500 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={onLoginClick}
            className="text-red-600 text-xs uppercase tracking-wider hover:text-red-500 transition-colors"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};
