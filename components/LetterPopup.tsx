import React, { useState, useEffect, useRef } from 'react';
import { CaseFile } from '../types';

interface LetterPopupProps {
  caseFile: CaseFile;
  onClose: () => void;
}

interface Comment {
  id: string;
  text: string;
  reason: string;
  author: string;
  timestamp: string;
  likes: number;
  replies: Reply[];
}

interface Reply {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

interface RedactionData {
  word: string;
  blocks: number;
  comments: Comment[];
  showComments: boolean;
}

export const LetterPopup: React.FC<LetterPopupProps> = ({ caseFile, onClose }) => {
  const [decrypted, setDecrypted] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [reconstructionUrl, setReconstructionUrl] = useState<string | null>(null);
  const [isReconstructing, setIsReconstructing] = useState(false);
  const [reconstructionProgress, setReconstructionProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [showRedacted, setShowRedacted] = useState(true);
  const [redactionData, setRedactionData] = useState<Map<string, RedactionData>>(new Map());
  const [selectedRedaction, setSelectedRedaction] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [newCommentReason, setNewCommentReason] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [newReply, setNewReply] = useState('');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const redactedWords = [
    { word: 'Epstein', blocks: 8 },
    { word: 'Little St. James', blocks: 16 },
    { word: 'blue-domed', blocks: 10 },
    { word: 'black book', blocks: 10 },
    { word: 'temple', blocks: 6 },
    { word: 'tunnels', blocks: 7 },
    { word: 'passenger manifests', blocks: 18 },
    { word: 'NDAs', blocks: 4 },
    { word: 'surveillance', blocks: 12 }
  ];

  useEffect(() => {
    const initialData = new Map<string, RedactionData>();
    redactedWords.forEach(({ word, blocks }) => {
      initialData.set(word.toLowerCase(), {
        word,
        blocks,
        comments: [],
        showComments: false
      });
    });
    setRedactionData(initialData);
  }, []);

  const formatContent = (content: string, showRedacted: boolean) => {
    if (!showRedacted) return content;
    
    let formatted = content;
    let counter = 0;
    
    redactedWords.forEach(({ word }) => {
      const regex = new RegExp(`(${word})`, 'gi');
      formatted = formatted.replace(regex, (match) => {
        const id = `redaction-${counter++}`;
        const data = redactionData.get(word.toLowerCase());
        const topComment = data?.comments.sort((a, b) => b.likes - a.likes)[0];
        const blocks = data?.blocks || 8;
        
        if (topComment && topComment.likes > 0) {
          return `<span class="redacted-text revealed" data-word="${word.toLowerCase()}" data-id="${id}">${topComment.text}</span>`;
        }
        const blocksText = '■'.repeat(blocks);
        return `<span class="redacted-text" data-word="${word.toLowerCase()}" data-id="${id}">${blocksText}</span>`;
      });
    });
    return formatted;
  };

  const handleRedactionClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('redacted-text')) {
      const word = target.dataset.word;
      if (word) {
        setSelectedRedaction(word);
        setNewComment('');
        setNewCommentReason('');
        setSelectedCommentId(null);
        setNewReply('');
        setExpandedComments(new Set());
      }
    }
  };

  const handleAddComment = () => {
    if (!selectedRedaction || !newComment.trim()) return;

    const data = redactionData.get(selectedRedaction);
    if (!data) return;

    const newCommentData: Comment = {
      id: `comment-${Date.now()}`,
      text: newComment.trim(),
      reason: newCommentReason.trim(),
      author: 'Anonymous',
      timestamp: new Date().toLocaleTimeString(),
      likes: 0,
      replies: []
    };

    const updatedData = {
      ...data,
      comments: [newCommentData, ...data.comments]
    };

    setRedactionData(prev => new Map(prev).set(selectedRedaction, updatedData));
    setNewComment('');
    setNewCommentReason('');
  };

  const handleAddReply = () => {
    if (!selectedRedaction || !selectedCommentId || !newReply.trim()) return;

    const data = redactionData.get(selectedRedaction);
    if (!data) return;

    const newReplyData: Reply = {
      id: `reply-${Date.now()}`,
      text: newReply.trim(),
      author: 'Anonymous',
      timestamp: new Date().toLocaleTimeString()
    };

    const updatedComments = data.comments.map(comment => 
      comment.id === selectedCommentId 
        ? { ...comment, replies: [...comment.replies, newReplyData] }
        : comment
    );

    const updatedData = { ...data, comments: updatedComments };
    setRedactionData(prev => new Map(prev).set(selectedRedaction, updatedData));
    setNewReply('');
    setSelectedCommentId(null);
  };

  const toggleCommentExpansion = (commentId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleLikeComment = (word: string, commentId: string) => {
    const data = redactionData.get(word);
    if (!data) return;

    const updatedComments = data.comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    );

    const updatedData = { ...data, comments: updatedComments };
    setRedactionData(prev => new Map(prev).set(word, updatedData));
  };

  const handleDecrypt = async () => {
    setIsDecrypting(true);
    setTimeout(() => {
      setDecrypted('FULLY DECRYPTED: All redacted information has been revealed.');
      setIsDecrypting(false);
    }, 2000);
  };

  const handleToggleRedacted = () => {
    setShowRedacted(!showRedacted);
  };

  const handleReconstruct = async () => {
    setIsReconstructing(true);
    setReconstructionProgress(10);
    try {
      const interval = setInterval(() => {
        setReconstructionProgress(p => p < 90 ? p + Math.random() * 5 : p);
      }, 5000);
      
      const prompt = caseFile.reconstructionPrompt || caseFile.content;
      clearInterval(interval);
    } catch (e) {
      console.error(e);
      alert("Reconstruction failed. Ensure billing is enabled.");
    } finally {
      setIsReconstructing(false);
    }
  };

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (!window.speechSynthesis) {
      alert('Text-to-speech is not supported in your browser');
      return;
    }

    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    const textToRead = decrypted || caseFile.content;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    utterance.pitch = 0.8;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const selectedData = selectedRedaction ? redactionData.get(selectedRedaction) : null;
  const topComment = selectedData?.comments.sort((a, b) => b.likes - a.likes)[0];

  return (
    <>
      <style>{`
        .redacted-text {
          background-color: #000;
          color: #000;
          padding: 0 2px;
          border-radius: 2px;
          user-select: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .redacted-text:hover {
          background-color: #333;
        }
        .redacted-text.revealed {
          background-color: #dc2626;
          color: #fff;
          text-decoration: underline;
        }
        .redacted-text.revealed:hover {
          background-color: #b91c1c;
        }
      `}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#eceae0] shadow-[0_0_150px_rgba(0,0,0,1)] p-6 md:p-10 border-8 border-[#222] max-h-[90vh] flex flex-col">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-900 via-transparent to-red-900 opacity-30"></div>
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-red-900 text-white font-bold hover:bg-red-700 transition-all z-30 shadow-xl flex items-center justify-center text-lg"
        >
          ✕
        </button>

        <div className="relative z-10 font-['Courier_Prime'] text-[#1a1a1a] flex-1 flex gap-6 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              <header className="border-b-4 border-black/10 pb-4 flex justify-between items-start">
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

              <div 
                className="text-base leading-relaxed whitespace-pre-wrap font-medium"
                dangerouslySetInnerHTML={{ __html: formatContent(caseFile.content, showRedacted) }}
                onClick={handleRedactionClick}
              />

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
                        className="w-full h-56 object-cover grayscale contrast-150 brightness-75"
                        alt="Evidence Photo" 
                      />
                      <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                    </div>
                  ) : null}
                </div>
              )}

              {decrypted && (
                <div className="p-4 bg-red-900 text-white shadow-2xl animate-in fade-in slide-in-from-top-2 duration-700">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2 border-b border-white/20 pb-1">Decrypted Metadata:</h4>
                  <p className="text-sm italic leading-relaxed">"{decrypted}"</p>
                </div>
              )}
            </div>

            <div className="pt-6 flex flex-wrap gap-4 items-center justify-between border-t-2 border-black/5 shrink-0">
              <div className="text-[9px] font-mono opacity-30">
                ORIGIN: FBI_INVESTIGATION // SIG: {caseFile.sender.toUpperCase()}
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={handleToggleRedacted}
                  className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-[#333] transition-all flex items-center gap-2"
                >
                  {showRedacted ? 'Hide Redactions' : 'Show Redactions'}
                </button>
                
                <button 
                  onClick={isSpeaking ? (isPaused ? handleSpeak : handleStopSpeaking) : handleSpeak}
                  className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-[#333] transition-all flex items-center gap-2"
                >
                  {isSpeaking ? (isPaused ? '▶ Resume' : '■ Stop') : '▶ Read Aloud'}
                </button>
                
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

          <div className="w-80 bg-[#1a1a1a] border-l-4 border-red-900/30 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-xs font-bold uppercase tracking-wider">Redaction Analysis</h3>
              {selectedRedaction && (
                <button 
                  onClick={() => setSelectedRedaction(null)}
                  className="text-white/50 text-[10px] hover:text-white transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            
            {selectedRedaction && selectedData ? (
              <>
                {topComment && topComment.likes > 0 && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-900/30">
                    <div className="text-white/50 text-[10px] uppercase tracking-wider mb-1">Top Guess:</div>
                    <div className="text-yellow-400 font-bold text-sm">"{topComment.text}"</div>
                    <div className="text-white/50 text-[9px] mt-1">{topComment.likes} likes</div>
                  </div>
                )}

                <div className="mb-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Enter your guess..."
                    className="w-full bg-black/50 border border-white/10 text-white text-xs p-2 resize-none h-12 placeholder-white/30 focus:outline-none focus:border-red-900/50 mb-2"
                  />
                  <textarea
                    value={newCommentReason}
                    onChange={(e) => setNewCommentReason(e.target.value)}
                    placeholder="Why do you think this? (optional)"
                    className="w-full bg-black/50 border border-white/10 text-white text-xs p-2 resize-none h-12 placeholder-white/30 focus:outline-none focus:border-red-900/50"
                  />
                  <button 
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="mt-2 w-full bg-red-900 text-white text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-red-800 transition-all disabled:opacity-30 py-2"
                  >
                    Submit Guess
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2">
                  <div className="text-white/30 text-[9px] uppercase tracking-wider mb-2">Community Guesses:</div>
                  {selectedData.comments.length === 0 ? (
                    <div className="text-white/20 text-[10px] italic">No guesses yet...</div>
                  ) : (
                    selectedData.comments
                      .sort((a, b) => b.likes - a.likes)
                      .map((comment) => (
                        <div key={comment.id} className="bg-black/30 p-2 border border-white/5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className="text-white text-xs font-medium">{comment.text}</div>
                                {(comment.reason || comment.replies.length > 0) && (
                                  <button 
                                    onClick={() => toggleCommentExpansion(comment.id)}
                                    className="text-white/40 text-[9px] hover:text-white transition-colors"
                                  >
                                    {expandedComments.has(comment.id) ? '▼' : '▶'}
                                  </button>
                                )}
                              </div>
                              {expandedComments.has(comment.id) && comment.reason && (
                                <div className="text-white/50 text-[10px] mt-1 italic">"{comment.reason}"</div>
                              )}
                              <div className="text-white/30 text-[9px] mt-1">
                                {comment.author} • {comment.timestamp}
                              </div>
                              {expandedComments.has(comment.id) && comment.replies.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {comment.replies.map((reply) => (
                                    <div key={reply.id} className="bg-black/20 p-1.5 border-l-2 border-red-900/50">
                                      <div className="text-white/70 text-[10px]">{reply.text}</div>
                                      <div className="text-white/30 text-[8px] mt-0.5">
                                        {reply.author} • {reply.timestamp}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {expandedComments.has(comment.id) && selectedCommentId === comment.id && (
                                <div className="mt-2">
                                  <textarea
                                    value={newReply}
                                    onChange={(e) => setNewReply(e.target.value)}
                                    placeholder="Reply to this guess..."
                                    className="w-full bg-black/50 border border-white/10 text-white text-[10px] p-1.5 resize-none h-10 placeholder-white/30 focus:outline-none focus:border-red-900/50"
                                  />
                                  <div className="flex gap-2 mt-1">
                                    <button 
                                      onClick={handleAddReply}
                                      disabled={!newReply.trim()}
                                      className="flex-1 bg-red-900/80 text-white text-[9px] uppercase font-bold tracking-[0.1em] hover:bg-red-800 transition-all disabled:opacity-30 py-1"
                                    >
                                      Reply
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setSelectedCommentId(null);
                                        setNewReply('');
                                      }}
                                      className="px-2 bg-white/10 text-white text-[9px] hover:bg-white/20 transition-all py-1"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                              {expandedComments.has(comment.id) && selectedCommentId !== comment.id && (
                                <button 
                                  onClick={() => setSelectedCommentId(comment.id)}
                                  className="mt-2 text-white/40 text-[9px] hover:text-white transition-colors"
                                >
                                  💬 Reply
                                </button>
                              )}
                            </div>
                            <button 
                              onClick={() => handleLikeComment(selectedRedaction, comment.id)}
                              className="flex flex-col items-center gap-1 text-white/50 hover:text-red-400 transition-colors shrink-0"
                            >
                              <span className="text-sm">👍</span>
                              <span className="text-[10px]">{comment.likes}</span>
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </>
            ) : (
              <div className="text-white/30 text-[10px] italic text-center mt-8">
                Click on any redacted text to view and submit guesses
              </div>
            )}
          </div>
        </div>

        <div className="absolute top-1/4 -right-10 opacity-5 pointer-events-none rotate-12 scale-150">
          <svg width="300" height="300" viewBox="0 0 200 200">
            <path d="M10,10 Q50,100 10,190" stroke="black" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>
      </div>
    </>
  );
};
