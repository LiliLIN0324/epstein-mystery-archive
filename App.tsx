
import React, { useState } from 'react';
import { TopNav } from './components/TopNav';
import { Cabinet } from './components/Cabinet';
import { Corkboard } from './components/Corkboard';
import { LetterPopup } from './components/LetterPopup';
import { CaseFile, FileCategory } from './types';
import { generateMysteryContent } from './services/gemini';

const INITIAL_FILES: CaseFile[] = [
  {
    id: 'case-1',
    title: 'The Silent Lake Sighting',
    sender: 'Detective Vance',
    recipient: 'Archivist Delta',
    date: 'April 22, 1979',
    category: 'EMAILS',
    content: "Reports coming in from the north ridge. Something was pulled from the silt. It wasn't organic, but it was breathing.\n\n[REDACTED] has ordered a total perimeter blackout. Do not engage.",
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop&grayscale=true',
  },
  {
    id: 'case-2',
    title: 'Incident Report #402',
    sender: 'Officer Miller',
    recipient: 'HQ - Internal Affairs',
    date: 'Nov 12, 1978',
    category: 'STATEMENTS',
    content: "Statement taken from witness Paul S.\nWitness claims he heard 'metal screaming' beneath the floorboards. When we arrived, the temperature in the room was exactly 0°C. Paul has been missing since the interview.",
    image: 'https://images.unsplash.com/photo-1449156001935-52614a37d6b5?q=80&w=800&auto=format&fit=crop&grayscale=true',
  },
  {
    id: 'case-3',
    title: 'Evidence: Basement 4B',
    sender: 'Forensics',
    recipient: 'Case Manager',
    date: 'Oct 05, 1979',
    category: 'EVIDENCE',
    content: "Found at the center of the exclusion zone. It appears to be a biological key, or perhaps a localized beacon.",
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop&grayscale=true',
    reconstructionPrompt: "A dark, damp basement with flickering lights and a pulsing biological object on a wooden table. Shadows moving in the background."
  }
];

const App: React.FC = () => {
  const [files, setFiles] = useState<CaseFile[]>(INITIAL_FILES);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<FileCategory>('EMAILS');
  const [isLoading, setIsLoading] = useState(false);

  const handleArchivesClick = async () => {
    setIsLoading(true);
    const topics = ["Forbidden Frequency", "The Shadow in the Hall", "Project Mercury Leak", "The Clock that Ran Backwards"];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    
    // Randomly assign a category for the new mystery
    const cats: FileCategory[] = ['EMAILS', 'STATEMENTS', 'EVIDENCE'];
    const newCat = cats[Math.floor(Math.random() * cats.length)];

    const content = await generateMysteryContent(topic, newCat);
    if (content) {
      const newFile: CaseFile = {
        id: `case-${Date.now()}`,
        title: content.subject,
        sender: 'DEPT-7 SECURE',
        recipient: content.to,
        date: content.date,
        content: content.message,
        category: newCat,
        reconstructionPrompt: content.reconstructionPrompt,
        image: `https://picsum.photos/seed/${Math.random()}/800/400?grayscale`
      };
      setFiles(prev => [newFile, ...prev]);
      setActiveCategory(newCat);
      setSelectedCaseId(newFile.id);
    }
    setIsLoading(false);
  };

  const selectedFile = files.find(f => f.id === selectedCaseId);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0a0a0a] selection:bg-red-900/40 overflow-hidden">
      <TopNav 
        onArchivesClick={handleArchivesClick}
        onHomeClick={() => setSelectedCaseId(null)}
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
        <div className="bg-black/80 px-2 py-1 border border-red-900/20">SIGNAL: WEAK</div>
        <div className="bg-black/80 px-2 py-1 border border-red-900/20">ENCRYPTION: AES-DEP7</div>
      </div>

      {selectedFile && (
        <LetterPopup 
          caseFile={selectedFile} 
          onClose={() => setSelectedCaseId(null)} 
        />
      )}

      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 text-red-900 font-['Special_Elite']">
          <div className="mb-8">
            <svg className="animate-spin h-12 w-12 text-red-900" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div className="text-2xl animate-pulse tracking-[0.5em] mb-2">ACCESSING ARCHIVE SEGMENT</div>
          <div className="text-[10px] tracking-[0.4em] opacity-40 uppercase">Authorized Personnel Only // Biometrics Verified</div>
        </div>
      )}

      <footer className="h-6 bg-[#000] flex items-center px-4 justify-between text-[8px] uppercase tracking-[0.3em] text-white/30 border-t border-white/5 font-mono z-40">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-900"></span>
          LOCAL_TERMINAL::SECURE_CONNECTION_ESTABLISHED
        </div>
        <div className="flex gap-6">
          <span>{files.length} FILES LOADED</span>
          <span>SYSTEM_TIME: {new Date().toLocaleTimeString()}</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
