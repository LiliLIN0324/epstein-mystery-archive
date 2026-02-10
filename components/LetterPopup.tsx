
import React, { useState } from 'react';
import { CaseFile } from '../types';
import { decryptRedacted, reconstructScene } from '../services/gemini';

interface LetterPopupProps {
  caseFile: CaseFile;
  onClose: () => void;
}

export const LetterPopup: React.FC<LetterPopupProps> = ({ caseFile, onClose }) => {
  const [decrypted, setDecrypted] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [reconstructionUrl, setReconstructionUrl] = useState<string | null>(null);
  const [isReconstructing, setIsReconstructing] = useState(false);
  const [reconstructionProgress, setReconstructionProgress] = useState(0);

  const handleDecrypt = async () => {
    setIsDecrypting(true);
    const result = await decryptRedacted(caseFile.content);
    setDecrypted(result);
    setIsDecrypting(false);
  };

  const handleReconstruct = async () => {
    setIsReconstructing(true);
    setReconstructionProgress(10);
    try {
      // Simulate progress since Veo takes time
      const interval = setInterval(() => {
        setReconstructionProgress(p => p < 90 ? p + Math.random() * 5 : p);
      }, 5000);
      
      const prompt = caseFile.reconstructionPrompt || caseFile.content;
      const url = await reconstructScene(prompt);
      
      clearInterval(interval);
      setReconstructionUrl(url);
    } catch (e) {
      console.error(e);
      alert("Reconstruction failed. Ensure billing is enabled.");
    } finally {
      setIsReconstructing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#eceae0] shadow-[0_0_150px_rgba(0,0,0,1)] p-10 md:p-16 border-8 border-[#222] min-h-[80vh] flex flex-col">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-900 via-transparent to-red-900 opacity-30"></div>
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 bg-red-900 text-white font-bold hover:bg-red-700 transition-all z-30 shadow-xl flex items-center justify-center text-xl"
        >
          ✕
        </button>

        <div className="relative z-10 font-['Courier_Prime'] text-[#1a1a1a] flex-1 flex flex-col space-y-8">
          <header className="border-b-4 border-black/10 pb-6 flex justify-between items-start">
            <div className="space-y-1">
              <div className="text-[10px] text-red-900 font-bold mb-2 tracking-[0.3em] uppercase underline">Classification: TOP SECRET</div>
              <div className="flex gap-3"><span className="font-bold opacity-40 uppercase text-xs w-20">To/Ref:</span> <span className="text-sm">{caseFile.recipient}</span></div>
              <div className="flex gap-3"><span className="font-bold opacity-40 uppercase text-xs w-20">Subject:</span> <span className="text-sm font-bold uppercase">{caseFile.subject}</span></div>
            </div>
            <div className="text-right">
              <div className="text-lg font-['Special_Elite'] opacity-70">{caseFile.date}</div>
              <div className="text-[10px] font-mono opacity-30">ARCH-SEGMENT: {caseFile.category}</div>
            </div>
          </header>

          <div className="text-lg leading-relaxed whitespace-pre-wrap font-medium">
            {caseFile.content}
          </div>

          {(caseFile.image || reconstructionUrl) && (
            <div className="relative border-4 border-black/10 bg-black/5 p-2 shadow-inner">
              {reconstructionUrl ? (
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                   <video 
                    src={reconstructionUrl} 
                    controls 
                    autoPlay 
                    className="w-full h-full object-contain brightness-90 contrast-125 grayscale"
                   />
                   <div className="absolute top-4 left-4 text-red-600 text-[10px] font-mono bg-black/60 px-2 py-1 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                     LIVE RECONSTRUCTION_FEED
                   </div>
                </div>
              ) : caseFile.image ? (
                <div className="relative">
                  <img 
                    src={caseFile.image} 
                    className="w-full h-72 object-cover grayscale contrast-150 brightness-75"
                    alt="Evidence Photo" 
                  />
                  <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                </div>
              ) : null}
            </div>
          )}

          {decrypted && (
            <div className="p-6 bg-red-900 text-white shadow-2xl animate-in fade-in slide-in-from-top-2 duration-700">
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2 border-b border-white/20 pb-1">Decrypted Metadata:</h4>
              <p className="text-sm italic leading-relaxed">"{decrypted}"</p>
            </div>
          )}

          <div className="pt-10 mt-auto flex flex-wrap gap-4 items-center justify-between border-t-2 border-black/5">
            <div className="text-[9px] font-mono opacity-30">
              ORIGIN: DEPT7-ARCHIVE // SIG: {caseFile.sender.toUpperCase()}
            </div>
            <div className="flex gap-4">
              {!decrypted && (
                <button 
                  onClick={handleDecrypt}
                  disabled={isDecrypting}
                  className="px-5 py-2.5 bg-black text-white text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-red-950 transition-all disabled:opacity-30"
                >
                  {isDecrypting ? 'Decrypting...' : 'Decrypt Redactions'}
                </button>
              )}
              
              {caseFile.category === 'EVIDENCE' && !reconstructionUrl && (
                <button 
                  onClick={handleReconstruct}
                  disabled={isReconstructing}
                  className="px-5 py-2.5 bg-red-900 text-white text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-red-800 transition-all disabled:opacity-30 relative overflow-hidden"
                >
                  {isReconstructing ? (
                    <span className="relative z-10">Reconstructing {Math.round(reconstructionProgress)}%</span>
                  ) : 'Reconstruct Scene'}
                  {isReconstructing && (
                    <div 
                      className="absolute bottom-0 left-0 h-1 bg-white opacity-50 transition-all duration-1000" 
                      style={{ width: `${reconstructionProgress}%` }}
                    />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Visual Grittiness */}
        <div className="absolute top-1/4 -right-10 opacity-5 pointer-events-none rotate-12 scale-150">
          <svg width="300" height="300" viewBox="0 0 200 200">
            <path d="M10,10 Q50,100 10,190" stroke="black" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  );
};
