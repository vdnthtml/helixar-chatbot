
import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
  centered?: boolean;
  value: string;
  onChange: (text: string) => void;
  mode?: 'desktop' | 'mobile';
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled, centered, value, onChange, mode = 'desktop' }) => {
  // const [text, setText] = useState(''); // Removed internal state
  const [showModelMenu, setShowModelMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowModelMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value);
      onChange('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
      setShowModelMenu(false);
    }
  };

  return (
    <div className={`relative ${centered ? 'w-full max-w-3xl' : 'w-full max-w-3xl mx-auto'}`} ref={menuRef}>
      {/* Model Selector Menu */}
      {showModelMenu && (
        <div className="absolute bottom-full right-0 mb-3 w-[260px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 overflow-hidden">
          <div className="px-1 space-y-0.5">
            <div className="px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer flex items-center gap-3 group">
              <div className="text-[#8e8e93] group-hover:text-white"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20" /><path d="m18 18 4 4" /><path d="m18 6 4-4" /><path d="m6 18-4 4" /><path d="m6 6-4-4" /></svg></div>
              <div>
                <div className="text-[13px] text-white font-medium">Auto</div>
                <div className="text-[11px] text-[#8e8e93]">Chooses Fast or Expert</div>
              </div>
            </div>
            <div className="px-3 py-2 bg-white/10 rounded-lg cursor-pointer flex items-center gap-3">
              <div className="text-white"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg></div>
              <div className="flex-1">
                <div className="text-[13px] text-white font-medium">Fast</div>
                <div className="text-[11px] text-[#8e8e93]">Quick responses by 4.1</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div className="px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer flex items-center gap-3 group">
              <div className="text-[#8e8e93] group-hover:text-white"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg></div>
              <div>
                <div className="text-[13px] text-white font-medium">Expert</div>
                <div className="text-[11px] text-[#8e8e93]">Thinks hard</div>
              </div>
            </div>
            <div className="px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer flex items-center gap-3 group">
              <div className="text-[#8e8e93] group-hover:text-white"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg></div>
              <div>
                <div className="text-[13px] text-white font-medium">Grok 4.1 Thinking</div>
                <div className="text-[11px] text-[#8e8e93]">Thinks fast</div>
              </div>
            </div>
            <div className="px-3 py-2 opacity-40 cursor-not-allowed flex items-center gap-3">
              <div className="text-[#8e8e93]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></div>
              <div>
                <div className="text-[13px] text-[#8e8e93] font-medium">Heavy</div>
                <div className="text-[11px] text-[#555]">Team of experts</div>
              </div>
            </div>
          </div>

          <div className="my-1 border-t border-[#2a2a2a]"></div>

          <div className="px-1 pb-0.5">
            <div className="px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-[18px] h-[18px] text-[#8e8e93] font-bold text-[10px] border border-[#555] rounded-sm">G</div>
                <div>
                  <div className="text-[13px] text-white font-medium">SuperGrok</div>
                  <div className="text-[11px] text-[#8e8e93]">Unlock extended capabilities</div>
                </div>
              </div>
              <button className="text-[10px] font-bold bg-white text-black px-2 py-0.5 rounded-full hover:bg-neutral-200">Upgrade</button>
            </div>
            <div className="px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#8e8e93]"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                <div>
                  <div className="text-[13px] text-white font-medium">Custom Instructions</div>
                  <div className="text-[11px] text-[#8e8e93]">Not set</div>
                </div>
              </div>
              <button className="text-[10px] font-bold text-[#8e8e93] border border-[#333] px-2 py-0.5 rounded-full group-hover:border-[#777] group-hover:text-white transition-colors">Customize</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Pill/Bar Input */}
      <div className={`
        relative flex items-center transition-all
        ${mode === 'desktop'
          ? 'w-full max-w-3xl mx-auto bg-[#101010] border border-white/10 rounded-[26px] shadow-lg focus-within:ring-1 focus-within:ring-[#333]'
          : 'fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-4 right-4 h-14 bg-black/80 backdrop-blur-xl rounded-full px-4 z-50 shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10 justify-between' // Mobile Command Capsule
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
        {/* Left: Paperclip Button */}
        <button
          onClick={() => console.log('File upload')}
          className="pr-2 py-3 text-[#777] hover:text-white transition-colors flex-shrink-0"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          enterKeyHint="send"
          placeholder={mode === 'mobile' ? "Ask Helixar" : "How can Helixar help?"}
          className={`
            bg-transparent border-none focus:ring-0 text-[16px] resize-none no-scrollbar text-white placeholder-[#666] font-normal leading-relaxed
            ${mode === 'mobile' ? 'flex-1 py-3 px-2 h-full' : 'flex-1 py-4 max-h-[200px]'}
          `}
        />

        {/* Right Group: Model Selector + Action Button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Model Selector (Fast) */}
          <button
            onClick={() => setShowModelMenu(!showModelMenu)}
            className={`flex items-center justify-center rounded-full bg-[#1e1e1e] hover:bg-[#2a2a2a] text-[#e0e0e0] transition-colors border border-transparent hover:border-[#333] ${mode === 'mobile' ? 'w-10 h-10 p-0 text-white' : 'gap-1.5 px-3 py-1.5'}`}
          >
            {mode === 'mobile' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                <span className="text-[13px] font-medium">Fast</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-50"><path d="m6 9 6 6 6-6" /></svg>
              </>
            )}
          </button>

          {/* Dynamic Action Button: Voice or Send */}
          <button
            onClick={value.trim() ? handleSend : () => console.log('Voice')}
            disabled={disabled}
            className={`
               w-10 h-10 flex items-center justify-center rounded-full transition-all shrink-0
               ${value.trim()
                ? 'bg-white text-black hover:bg-neutral-200 active:scale-95'
                : 'bg-[#1e1e1e] text-white hover:bg-[#2a2a2a] active:scale-95'
              }
             `}
          >
            {value.trim() ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20" /><path d="M12 12 2.5 2.5" /><path d="M12 12l9.5-9.5" /><path d="M12 12 2.5 21.5" /><path d="M12 12l9.5 9.5" /></svg>
            )}
          </button>
        </div>
      </div>

      {mode === 'desktop' && (
        <div className="text-center mt-3">
          <p className="text-[11px] text-[#444] font-medium tracking-wide">
            Helixar can make mistakes. Check important info.
          </p>
        </div>
      )}
    </div >
  );
};

const MenuItem = ({ icon, label, extra, onClick }: { icon: React.ReactNode, label: string, extra?: string, onClick?: () => void }) => (
  <button onClick={onClick} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-zinc-300 hover:bg-[#3a3a3c] rounded-xl transition-colors group">
    <div className="text-[#8e8e93] group-hover:text-white transition-colors">
      {icon}
    </div>
    <div className="flex flex-col items-start min-w-0">
      <span className="truncate">{label}</span>
      {extra && <span className="text-[10px] text-zinc-500 font-medium tracking-tight truncate">{extra}</span>}
    </div>
  </button>
);

// Icons for the input menu
const PaperclipIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>;
const DriveIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>;
const ImageIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>;
const ResearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const ShopIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const LightIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>;
const MoreHorizontalIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>;
const ChevronRightIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>;
const StudyIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const WebIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const CanvasIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19 7-7 3 3-7 7-3-3z"></path><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="m2 2 20 20"></path></svg>;
const QuizIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="m9 12 2 2 4-4"></path></svg>;
const HXIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" /></svg>;
const AppsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>;
