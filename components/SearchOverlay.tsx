
import React, { useState, useMemo } from 'react';
import { ChatSession } from '../types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  onSelectChat: (id: string) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, sessions, onSelectChat }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredSessions = useMemo(() => {
    if (!query.trim()) return [];
    return sessions.filter(s =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.messages.some(m => m.content.toLowerCase().includes(query.toLowerCase()))
    );
  }, [sessions, query]);

  const suggestedActions = [
    { icon: <PlusIcon />, label: 'New Chat', action: () => console.log('New chat') },
    { icon: <ClockIcon />, label: 'Search History', action: () => console.log('History') },
    { icon: <FolderIcon />, label: 'Browse Projects', action: () => console.log('Projects') },
  ];

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, (filteredSessions.length || suggestedActions.length) - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (query && filteredSessions.length > 0) {
        onSelectChat(filteredSessions[selectedIndex].id);
        onClose();
      } else if (!query && suggestedActions[selectedIndex]) {
        suggestedActions[selectedIndex].action();
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm pt-[20%]">
      <div className="w-[600px] bg-[#121212] border border-white/10 rounded-xl shadow-2xl overflow-hidden">

        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
          <div className="text-neutral-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            autoFocus
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search conversations..."
            className="flex-1 bg-transparent border-none focus:outline-none text-lg text-white placeholder-neutral-600"
          />
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[400px] overflow-y-auto">
          {query && filteredSessions.length > 0 ? (
            // Search Results
            <div className="p-2">
              {filteredSessions.map((session, index) => (
                <button
                  key={session.id}
                  onClick={() => { onSelectChat(session.id); onClose(); }}
                  className={`w-full p-3 rounded-lg cursor-pointer flex justify-between items-center transition-colors ${index === selectedIndex ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-neutral-500">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <span className="text-sm text-white truncate">{session.title}</span>
                  </div>
                  {index === selectedIndex && (
                    <span className="text-xs text-neutral-500 ml-2">Enter</span>
                  )}
                </button>
              ))}
            </div>
          ) : !query ? (
            // Suggested Actions (Empty State)
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Suggested Actions
              </div>
              {suggestedActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => { action.action(); onClose(); }}
                  className={`w-full p-3 rounded-lg cursor-pointer flex justify-between items-center transition-colors ${index === selectedIndex ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-neutral-500">
                      {action.icon}
                    </div>
                    <span className="text-sm text-white">{action.label}</span>
                  </div>
                  {index === selectedIndex && (
                    <span className="text-xs text-neutral-500">Enter</span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            // No Results
            <div className="p-8 text-center">
              <div className="text-neutral-500 mb-2">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <p className="text-sm text-neutral-400">No results found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* --- Icons --- */
const PlusIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const ClockIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const FolderIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>;
