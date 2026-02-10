
import React from 'react';

interface TopNavProps {
  onArchivesClick: () => void;
  onHomeClick: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onArchivesClick, onHomeClick }) => {
  return (
    <nav className="w-full flex justify-between items-center px-10 py-4 bg-black/40 border-b border-white/10 text-[#d4d4d4] uppercase tracking-widest text-sm z-40 relative">
      <div className="font-bold flex items-center gap-2">
        <span className="text-red-800">●</span>
        Mystery Mail Archive
      </div>
      <div className="flex gap-10">
        <button onClick={onHomeClick} className="hover:text-white transition-colors">Home</button>
        <button onClick={onArchivesClick} className="hover:text-white transition-colors">Archives</button>
        <button onClick={() => window.location.reload()} className="hover:text-red-500 transition-colors">Exit</button>
      </div>
    </nav>
  );
};
