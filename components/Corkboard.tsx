
import React, { useState } from 'react';

export const Corkboard: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="flex-1 h-full bg-[#1a130f] p-8 relative overflow-hidden flex items-center justify-center">
      {/* Cork Texture */}
      <div className="absolute inset-4 bg-[#4a3a2a] rounded shadow-2xl overflow-hidden border-8 border-[#2a1a0a]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cork-board.png')] opacity-60"></div>
        
        {/* Evidence items */}
        <div 
          className="absolute top-10 right-10 rotate-3 transform p-1 bg-white shadow-xl hover:rotate-0 transition-transform cursor-pointer"
          onClick={() => setSelectedImage('https://picsum.photos/seed/mystery1/800/1000?grayscale')}
        >
          <img src="https://picsum.photos/seed/mystery1/150/200?grayscale" alt="Evidence" className="grayscale contrast-125" />
          <p className="text-[10px] mt-1 text-black font-bold text-center">EXHIBIT A</p>
        </div>

        <div 
          className="absolute top-40 left-10 -rotate-6 transform p-1 bg-white shadow-xl hover:rotate-0 transition-transform cursor-pointer"
          onClick={() => setSelectedImage('https://picsum.photos/seed/mystery2/800/800?grayscale')}
        >
          <img src="https://picsum.photos/seed/mystery2/120/120?grayscale" alt="Evidence" className="grayscale brightness-50 contrast-150" />
          <p className="text-[10px] mt-1 text-black font-bold text-center">SIGHTING</p>
        </div>

        <div className="absolute bottom-20 right-20 rotate-12 bg-white/90 p-4 shadow-2xl max-w-[120px] text-[8px] text-black">
          <div className="bg-red-800 text-white p-1 mb-2 text-center text-[10px]">REDACTED</div>
          Subject 492 was last seen heading towards the <span className="bg-black text-black">DARKNESS</span> near the lake. No further reports.
        </div>

        {/* The Crow */}
        <div className="absolute top-0 right-1/4 scale-x-[-1] opacity-90 drop-shadow-2xl">
          <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M150 100C150 100 130 90 110 95C90 100 70 120 40 115C10 110 5 80 5 80C5 80 30 70 50 75C70 80 90 60 110 55C130 50 150 60 170 80C190 100 200 120 200 120L150 100Z" fill="black"/>
            <circle cx="160" cy="75" r="3" fill="#333" />
          </svg>
        </div>

        {/* The Key */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-80 cursor-pointer hover:scale-110 transition-transform">
          <svg width="40" height="80" viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0C11.7157 0 5 6.71573 5 15C5 23.2843 11.7157 30 20 30C28.2843 30 35 23.2843 35 15C35 6.71573 28.2843 0 20 0ZM20 10C22.7614 10 25 12.2386 25 15C25 17.7614 22.7614 20 20 20C17.2386 20 15 17.7614 15 15C15 12.2386 17.2386 10 20 10Z" fill="#8a7a6a"/>
            <rect x="18" y="30" width="4" height="50" fill="#8a7a6a"/>
            <rect x="22" y="60" width="8" height="4" fill="#8a7a6a"/>
            <rect x="22" y="70" width="8" height="4" fill="#8a7a6a"/>
          </svg>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img 
              src={selectedImage} 
              alt="Evidence Full Size" 
              className="max-w-full max-h-[85vh] object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-red-900 text-white font-bold hover:bg-red-700 transition-all shadow-xl flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
