import React, { useState } from 'react';
import { TopNav } from './components/TopNav';
import { Cabinet } from './components/Cabinet';
import { Corkboard } from './components/Corkboard';
import { LetterPopup } from './components/LetterPopup';
import { ArchivesPage } from './components/ArchivesPage';
import { CaseFile, FileCategory } from './types';

const INITIAL_FILES: CaseFile[] = [
  {
    id: 'case-1',
    title: 'The Island Manifest',
    sender: 'Investigator Vance',
    recipient: 'Archivist Delta',
    date: 'August 10, 2019',
    category: 'EMAILS',
    content: "Flight logs recovered from Caribbean sector. Multiple unregistered landings at Little St. James between 2002-2019.\n\n[REDACTED] has ordered all passenger manifests sealed. Do not pursue this line of inquiry.",
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop&grayscale=true',
  },
  {
    id: 'case-2',
    title: 'Incident Report #742',
    sender: 'Officer Martinez',
    recipient: 'HQ - Internal Affairs',
    date: 'July 06, 2019',
    category: 'STATEMENTS',
    content: "Statement taken from witness Sarah K.\nWitness claims she was flown to a private island for what was described as 'modeling work.' Upon arrival, she was escorted to a blue-domed structure. She has not been seen since.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop&grayscale=true',
  },
  {
    id: 'case-3',
    title: 'Evidence: Temple Structure',
    sender: 'Forensics',
    recipient: 'Case Manager',
    date: 'August 15, 2019',
    category: 'EVIDENCE',
    content: "Satellite imagery analysis of Little St. James reveals a distinctive blue-domed structure with underground tunnels. Thermal imaging shows multiple heat signatures beneath surface.",
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop&grayscale=true',
    reconstructionPrompt: "Aerial view of a private island in Caribbean showing a blue-domed temple structure with underground tunnels and hidden entrances."
  }
];

const App: React.FC = () => {
  const [files, setFiles] = useState<CaseFile[]>(INITIAL_FILES);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<FileCategory>('EMAILS');
  const [currentPage, setCurrentPage] = useState<'home' | 'archives'>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleArchivesClick = () => {
    setCurrentPage('archives');
  };

  const handleHomeClick = () => {
    setCurrentPage('home');
    setSelectedCaseId(null);
  };

  const handleLoginClick = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogin = () => {
    if (username && password) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setUsername('');
      setPassword('');
    }
  };

  const handleAddArchive = (file: CaseFile) => {
    setFiles(prev => [file, ...prev]);
    setActiveCategory(file.category);
    setSelectedCaseId(file.id);
    setCurrentPage('home');
  };

  const selectedFile = files.find(f => f.id === selectedCaseId);

  if (currentPage === 'archives') {
    return (
      <ArchivesPage 
        onSelectArchive={handleAddArchive}
        onBack={handleHomeClick}
        isLoggedIn={isLoggedIn}
      />
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0a0a0a] selection:bg-red-900/40 overflow-hidden">
      <TopNav 
        onArchivesClick={handleArchivesClick}
        onHomeClick={handleHomeClick}
        onLoginClick={handleLoginClick}
        currentPage={currentPage}
        isLoggedIn={isLoggedIn}
      />

      <main className="flex-1 flex overflow-hidden">
        <Cabinet 
          files={files} 
          onSelectFile={(id) => setSelectedCaseId(id)}
          selectedId={selectedCaseId}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <Corkboard />
      </main>

      {/* Retro Status UI */}
      <div className="absolute bottom-10 right-10 pointer-events-none flex flex-col items-end opacity-40 font-mono text-red-600 text-[10px] space-y-1">
        <div className="bg-black/80 px-2 py-1 border border-red-900/20">LATENCY: 42ms</div>
        <div className="bg-black/80 px-2 py-1 border border-red-900/20">SIGNAL: SECURE</div>
        <div className="bg-black/80 px-2 py-1 border border-red-900/20">ENCRYPTION: AES-FBI</div>
      </div>

      {selectedFile && (
        <LetterPopup 
          caseFile={selectedFile} 
          onClose={() => setSelectedCaseId(null)} 
        />
      )}

      <footer className="h-6 bg-[#000] flex items-center px-4 justify-between text-[8px] uppercase tracking-[0.3em] text-white/30 border-t border-white/5 font-mono z-40">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-900"></span>
          FBI_TERMINAL::SECURE_CONNECTION_ESTABLISHED
        </div>
        <div className="flex gap-6">
          <span>{files.length} FILES LOADED</span>
          <span>SYSTEM_TIME: {new Date().toLocaleTimeString()}</span>
        </div>
      </footer>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#eceae0] shadow-[0_0_150px_rgba(0,0,0,1)] p-8 border-8 border-[#222]">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-red-900 text-white font-bold hover:bg-red-700 transition-all z-30 shadow-xl flex items-center justify-center text-sm"
            >
              ✕
            </button>

            <h2 className="text-2xl font-['Special_Elite'] text-[#1a1a1a] mb-6 uppercase tracking-wider">Investigator Login</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[#1a1a1a] text-xs font-bold uppercase tracking-wider mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full bg-white border-2 border-black/10 p-3 text-sm focus:outline-none focus:border-red-900/50"
                />
              </div>

              <div>
                <label className="block text-[#1a1a1a] text-xs font-bold uppercase tracking-wider mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-white border-2 border-black/10 p-3 text-sm focus:outline-none focus:border-red-900/50"
                />
              </div>

              <button 
                onClick={handleLogin}
                disabled={!username || !password}
                className="w-full bg-red-900 text-white text-xs uppercase font-bold tracking-[0.2em] hover:bg-red-800 transition-all disabled:opacity-30 py-3"
              >
                Login
              </button>

              <div className="text-center">
                <button 
                  onClick={() => setShowLoginModal(false)}
                  className="text-[#1a1a1a]/50 text-[10px] uppercase tracking-wider hover:text-[#1a1a1a] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
