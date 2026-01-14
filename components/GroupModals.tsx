
import React, { useEffect, useRef } from 'react';

interface GroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  theme: 'dark' | 'light';
}

export const GroupChatModal: React.FC<GroupChatModalProps> = ({ isOpen, onClose, onConfirm, theme }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div ref={modalRef} className={`w-full max-w-md rounded-[28px] border shadow-2xl p-8 flex flex-col items-center text-center space-y-6 ${theme === 'dark' ? 'bg-[#2d2d2f] border-[#3e3e40]' : 'bg-white border-[#e2e2e7]'
        }`}>
        <div className="space-y-2">
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#1c1c1e]'}`}>Start group chat from this conversation</h3>
          <p className={`text-sm font-bold ${theme === 'dark' ? 'text-[#8e8e93]' : 'text-[#636366]'}`}>
            Only this conversation will be shared. Your personal Helixar memory is always private.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2.5 rounded-full text-sm font-bold border transition-all ${theme === 'dark' ? 'bg-[#3e3e40] border-transparent text-white hover:bg-[#4e4e50]' : 'bg-white border-[#e2e2e7] text-zinc-800 hover:bg-zinc-50'
              }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-full text-sm font-bold bg-white text-black hover:bg-zinc-100 transition-all shadow-lg active:scale-95"
          >
            Start group chat
          </button>
        </div>

        <button onClick={() => console.log('Learn more clicked')} className="text-[12px] font-bold text-[#8e8e93] hover:text-[#1c1c1e] transition-colors underline underline-offset-4">
          Learn more
        </button>
      </div>
    </div>
  );
};

interface GroupLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: string;
  theme: 'dark' | 'light';
}

export const GroupLinkModal: React.FC<GroupLinkModalProps> = ({ isOpen, onClose, link, theme }) => {
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

  if (!isOpen) return null;

  const copy = () => {
    navigator.clipboard.writeText(link);
    alert('Group link copied!');
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div ref={modalRef} className={`w-full max-w-md rounded-[28px] border shadow-2xl p-8 flex flex-col space-y-6 ${theme === 'dark' ? 'bg-[#2d2d2f] border-[#3e3e40]' : 'bg-white border-[#e2e2e7]'
        }`}>
        <div className="space-y-1">
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#1c1c1e]'}`}>Group link</h3>
          <p className={`text-[13px] font-bold ${theme === 'dark' ? 'text-[#8e8e93]' : 'text-[#636366]'}`}>
            Share this link with anyone to invite them to the group chat.
          </p>
        </div>

        <div className={`flex items-center gap-2 p-3 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-[#1e1e20] border-[#3e3e40]' : 'bg-[#f1f1f4] border-[#e2e2e7]'
          }`}>
          <input
            readOnly
            value={link}
            className={`flex-1 bg-transparent border-none focus:ring-0 text-[13px] font-bold truncate ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}
          />
        </div>

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2.5 rounded-full text-sm font-bold border transition-all ${theme === 'dark' ? 'bg-[#3e3e40] border-transparent text-white hover:bg-[#4e4e50]' : 'bg-white border-[#e2e2e7] text-zinc-800 hover:bg-zinc-50'
              }`}
          >
            Cancel
          </button>
          <button
            onClick={copy}
            className="flex-1 px-4 py-2.5 rounded-full text-sm font-bold bg-white text-black hover:bg-zinc-100 transition-all shadow-lg active:scale-95"
          >
            Copy link
          </button>
        </div>
      </div>
    </div>
  );
};
