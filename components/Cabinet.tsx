
import React from 'react';
import { CaseFile, FileCategory } from '../types';

interface CabinetProps {
  files: CaseFile[];
  onSelectFile: (id: string) => void;
  selectedId: string | null;
  activeCategory: FileCategory;
  onCategoryChange: (cat: FileCategory) => void;
}

export const Cabinet: React.FC<CabinetProps> = ({ 
  files, 
  onSelectFile, 
  selectedId, 
  activeCategory, 
  onCategoryChange 
}) => {
  const categories: { id: FileCategory; label: string; icon: string }[] = [
    { id: 'EMAILS', label: 'E-Mails', icon: '✉' },
    { id: 'STATEMENTS', label: 'Statements', icon: '✍' },
    { id: 'EVIDENCE', label: 'Evidence', icon: '📷' },
  ];

  const filteredFiles = files.filter(f => f.category === activeCategory);

  return (
    <div className="w-80 h-full bg-[#2a2a2a] border-r border-black/50 flex flex-col vintage-shadow relative overflow-hidden">
      {/* Category Tabs */}
      <div className="flex bg-black/40 border-b border-white/5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex-1 py-3 text-[10px] uppercase tracking-widest font-bold transition-all ${
              activeCategory === cat.id 
              ? 'bg-[#3a3a3a] text-red-600 border-b-2 border-red-900' 
              : 'text-white/40 hover:text-white/70'
            }`}
          >
            <div className="text-sm mb-1">{cat.icon}</div>
            {cat.label}
          </button>
        ))}
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-4 relative z-10 custom-scrollbar">
        <h3 className="text-[10px] text-white/20 mb-4 uppercase tracking-[0.3em]">
          Directory: {activeCategory}
        </h3>
        
        {filteredFiles.length === 0 && (
          <div className="text-[10px] text-white/10 italic text-center py-10">
            Empty Archive Segment
          </div>
        )}

        {filteredFiles.map((file, idx) => (
          <div 
            key={file.id}
            onClick={() => onSelectFile(file.id)}
            className={`group cursor-pointer p-4 bg-[#333] border border-white/5 shadow-xl transform transition-all hover:bg-[#3d3d3d] ${
              selectedId === file.id ? 'translate-x-2 border-red-900 bg-[#3d3d3d]' : ''
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] text-white/20 font-mono tracking-tighter">SEC_ID: {file.id.split('-')[1]}</span>
              {selectedId === file.id && <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>}
            </div>
            <div className="font-['Special_Elite'] text-[#d4d4d4] text-xs uppercase leading-tight">
              {file.title}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20 text-[9px] text-white/20 font-mono">
        SYSTEM: FBI_EPI-INV_V2.1<br/>
        STATUS: ACCESS_GRANTED
      </div>
    </div>
  );
};
