import React, { useState } from 'react';
import { CaseFile } from '../types';

interface ArchivesPageProps {
  onSelectArchive: (file: CaseFile) => void;
  onBack: () => void;
  isLoggedIn: boolean;
}

export const ArchivesPage: React.FC<ArchivesPageProps> = ({ onSelectArchive, onBack, isLoggedIn }) => {
  const [selectedVolume, setSelectedVolume] = useState<CaseFile | null>(null);
  const [donateAmount, setDonateAmount] = useState('');
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [email, setEmail] = useState('');

  const archiveFiles: CaseFile[] = [
    {
      id: 'archive-1',
      title: 'Volume I: Flight Logs',
      sender: 'FBI Aviation Unit',
      recipient: 'Case Director',
      date: 'January 15, 2020',
      category: 'EVIDENCE',
      content: "Recovered flight manifests showing 2,618 flights to Little St. James between 1998-2019. Aircraft registration numbers N908JE and N212JE appear most frequently. Passenger lists remain partially redacted pending court order.",
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop&grayscale=true',
    },
    {
      id: 'archive-2',
      title: 'Volume II: The Black Book',
      sender: 'Evidence Custodian',
      recipient: 'Prosecution Team',
      date: 'February 03, 2020',
      category: 'EVIDENCE',
      content: "Contact directory recovered from Epstein's residence. Contains entries for prominent politicians, business leaders, and celebrities. Many entries include coded notations and frequency indicators.",
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop&grayscale=true',
    },
    {
      id: 'archive-3',
      title: 'Volume III: Temple Blueprints',
      sender: 'Forensic Architecture',
      recipient: 'Investigation Lead',
      date: 'February 20, 2020',
      category: 'EVIDENCE',
      content: "Blueprints reveal underground tunnel network connecting to blue-domed temple to multiple structures. Thermal imaging indicates active electrical systems beneath main building.",
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop&grayscale=true',
    },
    {
      id: 'archive-4',
      title: 'Volume IV: Witness Statements',
      sender: 'Interview Unit',
      recipient: 'Case File',
      date: 'March 08, 2020',
      category: 'STATEMENTS',
      content: "Consolidated testimony from 47 witnesses. Common themes include: recruitment under false pretenses, transportation to private locations, and subsequent intimidation. Several witnesses report observing high-profile individuals.",
      image: 'https://images.unsplash.com/photo-1555664424-778a69022365?q=80&w=800&auto=format&fit=crop&grayscale=true',
    },
    {
      id: 'archive-5',
      title: 'Volume V: Financial Records',
      sender: 'Forensic Accounting',
      recipient: 'Asset Recovery',
      date: 'March 22, 2020',
      category: 'EVIDENCE',
      content: "Analysis of shell companies and offshore accounts. Over $500 million in unexplained transfers identified. Key entities: Southern Trust, Zorro Ranch LLC, and multiple Virgin Islands corporations.",
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop&grayscale=true',
    },
    {
      id: 'archive-6',
      title: 'Volume VI: Security Protocols',
      sender: 'Security Analysis',
      recipient: 'Operations',
      date: 'April 05, 2020',
      category: 'EMAILS',
      content: "Internal memos detailing surveillance systems, guard rotations, and visitor screening procedures. Evidence of advanced counter-surveillance measures at all Epstein properties.",
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop&grayscale=true',
    },
    {
      id: 'archive-7',
      title: 'Volume VII: Island Staff',
      sender: 'Personnel Records',
      recipient: 'Human Resources',
      date: 'April 18, 2020',
      category: 'STATEMENTS',
      content: "Employee rosters for Little St. James and Great St. James. High turnover rate noted. Several former staff members report witnessing unusual activities and being bound by NDAs.",
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop&grayscale=true',
    },
    {
      id: 'archive-8',
      title: 'Volume VIII: Communications',
      sender: 'Digital Forensics',
      recipient: 'Technical Unit',
      date: 'May 01, 2020',
      category: 'EVIDENCE',
      content: "Recovered emails, text messages, and encrypted communications. Analysis reveals coordination between Epstein's network and various international contacts. Several messages contain coded language.",
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop&grayscale=true',
    },
    {
      id: 'archive-9',
      title: 'Volume IX: Medical Records',
      sender: 'Medical Examiner',
      recipient: 'Coroner',
      date: 'May 15, 2020',
      category: 'EVIDENCE',
      content: "Autopsy report and medical documentation. Cause of death: suicide by hanging. Note: Previous suicide attempt on July 23, 2019. Full toxicology report attached.",
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop&grayscale=true',
    },
    {
      id: 'archive-10',
      title: 'Volume X: Legal Proceedings',
      sender: 'Court Records',
      recipient: 'Legal Department',
      date: 'June 01, 2020',
      category: 'EMAILS',
      content: "2008 plea agreement details and subsequent litigation. Non-prosecution agreement signed by Alexander Acosta. Terms included 13-month sentence and immunity for co-conspirators.",
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop&grayscale=true',
    },
    {
      id: 'archive-11',
      title: 'Volume XI: International Connections',
      sender: 'Intelligence Liaison',
      recipient: 'Director',
      date: 'June 15, 2020',
      category: 'STATEMENTS',
      content: "Cross-border investigations reveal connections in France, UK, and Middle East. Multiple international properties identified. Cooperation with foreign agencies ongoing.",
      image: 'https://images.unsplash.com/photo-1526304640152-d4619684e484?q=80&w=800&auto=format&fit=crop&grayscale=true',
    },
    {
      id: 'archive-12',
      title: 'Volume XII: Unanswered Questions',
      sender: 'Case Review Board',
      recipient: 'Attorney General',
      date: 'July 01, 2020',
      category: 'EVIDENCE',
      content: "Summary of outstanding issues: Who were all the visitors? What happened to missing evidence? Why were surveillance cameras disabled during critical periods? Investigation remains open.",
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop&grayscale=true',
    }
  ];

  const handleDonate = () => {
    if (donateAmount) {
      alert(`Thank you for your donation of $${donateAmount}!`);
      setDonateAmount('');
      setShowDonateModal(false);
    }
  };

  const handleSubscribe = () => {
    if (email) {
      setIsSubscribed(true);
      setShowSubscribeModal(false);
      setEmail('');
    }
  };

  if (selectedVolume) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95">
        <div className="relative w-full max-w-4xl bg-[#eceae0] shadow-[0_0_150px_rgba(0,0,0,1)] p-8 md:p-12 border-8 border-[#222] max-h-[90vh] flex flex-col overflow-hidden">
          <button 
            onClick={() => setSelectedVolume(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-red-900 text-white font-bold hover:bg-red-700 transition-all z-30 shadow-xl flex items-center justify-center"
          >
            ✕
          </button>

          <div className="relative z-10 font-['Courier_Prime'] text-[#1a1a1a] flex-1 flex flex-col space-y-6 overflow-y-auto pr-2">
            <header className="border-b-4 border-black/10 pb-4">
              <div className="text-[10px] text-red-900 font-bold mb-2 tracking-[0.3em] uppercase underline">Classification: TOP SECRET</div>
              <h2 className="text-2xl font-bold uppercase">{selectedVolume.title}</h2>
              <div className="flex gap-6 mt-4 text-sm">
                <div><span className="font-bold opacity-40 uppercase text-xs">From:</span> {selectedVolume.sender}</div>
                <div><span className="font-bold opacity-40 uppercase text-xs">To:</span> {selectedVolume.recipient}</div>
                <div><span className="font-bold opacity-40 uppercase text-xs">Date:</span> {selectedVolume.date}</div>
              </div>
            </header>

            <div className="text-base leading-relaxed whitespace-pre-wrap font-medium">
              {selectedVolume.content}
            </div>

            {selectedVolume.image && (
              <div className="relative border-4 border-black/10 bg-black/5 p-2 shadow-inner">
                <img 
                  src={selectedVolume.image} 
                  className="w-full h-56 object-cover grayscale contrast-150 brightness-75"
                  alt="Evidence Photo" 
                />
              </div>
            )}

            <div className="pt-6 mt-auto flex gap-4">
              <button 
                onClick={() => setSelectedVolume(null)}
                className="px-6 py-3 bg-black text-white text-xs uppercase font-bold tracking-[0.2em] hover:bg-red-950 transition-all"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  onSelectArchive(selectedVolume);
                  setSelectedVolume(null);
                }}
                className="px-6 py-3 bg-red-900 text-white text-xs uppercase font-bold tracking-[0.2em] hover:bg-red-800 transition-all"
              >
                Add to Case Files
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0a0a0a] overflow-hidden">
      <div className="h-16 bg-black/40 border-b border-white/10 flex items-center px-8">
        <button 
          onClick={onBack}
          className="text-[#d4d4d4] uppercase tracking-widest text-sm hover:text-white transition-colors flex items-center gap-2"
        >
          ← Back to Main
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-['Special_Elite'] text-red-600 mb-4 tracking-wider">CLASSIFIED ARCHIVES</h1>
              <p className="text-white/40 text-sm uppercase tracking-[0.3em]">12 Volumes // FBI Investigation // Epstein Case</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archiveFiles.map((file, index) => (
                <div 
                  key={file.id}
                  onClick={() => setSelectedVolume(file)}
                  className="group cursor-pointer bg-[#2a2a2a] border border-white/10 p-6 hover:bg-[#3a3a3a] hover:border-red-900/50 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] text-red-600 font-bold uppercase tracking-widest">Volume {index + 1}</span>
                    <span className="text-[8px] text-white/20 font-mono">{file.category}</span>
                  </div>
                  <h3 className="font-['Special_Elite'] text-[#d4d4d4] text-lg uppercase leading-tight mb-3 group-hover:text-red-500 transition-colors">
                    {file.title.replace('Volume ' + ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][index] + ': ', '')}
                  </h3>
                  <p className="text-white/40 text-xs leading-relaxed line-clamp-3">
                    {file.content.substring(0, 120)}...
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[9px] text-white/20 font-mono">{file.date}</span>
                    <span className="text-red-600 text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                      View →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-80 bg-[#1a1a1a] border-l-4 border-red-900/30 p-6 flex flex-col">
          <div className="mb-8">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Support Investigation</h3>
            <p className="text-white/40 text-[10px] leading-relaxed mb-4">
              Help us continue uncovering truth. Your donation supports ongoing research and document preservation.
            </p>
            <button 
              onClick={() => setShowDonateModal(true)}
              className="w-full bg-red-900 text-white text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-red-800 transition-all py-3"
            >
              Donate Now
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Stay Updated</h3>
            <p className="text-white/40 text-[10px] leading-relaxed mb-4">
              Subscribe to receive notifications about new evidence releases and investigation updates.
            </p>
            {isSubscribed ? (
              <div className="bg-green-900/20 border border-green-900/30 p-3">
                <div className="text-green-400 text-[10px] font-bold uppercase tracking-wider mb-1">✓ Subscribed</div>
                <div className="text-white/50 text-[9px]">You'll receive updates via email</div>
              </div>
            ) : (
              <button 
                onClick={() => setShowSubscribeModal(true)}
                className="w-full bg-black/50 border border-white/10 text-white text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-white/10 transition-all py-3"
              >
                Subscribe to Updates
              </button>
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Investigator Status</h3>
            {isLoggedIn ? (
              <div className="space-y-3">
                <div className="bg-black/30 p-3 border border-white/10">
                  <div className="text-green-400 text-[10px] font-bold uppercase tracking-wider mb-1">Access Granted</div>
                  <div className="text-white/50 text-[9px]">Full archive access enabled</div>
                </div>
                <div className="bg-black/30 p-3 border border-white/10">
                  <div className="text-white/70 text-[10px] font-bold uppercase tracking-wider mb-1">Clearance Level</div>
                  <div className="text-red-400 text-[9px]">TOP SECRET</div>
                </div>
                <div className="bg-black/30 p-3 border border-white/10">
                  <div className="text-white/70 text-[10px] font-bold uppercase tracking-wider mb-1">Contributions</div>
                  <div className="text-white/50 text-[9px]">0 donations</div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-black/30 p-3 border border-white/10">
                  <div className="text-yellow-400 text-[10px] font-bold uppercase tracking-wider mb-1">Limited Access</div>
                  <div className="text-white/50 text-[9px]">Login for full access</div>
                </div>
                <div className="bg-black/30 p-3 border border-white/10">
                  <div className="text-white/70 text-[10px] font-bold uppercase tracking-wider mb-1">Clearance Level</div>
                  <div className="text-white/30 text-[9px]">RESTRICTED</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="h-6 bg-[#000] flex items-center px-4 justify-between text-[8px] uppercase tracking-[0.3em] text-white/30 border-t border-white/5 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-900"></span>
          FBI_TERMINAL::ARCHIVE_ACCESS_GRANTED
        </div>
        <div className="flex gap-6">
          <span>12 VOLUMES AVAILABLE</span>
          <span>SECURE CONNECTION</span>
        </div>
      </footer>

      {showDonateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#eceae0] shadow-[0_0_150px_rgba(0,0,0,1)] p-8 border-8 border-[#222]">
            <button 
              onClick={() => setShowDonateModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-red-900 text-white font-bold hover:bg-red-700 transition-all z-30 shadow-xl flex items-center justify-center text-sm"
            >
              ✕
            </button>

            <h2 className="text-2xl font-['Special_Elite'] text-[#1a1a1a] mb-6 uppercase tracking-wider">Support Investigation</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[#1a1a1a] text-xs font-bold uppercase tracking-wider mb-2">Donation Amount ($)</label>
                <input
                  type="number"
                  value={donateAmount}
                  onChange={(e) => setDonateAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  className="w-full bg-white border-2 border-black/10 p-3 text-sm focus:outline-none focus:border-red-900/50"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[10, 25, 50, 100, 250, 500].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDonateAmount(amount.toString())}
                    className="bg-black/5 border border-black/10 text-[#1a1a1a] text-xs font-bold hover:bg-red-900 hover:text-white hover:border-red-900 transition-all py-2"
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleDonate}
                disabled={!donateAmount}
                className="w-full bg-red-900 text-white text-xs uppercase font-bold tracking-[0.2em] hover:bg-red-800 transition-all disabled:opacity-30 py-3"
              >
                Donate Now
              </button>

              <div className="text-center">
                <button 
                  onClick={() => setShowDonateModal(false)}
                  className="text-[#1a1a1a]/50 text-[10px] uppercase tracking-wider hover:text-[#1a1a1a] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSubscribeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#eceae0] shadow-[0_0_150px_rgba(0,0,0,1)] p-8 border-8 border-[#222]">
            <button 
              onClick={() => setShowSubscribeModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-red-900 text-white font-bold hover:bg-red-700 transition-all z-30 shadow-xl flex items-center justify-center text-sm"
            >
              ✕
            </button>

            <h2 className="text-2xl font-['Special_Elite'] text-[#1a1a1a] mb-6 uppercase tracking-wider">Subscribe to Updates</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[#1a1a1a] text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white border-2 border-black/10 p-3 text-sm focus:outline-none focus:border-red-900/50"
                />
              </div>

              <div className="bg-black/5 p-3 border border-black/10">
                <div className="text-[#1a1a1a]/70 text-[10px] font-bold uppercase tracking-wider mb-2">You'll receive:</div>
                <ul className="text-[#1a1a1a]/50 text-[10px] space-y-1">
                  <li>• New evidence releases</li>
                  <li>• Investigation updates</li>
                  <li>• Declassified documents</li>
                  <li>• Community discoveries</li>
                </ul>
              </div>

              <button 
                onClick={handleSubscribe}
                disabled={!email}
                className="w-full bg-red-900 text-white text-xs uppercase font-bold tracking-[0.2em] hover:bg-red-800 transition-all disabled:opacity-30 py-3"
              >
                Subscribe
              </button>

              <div className="text-center">
                <button 
                  onClick={() => setShowSubscribeModal(false)}
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
