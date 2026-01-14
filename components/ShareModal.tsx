
import React, { useEffect, useRef } from 'react';
import { ChatSession } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: ChatSession | undefined;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, session }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen || !session) return null;

  // Get first two messages for the preview snippet
  const previewMessages = session.messages.slice(0, 2);

  const copyLink = () => {
    const url = `https://helixar.ai/share/${session.id}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div ref={modalRef} className="bg-[#1e1e20] w-full max-w-lg rounded-[32px] border border-[#2a2a2d] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white truncate pr-8">{session.title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-[#2a2a2d] rounded-full text-[#8e8e93] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Content Preview Snippet */}
        <div className="px-6 pb-2">
          <div className="bg-[#2a2a2d] rounded-2xl p-6 relative overflow-hidden">
            <div className="space-y-4">
              {previewMessages.map((m, idx) => (
                <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`
                    max-w-[90%] text-[13px] leading-relaxed p-3.5
                    ${m.role === 'user' 
                      ? 'bg-[#b33a72] text-white rounded-2xl rounded-tr-none shadow-lg' 
                      : 'text-zinc-300'
                    }
                  `}>
                    {m.content.length > 180 ? m.content.substring(0, 180) + '...' : m.content}
                  </div>
                </div>
              ))}
              
              {/* Logo in corner of preview */}
              <div className="pt-4 flex justify-end">
                <span className="text-white font-bold text-sm tracking-tight flex items-center gap-1.5 opacity-80">
                  <div className="w-4 h-4 bg-zinc-700 rounded flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
                  </div>
                  Helixar
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Share Actions */}
        <div className="p-8 flex justify-center gap-10">
          <ShareAction 
            onClick={copyLink}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>}
            label="Copy link"
          />
          <ShareAction 
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check out this chat!&url=https://helixar.ai/share/${session.id}`)}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
            label="X"
          />
          <ShareAction 
            onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://helixar.ai/share/${session.id}`)}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>}
            label="LinkedIn"
          />
          <ShareAction 
            onClick={() => window.open(`https://www.reddit.com/submit?url=https://helixar.ai/share/${session.id}`)}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.056 1.597.012.145.021.29.021.437 0 2.321-2.853 4.202-6.36 4.202-3.506 0-6.36-1.881-6.36-4.202 0-.147.01-.292.022-.437a1.741 1.741 0 0 1-1.058-1.597c0-.968.786-1.754 1.754-1.754.463 0 .875.18 1.179.465 1.192-.834 2.83-1.397 4.637-1.485l.849-3.993c.01-.043.03-.08.059-.109l2.587.544a1.233 1.233 0 0 1 .157-.012zM9.25 12c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm5.5 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm-5.5 4.013c-.11 0-.21.04-.29.12-.08.08-.12.18-.12.29 0 .11.04.21.12.29.5.5 1.23.83 2.04.83s1.54-.33 2.04-.83c.08-.08.12-.18.12-.29s-.04-.21-.12-.29c-.08-.08-.18-.12-.29-.12s-.21.04-.29.12c-.33.33-.89.58-1.46.58s-1.13-.25-1.46-.58a.4.4 0 0 0-.29-.12z"/></svg>}
            label="Reddit"
          />
        </div>
      </div>
    </div>
  );
};

const ShareAction = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-3 group">
    <div className="w-12 h-12 rounded-full bg-[#1e1e20] border border-[#2a2a2d] flex items-center justify-center text-[#8e8e93] group-hover:bg-[#2a2a2d] group-hover:text-white transition-all shadow-md group-hover:shadow-indigo-500/10">
      {icon}
    </div>
    <span className="text-[10px] font-bold text-[#8e8e93] group-hover:text-zinc-300 transition-colors tracking-wide uppercase">{label}</span>
  </button>
);
